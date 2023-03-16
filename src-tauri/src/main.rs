#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

mod send_mail;
mod file_handler;

use std::fmt::Display;
use std::fs;
use mime_guess::MimeGuess;

use serde::Deserialize;


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_mime_type(file_path: &str) -> String {
    println!("Now get_mime_type is running");
    let mime_type = MimeGuess::from_path(file_path).first_or_octet_stream();
    println!("The MIME type of {} is {}", file_path, mime_type);
    mime_type.to_string()
}

#[tauri::command]
fn get_file_size(file_path: &str) -> Result<serde_json::Value, tauri::Error> {
    let metadata = fs::metadata(file_path)?;
    let size = metadata.len();
    let result = serde_json::to_value(size)?;
    Ok(result)
}


#[tauri::command]
async fn read_excel() {
    let file_path = String::from(r"C:\Users\User\Desktop\sspisok jur (karberi 18) 2022.xlsx");
    let email_columns = vec![String::from("EMail"), String::from("E-Mail")];
    let name_columns = vec![String::from("Имя"), String::from("Name")];
    let surname_columns = vec![String::from("Фамилия"), String::from("Surname")];
    let result = file_handler::read_excel_with_email(
        file_path,
        &email_columns,
        &name_columns,
        &surname_columns,
    );
    println!("{:#?}", result);
}


/////////////////////////////////////////////////////////////////////////

#[tauri::command]
fn get_excel_header(file_path: String) -> Vec<String> {
    match file_handler::get_header(file_path) {
        Ok(header) => header,
        Err(e) => {
            eprintln!("Error: {}", e.to_string());
            vec![]
        }
    }
}



#[tauri::command]
async fn send_smtp_mail(
    senders_name: String,
    title: String,
    recipients_name: String,
    text: String,
    files: Vec<String>,
) {
    println!("senders_name: {senders_name}");
    println!("title: {title}");
    println!("recipients_name: {recipients_name}");
    println!("text: {text}");
    println!("files: {:?}", files);

    // Send email using the data in mail_fields

    match send_mail::main(senders_name, title, recipients_name, text, files).await {
        Ok(_) => println!("Email sent successfully"),
        Err(e) => eprintln!("Error sending email: {}", e),
    }
}


fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_mime_type, get_file_size, send_smtp_mail, read_excel, get_excel_header])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
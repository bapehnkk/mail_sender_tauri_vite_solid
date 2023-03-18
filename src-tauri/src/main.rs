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
/////////////////////////////////////////

use tauri::Manager;
use tokio::sync::mpsc;
use tokio::sync::Mutex;
use tracing::info;
use tracing_subscriber;
use std::{thread, time};

#[derive(Debug)]
#[derive(serde::Deserialize)]
struct Message {
    senders_name: String,
    title: String,
    recipients_name: String,
    text: String,
    files: Vec<String>,
    file_path: String,
    selected_emails: Vec<String>,
    selected_names: Vec<String>,
    selected_surnames: Vec<String>,
}


struct AsyncProcInputTx {
    inner: Mutex<mpsc::Sender<Message>>,
}

fn main() {
    tracing_subscriber::fmt::init();

    let (async_proc_input_tx, async_proc_input_rx) = mpsc::channel(1);
    let (async_proc_output_tx, mut async_proc_output_rx) = mpsc::channel(1);

    tauri::Builder::default()
        .manage(AsyncProcInputTx {
            inner: Mutex::new(async_proc_input_tx),
        })
        .invoke_handler(tauri::generate_handler![start_mail_sending, greet, get_mime_type, get_file_size, send_smtp_mail, read_excel, get_excel_header])
        .setup(|app| {
            tauri::async_runtime::spawn(async move {
                async_process_model(async_proc_input_rx, async_proc_output_tx).await
            });

            let app_handle = app.handle();
            tauri::async_runtime::spawn(async move {
                loop {
                    if let Some(message) = async_proc_output_rx.recv().await {
                        println!("senders_name: {}", message.senders_name);
                        println!("title: {}", message.title);
                        println!("recipients_name: {}", message.recipients_name);
                        println!("text: {}", message.text);
                        println!("files: {:?}", message.files);
                        println!("file_path: {:?}", message.file_path);
                        println!("selected_emails: {:?}", message.selected_emails);
                        println!("selected_names: {:?}", message.selected_names);
                        println!("selected_surnames: {:?}", message.selected_surnames);
                        // for i in 0..10 {
                        //     rs2js(format!("i: {}\n out: {}", i, output), &app_handle);
                        // }
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn rs2js<R: tauri::Runtime>(message: String, manager: &impl Manager<R>) {
    info!(?message, "rs2js");
    manager
        .emit_all("rs2js", format!("rs: {}", message))
        .unwrap();
}

#[tauri::command]
async fn start_mail_sending(
    message: Message,
    state: tauri::State<'_, AsyncProcInputTx>,
) -> Result<(), String> {
    info!(?message.title, "start_mail_sending");

    let async_proc_input_tx = state.inner.lock().await;
    async_proc_input_tx
        .send(message)
        .await
        .map_err(|e| e.to_string())
}


async fn async_process_model(
    mut input_rx: mpsc::Receiver<Message>,
    output_tx: mpsc::Sender<Message>,
) -> Result<(), Box<dyn std::error::Error + Send + Sync>> {
    while let Some(message) = input_rx.recv().await {
        // Process the arguments as desired
        let output = "Some output".to_string();  // Replace with your actual output
        output_tx.send(message).await?;
    }

    Ok(())
}

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    file_path: String,
    selected_emails: Vec<String>,
    selected_names: Vec<String>,
    selected_surnames: Vec<String>,
) {
    println!("senders_name: {senders_name}");
    println!("title: {title}");
    println!("recipients_name: {recipients_name}");
    println!("text: {text}");
    println!("files: {:?}", files);
    println!("file_path: {:?}", file_path);
    println!("selected_emails: {:?}", selected_emails);
    println!("selected_names: {:?}", selected_names);
    println!("selected_surnames: {:?}", selected_surnames);


    // Send email using the data in mail_fields

    // match send_mail::main(senders_name, title, recipients_name, text, files).await {
    //     Ok(_) => println!("Email sent successfully"),
    //     Err(e) => eprintln!("Error sending email: {}", e),
    // }
}


// fn main() {
//     tauri::Builder::default()
//         .invoke_handler(tauri::generate_handler![greet, get_mime_type, get_file_size, send_smtp_mail, read_excel, get_excel_header])
//         .run(tauri::generate_context!())
//         .expect("error while running tauri application");
// }


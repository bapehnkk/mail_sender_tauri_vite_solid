#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::fs;
use mime_guess::MimeGuess;


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



fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, get_mime_type, get_file_size])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

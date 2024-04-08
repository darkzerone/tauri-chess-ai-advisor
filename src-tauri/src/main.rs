// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use reqwest::Error;
use std::env;
use tauri::async_runtime;

use openai::{
    chat::{ChatCompletion, ChatCompletionMessage, ChatCompletionMessageRole},
    set_base_url, set_key,
};

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}!", name)
}

#[tauri::command]
fn call_openai_api(prompt: String, window: tauri::Window) {
    async_runtime::spawn(async move {
        match call_openai_api_async(&prompt).await {
            Ok(result) => {
                window.emit("openai_response", Some(result)).unwrap();
            }
            Err(err) => {
                window.emit("openai_error", Some(err.to_string())).unwrap();
            }
        }
    });
}

async fn call_openai_api_async(prompt: &str) -> Result<String, Error> {
    let openai_key: String = env::var("OPENAI_KEY").expect("OPENAI_KEY must be set");
    set_key(openai_key);
    set_base_url("https://api.openai.com/v1".to_string());

    println!("Prompt: {}", prompt);

    let messages = vec![
        ChatCompletionMessage {
            role: ChatCompletionMessageRole::System,
            content: Some("
                You will receive a stringified object containing a 2-dimensional array containging a chessboard grid with the pieces marked on it. The positions on the chessboard should be marked as follows:
                - Empty square: ''
                - White pawn: 'P'
                - White rook: 'R'
                - White knight: 'N'
                - White bishop: 'B'
                - White queen: 'Q'
                - White king: 'K'
                - Black pawn: 'p'
                - Black rook: 'r'
                - Black knight: 'n'
                - Black bishop: 'b'
                - Black queen: 'q'
                - Black king: 'k'
                Additionaly you will receive who's turn it is W(White) or B(Black) indicating who's turn it is now.
                Your task is to analyse the move for the current player according to the official chess rules.
                You are only allowed to return a string containing the advise for the current player.
                You are not allowed to return the move itself, but only give advise. You should not wish the player good luck.
                ".to_string()),
            name: None,
            function_call: None,
        },
        ChatCompletionMessage {
            role: ChatCompletionMessageRole::User,
            content: Some(prompt.to_string()),
            name: None,
            function_call: None,
        },
    ];

    let chat_completion = ChatCompletion::builder("gpt-3.5-turbo", messages)
        .create()
        .await;

    let returned_message = chat_completion
        .unwrap()
        .choices
        .first()
        .unwrap()
        .message
        .clone();

    Ok(returned_message.content.unwrap())
}

fn main() {
    dotenv().ok();
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, call_openai_api])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

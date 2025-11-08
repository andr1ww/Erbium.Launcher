// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::RwLock;
use std::time::{SystemTime, UNIX_EPOCH};

use serde::Deserialize;
use tauri::State;

use discord_rich_presence::{
    activity::{self, Activity},
    DiscordIpc, DiscordIpcClient,
};

#[derive(Deserialize)]
struct RpcConfig {
    client_id: String,
    state: String,
    details: String,
    large_image: String,
    large_text: String,
    small_image: String,
    small_text: String,
    button_1_text: String,
    button_1_url: String,
    button_2_text: String,
    button_2_url: String,
    enable_timer: bool,
}

struct RpcClient {
    client: Option<DiscordIpcClient>,
}

#[tauri::command]
fn start_rpc(config: RpcConfig, state: State<RwLock<RpcClient>>) -> Result<(), String> {
    let mut rpc_client = state.write().map_err(|e| e.to_string())?;
    let mut client = DiscordIpcClient::new(&config.client_id);
    client.connect().map_err(|e| e.to_string())?;

    let mut activity = Activity::new().details(&config.details);

    if config.state != "none" {
        activity = activity.state(&config.state);
    }

    let mut assets = activity::Assets::new();
    if config.large_image != "none" {
        assets = assets.large_image(&config.large_image);
    }
    if config.large_text != "none" {
        assets = assets.large_text(&config.large_text);
    }
    if config.small_image != "none" {
        assets = assets.small_image(&config.small_image);
    }
    if config.small_text != "none" {
        assets = assets.small_text(&config.small_text);
    }
    activity = activity.assets(assets);

    let mut buttons = Vec::new();
    if config.button_1_text != "none" && config.button_1_url != "none" {
        buttons.push(activity::Button::new(
            &config.button_1_text,
            &config.button_1_url,
        ));
    }
    if config.button_2_text != "none" && config.button_2_url != "none" {
        buttons.push(activity::Button::new(
            &config.button_2_text,
            &config.button_2_url,
        ));
    }
    if !buttons.is_empty() {
        activity = activity.buttons(buttons);
    }

    if config.enable_timer {
        let time_unix = SystemTime::now()
            .duration_since(UNIX_EPOCH)
            .map(|t| t.as_secs() as i64)
            .unwrap_or(0);
        activity = activity.timestamps(activity::Timestamps::new().start(time_unix));
    }

    client.set_activity(activity).map_err(|e| e.to_string())?;
    rpc_client.client = Some(client);

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_opener::init())
        .manage(RwLock::new(RpcClient { client: None }))
        .invoke_handler(tauri::generate_handler![start_rpc])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

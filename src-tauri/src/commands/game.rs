use std::ffi::{CString, OsStr, OsString};
use std::mem::zeroed;
use std::os::windows::process::CommandExt;
use std::path::{Path, PathBuf};
use std::process::{Command, Stdio};
use std::io::{BufRead, BufReader};
use winapi::shared::windef::HWND;
use winapi::um::processthreadsapi::GetProcessId;
use winapi::um::shellapi::{ShellExecuteExA, SEE_MASK_NOCLOSEPROCESS, SHELLEXECUTEINFOA};
use winapi::um::{handleapi::CloseHandle, winbase::CREATE_SUSPENDED, winuser::SW_SHOW};

use super::utilities;

const CREATE_NO_WINDOW: u32 = 0x08000000;

#[tauri::command]
pub fn launch_game(
    file_path: String,
    email: String,
    password: String,
    redirect_link: String,
    backend: String,
    use_backend_param: bool,
    inject_extra_dlls: bool,
    extra_dll_links: String,
    use_custom_paks: bool,
    custom_paks_links: String,
    is_game_server: bool,
) -> Result<bool, String> {
    println!("=== Launch Game Debug ===");
    println!("file_path: {}", file_path);
    println!("redirect_link: {}", redirect_link);
    println!("is_game_server: {}", is_game_server);
    println!("email: {}", email);
    println!("backend: {}", backend);
    
    if !utilities::is_any_fortnite_process_running() {
        println!("No Fortnite processes detected - cleaning up any remnants");
        let _ = super::utilities::kill_all_procs();
    } else if is_game_server {
        println!("Fortnite processes detected - killing for game server launch");
        let _ = super::utilities::kill_all_procs();
        std::thread::sleep(std::time::Duration::from_secs(1));
    } else {
        println!("Fortnite process already running (likely game server) - keeping it alive");
    }

    let game_path = PathBuf::from(&file_path);
    
    let win64_dir = game_path
        .parent()
        .ok_or("Failed to get Win64 directory")?;
    
    let binaries_dir = win64_dir
        .parent()
        .ok_or("Failed to get Binaries directory")?;
    
    let game_game_directory = binaries_dir
        .parent()
        .ok_or("Failed to get FortniteGame directory")?;

    println!("FortniteGame directory: {:?}", game_game_directory);

    let game_dll_path = super::utilities::handle_game_dll_path(&game_game_directory);
    println!("Target DLL path: {:?}", game_dll_path);

    if game_dll_path.exists() {
        if utilities::is_any_fortnite_process_running() {
            println!("Fortnite process detected - skipping DLL removal (will overwrite)");
        } else {
            println!("No Fortnite processes running - removing existing game DLL...");
            if let Err(err) = super::utilities::remove_game_dll_sync(&game_game_directory) {
                println!("Warning: Failed to remove game DLL: {}", err);
                println!("Will attempt to overwrite instead...");
            }
        }
    }

    if game_dll_path.exists() && utilities::is_any_fortnite_process_running() {
        println!("Redirect DLL already in place and Fortnite is running - reusing existing DLL");
    } else {
        if redirect_link.starts_with("http://") || redirect_link.starts_with("https://") {
            println!("Downloading redirect DLL from URL...");
            if let Err(err) = super::utilities::download_file(&redirect_link, &game_dll_path) {
                return Err(format!("Failed to download redirect DLL: {}", err));
            }
            println!("Redirect DLL downloaded successfully");
        } else {
            println!("Copying redirect DLL from local path...");
            let source_path = PathBuf::from(&redirect_link);
            println!("Source path: {:?}", source_path);
            
            if !source_path.exists() {
                return Err(format!(
                    "Redirect DLL not found at '{}'. Please check the path in Settings.",
                    redirect_link
                ));
            }

            if let Some(parent) = game_dll_path.parent() {
                if !parent.exists() {
                    println!("Creating directory: {:?}", parent);
                    std::fs::create_dir_all(parent)
                        .map_err(|e| format!("Failed to create directory: {}", e))?;
                }
            }

            match std::fs::copy(&source_path, &game_dll_path) {
                Ok(bytes) => println!("Redirect DLL copied successfully ({} bytes)", bytes),
                Err(e) => return Err(format!("Failed to copy redirect DLL: {}", e))
            }
        }
    }

    let cwd = win64_dir;
    let fn_launcher = cwd.join("FortniteLauncher.exe");
    let fn_shipping = cwd.join("FortniteClient-Win64-Shipping.exe");
    let eac = cwd.join("FortniteClient-Win64-Shipping_BE.exe");

    if !game_dll_path.exists() {
        return Err("Redirect DLL not found after copy".to_string());
    }

    println!("fn_shipping: {:?}", fn_shipping);
    println!("fn_launcher: {:?}", fn_launcher);
    println!("eac: {:?}", eac);

    let mut combined_args = vec![
        "-epicapp=Fortnite",
        "-epicenv=Prod",
        "-epiclocale=en-us",
        "-epicportal",
        "-nobe",
        "-fromfl=eac",
        "-nocodeguards",
        "-nouac",
        "-fltoken=3db3ba5dcbd2e16703f3978d",
        "-caldera=eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiYmU5ZGE1YzJmYmVhNDQwN2IyZjQwZWJhYWQ4NTlhZDQiLCJnZW5lcmF0ZWQiOjE2Mzg3MTcyNzgsImNhbGRlcmFHdWlkIjoiMzgxMGI4NjMtMmE2NS00NDU3LTliNTgtNGRhYjNiNDgyYTg2IiwiYWNQcm92aWRlciI6IkVhc3lBbnRpQ2hlYXQiLCJub3RlcyI6IiIsImZhbGxiYWNrIjpmYWxzZX0.VAWQB67RTxhiWOxx7DBjnzDnXyyEnX7OljJm-j2d88G_WgwQ9wrE6lwMEHZHjBd1ISJdUO1UVUqkfLdU5nofBQs",
        "-skippatchcheck",
        "-AUTH_TYPE=epic",
        "-useallavailablecores",
        "-steamimportavailable",
    ]
    .into_iter()
    .map(|s| s.to_string())
    .collect::<Vec<String>>();

    if is_game_server {
        println!("Configuring as GAME SERVER...");
        combined_args.push("-log".to_string());
        combined_args.push("-nullrhi".to_string());
        combined_args.push("-nosound".to_string());
        combined_args.push("-nosplash".to_string());
    }

    combined_args.push(format!("-AUTH_LOGIN={}", email));
    combined_args.push(format!("-AUTH_PASSWORD={}", password));

    if use_backend_param && !backend.is_empty() {
        combined_args.push(format!("-backend={}", backend));
    }

    if use_custom_paks && !custom_paks_links.trim().is_empty() {
        combined_args.push(format!("-custompaks={}", custom_paks_links));
    }

    let combined_args_os: Vec<OsString> = combined_args
        .iter()
        .map(|arg| OsString::from(arg))
        .collect();

    println!("Launch arguments prepared");

    if is_game_server {
        launch_game_server(
            &fn_shipping,
            &combined_args_os,
            cwd,
            win64_dir,
            inject_extra_dlls,
            &extra_dll_links,
        )
    } else {
        launch_client(
            &fn_shipping,
            &combined_args_os,
            cwd,
            win64_dir,
            inject_extra_dlls,
            &extra_dll_links,
            &fn_launcher,
            &eac,
        )
    }
}

fn launch_game_server(
    fn_shipping: &PathBuf,
    combined_args_os: &[OsString],
    cwd: &Path,
    win64_dir: &Path,
    inject_extra_dlls: bool,
    extra_dll_links: &str,
) -> Result<bool, String> {
    println!("=== GAME SERVER MODE ===");
    
    let links: Vec<&str> = if inject_extra_dlls && !extra_dll_links.trim().is_empty() {
        extra_dll_links
            .split(',')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .collect()
    } else {
        Vec::new()
    };

    if links.is_empty() {
        return Err("Game server mode requires at least one DLL (game server DLL)".to_string());
    }

    println!("Found {} game server DLL(s) to inject", links.len());

    println!("Creating game server process (suspended with stdout)...");
    let mut child = Command::new(fn_shipping)
        .args(
            combined_args_os
                .iter()
                .map(|arg| arg as &OsStr)
                .collect::<Vec<&OsStr>>(),
        )
        .current_dir(cwd)
        .creation_flags(CREATE_SUSPENDED)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to spawn game server process: {}", e))?;

    let pid = child.id();
    println!("Game server process created with PID: {} (suspended)", pid);

    if links.len() > 1 {
        println!("Preparing nullrhi patch (first DLL)...");
        let nullrhi_dll = prepare_dll(links[0], win64_dir, 0)?;
        
        println!("Injecting nullrhi patch while suspended...");
        match utilities::inject_dll(pid, nullrhi_dll.to_str().ok_or("Invalid DLL path")?) {
            Ok(_) => println!("✓ Nullrhi patch injected"),
            Err(e) => println!("Warning: Failed to inject nullrhi while suspended: {}", e),
        }
    }

    println!("Resuming process threads...");
    utilities::resume_process_threads(pid)?;
    println!("Process resumed");

    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let reader = BufReader::new(stdout);

    let gs_dll_index = if links.len() > 1 { 1 } else { 0 };
    let gs_dll_link = links[gs_dll_index].to_string();
    let gs_dll_win64 = win64_dir.to_path_buf();
    
    println!("Monitoring game server output for injection trigger...");
    
    let injection_handle = std::thread::spawn(move || -> Result<(), String> {
        for line in reader.lines() {
            if let Ok(line) = line {
                println!("[GameServer] {}", line);
                
                if line.contains("[UOnlineAccountCommon::ForceLogout] ForceLogout (") {
                    if let Some(start) = line.find("reason \"") {
                        if let Some(end) = line[start + 8..].find("\"") {
                            let reason = &line[start + 8..start + 8 + end];
                            return Err(format!("Failed to login: {}", reason));
                        }
                    }
                    return Err("Failed to login (unknown reason)".to_string());
                }
                
                if line.contains("CreatingParty") {
                    println!("✓ Detected 'CreatingParty' - injecting game server DLL...");
                    
                    let gs_dll_path = prepare_dll(&gs_dll_link, &gs_dll_win64, gs_dll_index)?;
                    
                    for attempt in 1..=5 {
                        println!("Game server DLL injection attempt {}/5", attempt);
                        match utilities::inject_dll(pid, gs_dll_path.to_str().ok_or("Invalid DLL path")?) {
                            Ok(_) => {
                                println!("✓ Game server DLL injected successfully!");
                                return Ok(());
                            }
                            Err(e) => {
                                println!("✗ Injection attempt {} failed: {}", attempt, e);
                                if attempt < 5 {
                                    std::thread::sleep(std::time::Duration::from_secs(2));
                                }
                            }
                        }
                    }
                    
                    return Err("Failed to inject game server DLL after 5 attempts".to_string());
                }
            }
        }
        
        Err("Game server process ended without triggering injection".to_string())
    });

    match injection_handle.join() {
        Ok(Ok(())) => {
            println!("✓ Game server launched successfully!");
            Ok(true)
        }
        Ok(Err(e)) => {
            println!("Game server error: {}", e);
            let _ = child.kill();
            Err(e)
        }
        Err(_) => {
            let _ = child.kill();
            Err("Game server monitoring thread panicked".to_string())
        }
    }
}

fn launch_client(
    fn_shipping: &PathBuf,
    combined_args_os: &[OsString],
    cwd: &Path,
    win64_dir: &Path,
    inject_extra_dlls: bool,
    extra_dll_links: &str,
    fn_launcher: &PathBuf,
    eac: &PathBuf,
) -> Result<bool, String> {
    println!(" CLIENT MODE ");

    let hwnd: HWND = std::ptr::null_mut();
    let exe_str = fn_shipping.to_str().ok_or("Invalid path to executable")?;
    let exe_cstring = CString::new(exe_str).map_err(|e| format!("CString error: {}", e))?;

    let combined_args_str: String = combined_args_os
        .iter()
        .map(|s| s.to_string_lossy())
        .collect::<Vec<_>>()
        .join(" ");

    let args_cstring = CString::new(combined_args_str).map_err(|e| format!("CString error: {}", e))?;
    let lp_verb = CString::new("runas").unwrap();

    let mut sei: SHELLEXECUTEINFOA = unsafe { zeroed() };
    sei.cbSize = std::mem::size_of::<SHELLEXECUTEINFOA>() as u32;
    sei.fMask = SEE_MASK_NOCLOSEPROCESS;
    sei.hwnd = hwnd;
    sei.lpVerb = lp_verb.as_ptr();
    sei.lpFile = exe_cstring.as_ptr();
    sei.lpParameters = args_cstring.as_ptr();
    sei.nShow = SW_SHOW;

    println!("Launching client executable: {}", exe_str);
    let success = unsafe { ShellExecuteExA(&mut sei) };
    if success == 0 {
        return Err(format!("ShellExecuteExA failed: {}", std::io::Error::last_os_error()));
    }

    if sei.hProcess.is_null() {
        return Err("Failed to get process handle from ShellExecuteEx".to_string());
    }

    let pid = unsafe { GetProcessId(sei.hProcess) };
    println!("Client process started with PID: {}", pid);
    
    unsafe { CloseHandle(sei.hProcess) };
    println!("Closed ShellExecuteEx handle");

    println!("Waiting initial 5 seconds for client process to stabilize...");
    std::thread::sleep(std::time::Duration::from_secs(5));

    println!("Starting suspended EAC process...");
    let _eac_proc = Command::new(eac)
        .creation_flags(CREATE_NO_WINDOW | CREATE_SUSPENDED)
        .args(combined_args_os.iter().map(|arg| arg as &OsStr).collect::<Vec<&OsStr>>())
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start EAC: {}", e))?;

    println!("Starting suspended Launcher process...");
    let _launcher_proc = Command::new(fn_launcher)
        .creation_flags(CREATE_NO_WINDOW | CREATE_SUSPENDED)
        .args(combined_args_os.iter().map(|arg| arg as &OsStr).collect::<Vec<&OsStr>>())
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start Launcher: {}", e))?;

    println!("Waiting **60 seconds** for full game initialization before DLL injection...");
    std::thread::sleep(std::time::Duration::from_secs(60));

    if !utilities::test_process_ready(pid) {
        println!("Warning: Process still doesn't seem ready for memory operations after 60s");
    }

    if inject_extra_dlls && !extra_dll_links.trim().is_empty() {
        println!("=== STARTING CLIENT DLL INJECTION AFTER LONG WAIT ===");
        
        let links: Vec<&str> = extra_dll_links
            .split(',')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .collect();

        println!("Found {} DLL(s) to inject for client", links.len());

        for (idx, dll_link) in links.iter().enumerate() {
            println!("Processing client DLL {}/{}: {}", idx + 1, links.len(), dll_link);
            
            if !utilities::is_process_alive(pid) {
                return Err(format!("Client process (PID: {}) died before we could inject DLL", pid));
            }

            match prepare_dll(dll_link, win64_dir, idx) {
                Ok(dll_path) => {
                    println!("Prepared DLL: {:?}", dll_path);
                    
                    let mut injected = false;
                    for attempt in 1..=3 {
                        println!("Injection attempt {}/3 for DLL {}", attempt, dll_path.display());
                        match utilities::inject_dll(pid, dll_path.to_str().ok_or("Invalid DLL path")?) {
                            Ok(_) => {
                                println!("✓ Client DLL {} injected successfully", idx + 1);
                                injected = true;
                                break;
                            }
                            Err(e) => {
                                println!("Injection failed (attempt {}): {}", attempt, e);
                                if attempt < 3 {
                                    std::thread::sleep(std::time::Duration::from_secs(4));
                                }
                            }
                        }
                    }

                    if !injected {
                        return Err(format!("Failed to inject client DLL '{}' after 3 attempts", dll_path.display()));
                    }

                    std::thread::sleep(std::time::Duration::from_millis(500));
                }
                Err(e) => {
                    return Err(format!("Failed to prepare client DLL {}: {}", idx + 1, e));
                }
            }
        }

        println!("Client DLL injection process completed");
    } else {
        println!("No client DLLs configured for injection");
    }

    println!("Client launched successfully!");
    Ok(true)
}

fn prepare_dll(dll_link: &str, win64_dir: &Path, idx: usize) -> Result<PathBuf, String> {
    if dll_link.starts_with("http://") || dll_link.starts_with("https://") {
        let filename = match dll_link.rsplit('/').next() {
            Some(name) if !name.is_empty() => name.replace('%', "_"),
            _ => format!("InjectedDll_{}.dll", idx),
        };

        let dll_save_path = win64_dir.join(filename);

        println!("Downloading DLL to: {:?}", dll_save_path);
        utilities::download_file(dll_link, &dll_save_path)
            .map_err(|e| format!("Failed to download DLL '{}': {}", dll_link, e))?;

        Ok(dll_save_path)
    } else {
        let local_path = PathBuf::from(dll_link);
        println!("Using local DLL: {:?}", local_path);
        
        if !local_path.exists() {
            return Err(format!("DLL not found at '{}'", dll_link));
        }

        let filename = local_path.file_name()
            .and_then(|n| n.to_str())
            .map(|s| s.to_string())
            .unwrap_or_else(|| format!("InjectedDll_{}.dll", idx));
        
        let dll_save_path = win64_dir.join(&filename);
        
        println!("Copying DLL to: {:?}", dll_save_path);
        std::fs::copy(&local_path, &dll_save_path)
            .map_err(|e| format!("Failed to copy DLL '{}': {}", dll_link, e))?;
        
        Ok(dll_save_path)
    }
}

#[tauri::command]
pub fn close_game() -> Result<(), String> {
    let _ = utilities::kill_all_procs();
    Ok(())
}
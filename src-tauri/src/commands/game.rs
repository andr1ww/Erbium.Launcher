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
    if !utilities::is_any_fortnite_process_running() {
        let _ = super::utilities::kill_all_procs();
    } else if is_game_server {
        let _ = super::utilities::kill_all_procs();
        std::thread::sleep(std::time::Duration::from_secs(1));
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

    let game_dll_path = super::utilities::handle_game_dll_path(&game_game_directory);

    if game_dll_path.exists() {
        if !utilities::is_any_fortnite_process_running() {
            let _ = super::utilities::remove_game_dll_sync(&game_game_directory);
        }
    }

    if !game_dll_path.exists() || !utilities::is_any_fortnite_process_running() {
        if redirect_link.starts_with("http://") || redirect_link.starts_with("https://") {
            if let Err(err) = super::utilities::download_file(&redirect_link, &game_dll_path) {
                return Err(format!("Failed to download redirect DLL: {}", err));
            }
        } else {
            let source_path = PathBuf::from(&redirect_link);
            
            if !source_path.exists() {
                return Err(format!(
                    "Redirect DLL not found at '{}'. Please check the path in Settings.",
                    redirect_link
                ));
            }

            if let Some(parent) = game_dll_path.parent() {
                if !parent.exists() {
                    std::fs::create_dir_all(parent)
                        .map_err(|e| format!("Failed to create directory: {}", e))?;
                }
            }

            std::fs::copy(&source_path, &game_dll_path)
                .map_err(|e| format!("Failed to copy redirect DLL: {}", e))?;
        }
    }

    let cwd = win64_dir;
    let fn_launcher = cwd.join("FortniteLauncher.exe");
    let fn_shipping = cwd.join("FortniteClient-Win64-Shipping.exe");
    let eac = cwd.join("FortniteClient-Win64-Shipping_BE.exe");

    if !game_dll_path.exists() {
        return Err("Redirect DLL not found after copy".to_string());
    }

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
        return Err("need to put a dll in the gs optian".to_string());
    }

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

    if links.len() > 1 {
        let nullrhi_dll = prepare_dll(links[0], win64_dir, 0)?;
        let _ = utilities::inject_dll(pid, nullrhi_dll.to_str().ok_or("Invalid DLL path")?);
    }

    utilities::resume_process_threads(pid)?;

    let stdout = child.stdout.take().ok_or("Failed to capture stdout")?;
    let reader = BufReader::new(stdout);

    let gs_dll_index = if links.len() > 1 { 1 } else { 0 };
    let gs_dll_link = links[gs_dll_index].to_string();
    let gs_dll_win64 = win64_dir.to_path_buf();
    
    let injection_handle = std::thread::spawn(move || -> Result<(), String> {
        for line in reader.lines() {
            if let Ok(line) = line {
                if line.contains("[UOnlineAccountCommon::ForceLogout] ForceLogout (") {
                    if let Some(start) = line.find("reason \"") {
                        if let Some(end) = line[start + 8..].find("\"") {
                            let reason = &line[start + 8..start + 8 + end];
                            return Err(format!("Failed to login: {}", reason));
                        }
                    }
                    return Err("Failed to login".to_string());
                }
                
                if line.contains("CreatingParty") {
                    let gs_dll_path = prepare_dll(&gs_dll_link, &gs_dll_win64, gs_dll_index)?;
                    
                    for attempt in 1..=5 {
                        match utilities::inject_dll(pid, gs_dll_path.to_str().ok_or("Invalid DLL path")?) {
                            Ok(_) => return Ok(()),
                            Err(_) => {
                                if attempt < 5 {
                                    std::thread::sleep(std::time::Duration::from_secs(2));
                                }
                            }
                        }
                    }
                    
                    return Err("Failed to inject game server DLL".to_string());
                }
            }
        }
        
        Err("Game server process ended without injection".to_string())
    });

    match injection_handle.join() {
        Ok(Ok(())) => Ok(true),
        Ok(Err(e)) => {
            let _ = child.kill();
            Err(e)
        }
        Err(_) => {
            let _ = child.kill();
            Err("Injection thread panicked".to_string())
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

    let success = unsafe { ShellExecuteExA(&mut sei) };
    if success == 0 {
        return Err(format!("ShellExecuteExA failed: {}", std::io::Error::last_os_error()));
    }

    if sei.hProcess.is_null() {
        return Err("Failed to get process handle".to_string());
    }

    let pid = unsafe { GetProcessId(sei.hProcess) };
    unsafe { CloseHandle(sei.hProcess) };

    std::thread::sleep(std::time::Duration::from_secs(5));

    let _eac_proc = Command::new(eac)
        .creation_flags(CREATE_NO_WINDOW | CREATE_SUSPENDED)
        .args(combined_args_os.iter().map(|arg| arg as &OsStr).collect::<Vec<&OsStr>>())
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start EAC: {}", e))?;

    let _launcher_proc = Command::new(fn_launcher)
        .creation_flags(CREATE_NO_WINDOW | CREATE_SUSPENDED)
        .args(combined_args_os.iter().map(|arg| arg as &OsStr).collect::<Vec<&OsStr>>())
        .stdout(Stdio::piped())
        .spawn()
        .map_err(|e| format!("Failed to start Launcher: {}", e))?;

    std::thread::sleep(std::time::Duration::from_secs(60));

    if inject_extra_dlls && !extra_dll_links.trim().is_empty() {
        let links: Vec<&str> = extra_dll_links
            .split(',')
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .collect();

        for (idx, dll_link) in links.iter().enumerate() {
            if !utilities::is_process_alive(pid) {
                return Err(format!("Proc died before injection"));
            }

            let dll_path = prepare_dll(dll_link, win64_dir, idx)?;
            
            let mut injected = false;
            for attempt in 1..=3 {
                match utilities::inject_dll(pid, dll_path.to_str().ok_or("Invalid DLL path")?) {
                    Ok(_) => {
                        injected = true;
                        break;
                    }
                    Err(_) => {
                        if attempt < 3 {
                            std::thread::sleep(std::time::Duration::from_secs(4));
                        }
                    }
                }
            }

            if !injected {
                return Err(format!("Failed to inject DLL after 3 attempts"));
            }

            std::thread::sleep(std::time::Duration::from_millis(500));
        }
    }

    Ok(true)
}

fn prepare_dll(dll_link: &str, win64_dir: &Path, idx: usize) -> Result<PathBuf, String> {
    if dll_link.starts_with("http://") || dll_link.starts_with("https://") {
        let filename = match dll_link.rsplit('/').next() {
            Some(name) if !name.is_empty() => name.replace('%', "_"),
            _ => format!("InjectedDll_{}.dll", idx),
        };

        let dll_save_path = win64_dir.join(filename);

        utilities::download_file(dll_link, &dll_save_path)
            .map_err(|e| format!("Failed to download DLL: {}", e))?;

        Ok(dll_save_path)
    } else {
        let local_path = PathBuf::from(dll_link);
        
        if !local_path.exists() {
            return Err(format!("DLL not found at '{}'", dll_link));
        }

        let filename = local_path.file_name()
            .and_then(|n| n.to_str())
            .map(|s| s.to_string())
            .unwrap_or_else(|| format!("InjectedDll_{}.dll", idx));
        
        let dll_save_path = win64_dir.join(&filename);
        
        std::fs::copy(&local_path, &dll_save_path)
            .map_err(|e| format!("Failed to copy DLL: {}", e))?;
        
        Ok(dll_save_path)
    }
}

#[tauri::command]
pub fn close_game() -> Result<(), String> {
    let _ = utilities::kill_all_procs();
    Ok(())
}
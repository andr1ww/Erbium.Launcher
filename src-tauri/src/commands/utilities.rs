use std::fs;
use std::io::Write;
use std::path::{Path, PathBuf};
use sysinfo::{ProcessExt, System, SystemExt, Pid};
use winapi::shared::minwindef::{FALSE, LPVOID, DWORD};
use winapi::um::libloaderapi::{GetProcAddress, GetModuleHandleA};
use winapi::um::memoryapi::{VirtualAllocEx, WriteProcessMemory};
use winapi::um::processthreadsapi::{CreateRemoteThread, OpenProcess, OpenThread, ResumeThread};
use winapi::um::winnt::{
    MEM_COMMIT, MEM_RESERVE, MEM_RELEASE, PAGE_EXECUTE_READWRITE,
    PROCESS_CREATE_THREAD, PROCESS_QUERY_INFORMATION, PROCESS_VM_OPERATION,
    PROCESS_VM_READ, PROCESS_VM_WRITE, THREAD_SUSPEND_RESUME
};
use winapi::um::tlhelp32::{CreateToolhelp32Snapshot, Thread32First, Thread32Next, THREADENTRY32, TH32CS_SNAPTHREAD};
use winapi::um::handleapi::CloseHandle;
use winapi::um::synchapi::WaitForSingleObject;
use winapi::um::winbase::INFINITE;
use std::ffi::CString;
use std::mem::zeroed;

pub fn kill_all_procs() -> Result<(), String> {
    let mut system = System::new_all();
    system.refresh_all();

    let process_names = vec![
        "FortniteClient-Win64-Shipping.exe",
        "FortniteClient-Win64-Shipping_EAC.exe",
        "FortniteClient-Win64-Shipping_BE.exe",
        "FortniteLauncher.exe",
        "EasyAntiCheat.exe",
        "BEService.exe",
    ];

    for (_, process) in system.processes() {
        let name = process.name();
        if process_names.iter().any(|&pn| pn == name) {
            process.kill();
        }
    }

    Ok(())
}

pub fn is_process_alive(pid: u32) -> bool {
    let mut system = System::new();
    system.refresh_processes();
    
    let sysinfo_pid = Pid::from(pid as usize);
    system.process(sysinfo_pid).is_some()
}

pub fn is_any_fortnite_process_running() -> bool {
    let mut system = System::new();
    system.refresh_processes();

    let process_names = vec![
        "FortniteClient-Win64-Shipping.exe",
        "FortniteClient-Win64-Shipping_EAC.exe",
        "FortniteClient-Win64-Shipping_BE.exe",
    ];

    for (_, process) in system.processes() {
        let name = process.name();
        if process_names.iter().any(|&pn| pn == name) {
            return true;
        }
    }

    false
}

pub fn resume_process_threads(pid: u32) -> Result<(), String> {
    unsafe {
        let snapshot = CreateToolhelp32Snapshot(TH32CS_SNAPTHREAD, 0);
        if snapshot.is_null() {
            return Err("Failed to create thread snapshot".to_string());
        }

        let mut thread_entry: THREADENTRY32 = zeroed();
        thread_entry.dwSize = std::mem::size_of::<THREADENTRY32>() as DWORD;

        if Thread32First(snapshot, &mut thread_entry) == 0 {
            CloseHandle(snapshot);
            return Err("Failed to enumerate threads".to_string());
        }

        let mut resumed_count = 0;
        loop {
            if thread_entry.th32OwnerProcessID == pid {
                let thread_handle = OpenThread(THREAD_SUSPEND_RESUME, FALSE, thread_entry.th32ThreadID);
                if !thread_handle.is_null() {
                    ResumeThread(thread_handle);
                    CloseHandle(thread_handle);
                    resumed_count += 1;
                }
            }

            if Thread32Next(snapshot, &mut thread_entry) == 0 {
                break;
            }
        }

        CloseHandle(snapshot);
        Ok(())
    }
}

pub fn handle_game_dll_path(game_directory: &Path) -> PathBuf {
    game_directory
        .parent()
        .unwrap_or(game_directory)
        .join("Engine")
        .join("Binaries")
        .join("ThirdParty")
        .join("NVIDIA")
        .join("NVaftermath")
        .join("Win64")
        .join("GFSDK_Aftermath_Lib.x64.dll")
}

pub fn remove_game_dll_sync(game_directory: &Path) -> Result<(), String> {
    let dll_path = handle_game_dll_path(game_directory);
    
    if dll_path.exists() {
        fs::remove_file(&dll_path).map_err(|e| format!("Failed to remove DLL: {}", e))?;
    }
    
    Ok(())
}

pub fn download_file(url: &str, destination: &Path) -> Result<(), String> {
    let response = reqwest::blocking::get(url)
        .map_err(|e| format!("Failed to download file: {}", e))?;
    
    if !response.status().is_success() {
        return Err(format!("Download failed with status: {}", response.status()));
    }

    let bytes = response.bytes()
        .map_err(|e| format!("Failed to read response bytes: {}", e))?;

    if let Some(parent) = destination.parent() {
        fs::create_dir_all(parent)
            .map_err(|e| format!("Failed to create directory: {}", e))?;
    }

    let mut file = fs::File::create(destination)
        .map_err(|e| format!("Failed to create file: {}", e))?;
    
    file.write_all(&bytes)
        .map_err(|e| format!("Failed to write file: {}", e))?;

    Ok(())
}

pub fn inject_dll(pid: u32, dll_path: &str) -> Result<(), String> {
    unsafe {
        let h_process = OpenProcess(
            PROCESS_CREATE_THREAD
                | PROCESS_QUERY_INFORMATION
                | PROCESS_VM_OPERATION
                | PROCESS_VM_WRITE
                | PROCESS_VM_READ,
            0,
            pid,
        );
        if h_process.is_null() {
            return Err(format!(
                "Failed to open process (PID: {}). Error: {}",
                pid,
                std::io::Error::last_os_error()
            ));
        }

        let dll_path_cstring = CString::new(dll_path).map_err(|e| format!("CString error: {}", e))?;
        let dll_path_len = dll_path_cstring.as_bytes_with_nul().len();

        let remote_memory = VirtualAllocEx(
            h_process,
            std::ptr::null_mut(),
            dll_path_len,
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE,
        );

        if remote_memory.is_null() {
            CloseHandle(h_process);
            return Err("Failed to allocate memory in remote process".to_string());
        }

        let write_result = WriteProcessMemory(
            h_process,
            remote_memory,
            dll_path_cstring.as_ptr() as LPVOID,
            dll_path_len,
            std::ptr::null_mut(),
        );

        if write_result == 0 {
            CloseHandle(h_process);
            return Err("Failed to write to remote process memory".to_string());
        }

        let kernel32 = CString::new("kernel32.dll").unwrap();
        let h_kernel32 = GetModuleHandleA(kernel32.as_ptr());
        if h_kernel32.is_null() {
            CloseHandle(h_process);
            return Err("Failed to load kernel32.dll".to_string());
        }

        let load_library = CString::new("LoadLibraryA").unwrap();
        let load_library_addr = GetProcAddress(h_kernel32, load_library.as_ptr());
        if load_library_addr.is_null() {
            CloseHandle(h_process);
            return Err("Failed to get LoadLibraryA address".to_string());
        }

        let h_thread = CreateRemoteThread(
            h_process,
            std::ptr::null_mut(),
            0,
            Some(std::mem::transmute::<_, unsafe extern "system" fn(LPVOID) -> DWORD>(load_library_addr)),
            remote_memory,
            0,
            std::ptr::null_mut(),
        );

        if h_thread.is_null() {
            CloseHandle(h_process);
            return Err("Failed to create remote thread for DLL injection".to_string());
        }

        WaitForSingleObject(h_thread, INFINITE);
        
        use winapi::um::memoryapi::VirtualFreeEx;
        VirtualFreeEx(h_process, remote_memory, 0, MEM_RELEASE);
        CloseHandle(h_thread);
        CloseHandle(h_process);

        Ok(())
    }
}

pub fn test_process_ready(pid: u32) -> bool {
    unsafe {
        let h_process = OpenProcess(
            PROCESS_VM_OPERATION | PROCESS_VM_READ | PROCESS_VM_WRITE,
            0,
            pid,
        );
        
        if h_process.is_null() {
            return false;
        }

        let test_memory = VirtualAllocEx(
            h_process,
            std::ptr::null_mut(),
            4096,
            MEM_COMMIT | MEM_RESERVE,
            PAGE_EXECUTE_READWRITE,
        );

        if test_memory.is_null() {
            CloseHandle(h_process);
            return false;
        }

        use winapi::um::memoryapi::VirtualFreeEx;
        VirtualFreeEx(h_process, test_memory, 0, MEM_RELEASE);
        CloseHandle(h_process);
        true
    }
}
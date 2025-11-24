use std::fs::File;
use std::io::Read;

#[tauri::command]
pub async fn check_file_exists_and_size(path: &str, size: Option<u64>) -> Result<bool, String> {
    let file_path = std::path::PathBuf::from(path);
    if !file_path.exists() {
        return Ok(false);
    }

    match size {
        Some(expected_size) => {
            let actual_size = match file_path.metadata() {
                Ok(metadata) => metadata.len(),
                Err(err) => {
                    return Err(err.to_string());
                }
            };

            Ok(actual_size == expected_size)
        }
        None => Ok(true),
    }
}

#[tauri::command]
pub async fn check_file_exists(path: &str) -> Result<bool, String> {
    let file_path = std::path::PathBuf::from(path);

    if !file_path.exists() {
        return Ok(false);
    }

    Ok(true)
}

#[tauri::command]
pub fn search_for_version(path: &str) -> Result<Vec<String>, String> {
    let mut file = File::open(path).map_err(|e| e.to_string())?;
    let mut buffer = Vec::new();
    file.read_to_end(&mut buffer).map_err(|e| e.to_string())?;

    let pattern = [
        0x2b, 0x00, 0x2b, 0x00, 0x46, 0x00, 0x6f, 0x00, 0x72, 0x00, 0x74, 0x00, 0x6e, 0x00, 0x69,
        0x00, 0x74, 0x00, 0x65, 0x00, 0x2b, 0x00,
    ];

    let mut matches = Vec::new();
    for (i, window) in buffer.windows(pattern.len()).enumerate() {
        if window == pattern {
            let _start = i.saturating_sub(32);
            let end = (i + pattern.len() + 64).min(buffer.len());

            let end_index = find_end(&buffer[i + pattern.len()..end]);
            if let Some(end) = end_index {
                let utf16_slice = unsafe {
                    std::slice::from_raw_parts(
                        buffer[i..i + pattern.len() + end].as_ptr() as *const u16,
                        (pattern.len() + end) / 2,
                    )
                };
                let s = String::from_utf16_lossy(utf16_slice);
                matches.push(s.trim_end_matches('\0').to_string());
            }
        }
    }

    Ok(matches)
}

fn find_end(data: &[u8]) -> Option<usize> {
    let mut i = 0;
    while i + 1 < data.len() {
        if data[i] == 0 && data[i + 1] == 0 {
            return Some(i);
        }
        i += 2;
    }
    None
}

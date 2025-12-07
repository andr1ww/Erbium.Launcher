import { invoke } from "@tauri-apps/api/core";

export async function RpcStart(): Promise<void> {
  await invoke("start_rpc", {
    config: {
      client_id: "1418336530019254393",
      state: "none",
      details: `Using Erbium Launcher`,
      large_image: `https://cdn.discordapp.com/embed/avatars/0.png`,
      large_text: "none",
      small_image: "none",
      small_text: "none",
      button_1_text: "none",
      button_1_url: "none",
      button_2_text: "none",
      button_2_url: "none",
      enable_timer: true,
    },
  });
}

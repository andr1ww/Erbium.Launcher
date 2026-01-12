import { invoke } from "@tauri-apps/api/core";

export interface RpcConfig {
  client_id: string;
  state: string;
  details: string;
  large_image: string;
  large_text: string;
  small_image: string;
  small_text: string;
  button_1_text: string;
  button_1_url: string;
  button_2_text: string;
  button_2_url: string;
  enable_timer: boolean;
}

export async function RpcStart(config?: Partial<RpcConfig>): Promise<void> {
  const defaultConfig: RpcConfig = {
    client_id: "1460137772181618855",
    state: "none",
    details: "Playing Erbium",
    large_image: "logo",
    large_text: "Erbium",
    small_image: "none",
    small_text: "none",
    button_1_text: "none",
    button_1_url: "none",
    button_2_text: "none",
    button_2_url: "none",
    enable_timer: true,
  };

  try {
    await invoke("start_rpc", {
      config: { ...defaultConfig, ...config },
    });
    console.log("Discord RPC started");
  } catch (error) {
    console.error("Failed to start Discord RPC:", error);
  }
}

export async function RpcStop(): Promise<void> {
  try {
    await invoke("stop_rpc");
    console.log("RPC stopped");
  } catch (error) {
    console.error("Failed to stop RPC:", error);
  }
}

export async function RpcClear(): Promise<void> {
  try {
    await invoke("clear_rpc");
    console.log("RPC cleared");
  } catch (error) {
    console.error("Failed to clear RPC:", error);
  }
}

export async function setIdleState(): Promise<void> {
  await RpcStart({
    details: "On Erbium",
    enable_timer: false,
  });
}
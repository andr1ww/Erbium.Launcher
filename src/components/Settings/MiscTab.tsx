import React from "react";
import { motion } from "framer-motion";
import GlassContainer from "../Global/GlassContainer";
import { useConfigStore } from "@/zustand/configStore";
import { open } from "@tauri-apps/plugin-dialog";

const MiscTab: React.FC = () => {
  const {
    backendUrl,
    backendPort,
    redirectDLL,
    consoleDLL,
    gameServerDll,
    setBackendUrl,
    setBackendPort,
    setRedirectDLL,
    setConsoleDLL,
    setGameServerDll,
  } = useConfigStore();

  const handleFileSelect = async (setter: (path: string) => void) => {
    try {
      const selected = await open({
        multiple: false,
        filters: [{ name: "DLL Files", extensions: ["dll"] }],
      });

      if (selected && typeof selected === "string") {
        setter(selected);
      }
    } catch (error) {
      console.error("Error selecting file:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <div>
        <h2 className="text-2xl font-semibold text-white">Misc Settings</h2>
        <p className="text-sm text-white/40 mt-1">Configure backend and DLL paths</p>
      </div>

      <div className="space-y-4">
        <GlassContainer
          variant="default"
          className="p-5 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-3">Backend Configuration</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Backend URL</label>
              <input
                type="text"
                value={backendUrl}
                onChange={e => setBackendUrl(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="127.0.0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/80 mb-2">Backend Port</label>
              <input
                type="text"
                value={backendPort}
                onChange={e => setBackendPort(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                placeholder="3551"
              />
            </div>
          </div>
        </GlassContainer>

        <GlassContainer
          variant="default"
          className="p-5 rounded-lg"
        >
          <h3 className="text-lg font-semibold text-white mb-1">DLLs</h3>
          <p className="text-xs text-white/40 mb-4">Select required DLL files for Erbium</p>
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Authentication Redirect DLL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={redirectDLL}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none cursor-default"
                  placeholder="No file selected"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFileSelect(setRedirectDLL)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-md text-white text-xs font-medium transition-colors"
                >
                  Browse
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Console DLL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={consoleDLL}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none cursor-default"
                  placeholder="No file selected"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFileSelect(setConsoleDLL)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-md text-white text-xs font-medium transition-colors"
                >
                  Browse
                </motion.button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">
                Game Server DLL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={gameServerDll}
                  readOnly
                  className="flex-1 bg-white/5 border border-white/10 rounded-md px-3 py-2 text-sm text-white placeholder-white/30 focus:outline-none cursor-default"
                  placeholder="No file selected"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleFileSelect(setGameServerDll)}
                  className="px-3 py-2 bg-white/10 hover:bg-white/15 border border-white/20 rounded-md text-white text-xs font-medium transition-colors"
                >
                  Browse
                </motion.button>
              </div>
            </div>
          </div>
        </GlassContainer>
      </div>
    </motion.div>
  );
};

export default MiscTab;

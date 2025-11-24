import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
import { convertFileSrc } from "@tauri-apps/api/core";
import { HiX } from "react-icons/hi";
import { FiFolder } from "react-icons/fi";
import { BsCheckCircleFill } from "react-icons/bs";
import { BiError } from "react-icons/bi";
import { join } from "@tauri-apps/api/path";
import BuildStore from "@/zustand/BuildStore";

interface ImportBuildModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ImportBuildModal: React.FC<ImportBuildModalProps> = ({ isOpen, onClose }) => {
  const [buildPath, setBuildPath] = useState("");
  const [buildVersion, setBuildVersion] = useState("");
  const [buildRelease, setBuildRelease] = useState("");
  const [status, setStatus] = useState<
    "idle" | "scanning" | "ready" | "importing" | "success" | "error"
  >("idle");
  const [error, setError] = useState("");

  const handleBrowse = async () => {
    try {
      const selectedPath = await open({ directory: true, multiple: false });
      if (!selectedPath) return;

      setBuildPath(selectedPath.toString());
      setStatus("scanning");
      setError("");

      const exe = await join(
        selectedPath,
        "FortniteGame",
        "Binaries",
        "Win64",
        "FortniteClient-Win64-Shipping.exe"
      );
      let version = "unknown";
      let release = "unknown net cl";
      const hexCheck = (await invoke("search_for_version", { path: exe })) as string[];

      const versionMap: Record<number, { v: string; r: string }> = {
        3870737: { v: "2.4.2", r: "2.4.2-CL-3870737" },
        3858292: { v: "2.4", r: "2.4-CL-3858292" },
        3847564: { v: "2.3", r: "2.3-CL-3847564" },
        3841827: { v: "2.2", r: "2.2-CL-3841827" },
        3825894: { v: "2.1", r: "2.1-CL-3825894" },
        3807424: { v: "1.11", r: "1.11-CL-3807424" },
        3790078: { v: "1.10", r: "1.10-CL-3790078" },
        3775276: { v: "1.91", r: "1.91-CL-3775276" },
        3757339: { v: "1.9", r: "1.9-CL-3757339" },
        3729133: { v: "1.8.1", r: "1.81-CL-3729133" },
        3724489: { v: "1.8", r: "1.8-CL-3724489" },
        3700114: { v: "1.7.2", r: "1.72-CL-3700114" },
        3541083: { v: "1.2", r: "1.2-CL-3541083" },
        3532353: { v: "1.0", r: "1.0-CL-3532353" },
      };

      let foundMatch = false;
      for (const str of hexCheck) {
        const match = str.match(/\+\+Fortnite\+Release-(\d+\.\d+|Cert)-CL-(\d+)/);
        if (!match) continue;
        if (!str.includes("Live") && !str.includes("Cert")) {
          version =
            match[1].length === 3 && match[1].split(".")[1].length === 1
              ? match[1] + "0"
              : match[1];
          release = `${version}-CL-${match[2]}`;
          foundMatch = true;
          break;
        } else {
          const clNum = parseInt(match[2]);
          if (versionMap[clNum]) {
            version = versionMap[clNum].v;
            release = versionMap[clNum].r;
            foundMatch = true;
            break;
          }
        }
      }

      setBuildVersion(version);
      setBuildRelease(release);
      setStatus("ready");
    } catch {
      setStatus("error");
      setError("failed to find build version");
    }
  };

  const handleImport = async () => {
    if (!buildPath.trim()) return;
    setStatus("importing");

    try {
      const splash = await join(buildPath, "FortniteGame", "Content", "Splash", "Splash.bmp");
      const splashExists = await invoke("check_file_exists", { path: splash });

      BuildStore.getState().add(buildPath, {
        splash: splashExists ? convertFileSrc(splash) : "no splash",
        path: buildPath,
        version: buildVersion || "?",
        real: buildRelease || "unk version",
        verified: true,
        open: false,
        loading: false,
      });

      setStatus("success");
      setTimeout(handleClose, 1000);
    } catch {
      setStatus("error");
      setError("failed to import build!");
    }
  };

  const handleClose = () => {
    if (["scanning", "importing"].includes(status)) return;
    onClose();
    setBuildPath("");
    setBuildVersion("");
    setBuildRelease("");
    setStatus("idle");
    setError("");
  };

  const renderOverlay = () => {
    if (["scanning", "importing"].includes(status))
      return (
        <>
          <div className="relative">
            <div className="w-10 h-10 border-3 border-gray-600/30 rounded-full" />
            <div className="absolute top-0 left-0 w-10 h-10 border-3 border-transparent border-t-gray-400 rounded-full animate-spin" />
          </div>
          <p className="text-xs text-gray-400 mt-3">
            {status === "scanning" ? "Finding version..." : "Importing..."}
          </p>
        </>
      );
    if (status === "success") return <BsCheckCircleFill className="w-10 h-10 text-green-500" />;
    if (status === "error")
      return (
        <div className="flex flex-col items-center">
          <BiError className="w-10 h-10 text-red-500" />
          <p className="text-xs text-gray-400 mt-2">{error}</p>
          <button
            onClick={() => setStatus("idle")}
            className="mt-3 px-3 py-1.5 text-xs rounded-md bg-white/10 hover:bg-white/15 text-gray-300 transition-all"
          >
            Try Again
          </button>
        </div>
      );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={handleClose}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "tween", duration: 0.15 }}
            onClick={e => e.stopPropagation()}
            className="relative w-80 rounded-lg bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-xl border border-white/25 shadow-2xl overflow-hidden"
          >
            {["scanning", "importing", "success", "error"].includes(status) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm"
              >
                {renderOverlay()}
              </motion.div>
            )}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h2 className="text-sm font-semibold text-white">Import Build</h2>
              <button
                onClick={handleClose}
                disabled={["scanning", "importing"].includes(status)}
                className="p-1 rounded hover:bg-white/10 transition-all text-gray-400 hover:text-white disabled:opacity-50"
              >
                <HiX className="w-4 h-4" />
              </button>
            </div>
            <div className="px-4 py-4 space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-400">Build Folder</label>
                <div className="flex gap-2">
                  <div className="flex-1 py-2 px-3 rounded-md bg-black/30 border border-white/10 text-sm truncate">
                    {buildPath ? (
                      <span className="text-gray-200">
                        {buildPath.split("\\").pop() || buildPath}
                      </span>
                    ) : (
                      <span className="text-gray-500">Select folder...</span>
                    )}
                  </div>
                  <button
                    onClick={handleBrowse}
                    className="px-3 py-2 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all"
                  >
                    <FiFolder className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {buildVersion && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  <label className="text-xs font-medium text-gray-400">Fortnite Version</label>
                  <div className="py-2 px-3 rounded-md bg-black/30 border border-white/10">
                    <span className="text-gray-200 text-sm">Fortnite {buildVersion}</span>
                    <span className="text-gray-500 text-xs ml-2">({buildRelease})</span>
                  </div>
                </motion.div>
              )}
            </div>
            <div className="px-4 py-3 border-t border-white/10 flex gap-2">
              <button
                onClick={handleClose}
                disabled={["scanning", "importing"].includes(status)}
                className="flex-1 py-2 rounded-md border border-white/10 text-gray-300 hover:bg-white/5 transition-all text-sm font-medium disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleImport}
                disabled={!buildPath.trim() || ["scanning", "importing"].includes(status)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${!buildPath.trim() || status === "scanning" ? "bg-white/5 text-gray-500 cursor-not-allowed" : "bg-white/10 hover:bg-white/15 text-white border border-white/10"}`}
              >
                Import
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ImportBuildModal;

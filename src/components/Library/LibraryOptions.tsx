import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDownload2Line } from "react-icons/ri";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { List } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import ImportBuildModal from "./ImportBuildModal";
import { useLibraryStore } from "@/zustand/LibraryStore";

const LibraryOptions: React.FC = () => {
  const { GridBuilds, setGridBuilds } = useLibraryStore();
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <>
      <ImportBuildModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <div className="w-full py-2 px-2 flex justify-between bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="py-1.25 px-1.75 flex items-center text-sm gap-1 text-gray-300 rounded-md cursor-pointer transition-all bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 border border-white/10 hover:brightness-120"
          >
            <FiPlus className="w-5 h-5" />
            Import Build
          </button>

          <button
            onClick={async () => {
              await open(
                "https://github.com/llamaqwerty/fortnite-builds-archive?tab=readme-ov-file#online-testing-download-links-start-here"
              );
            }}
            className="py-1.25 px-1.75 flex items-center text-sm gap-1 text-gray-300 rounded-md cursor-pointer transition-all bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 border border-white/10 hover:brightness-120"
          >
            <RiDownload2Line className="w-5 h-5" />
            Download Builds
          </button>
        </div>

        <div className="flex gap-2 backdrop-blur-md bg-black/5 border border-white/10 rounded-md">
          <div
            className={`absolute top-0 bottom-0 w-1/2 rounded-md bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 border-white/10 transition-all duration-350 ${
              GridBuilds ? "left-0 border-r" : "left-1/2 border-l"
            }`}
          />

          <button
            onClick={() => setGridBuilds(true)}
            className="w-10 flex justify-center items-center text-sm gap-1 text-gray-200/90 rounded-md cursor-pointer transition-all hover:brightness-105"
          >
            <BsFillGrid1X2Fill />
          </button>

          <button
            onClick={() => setGridBuilds(false)}
            className="w-10 flex justify-center items-center text-sm gap-1 text-gray-200/90 rounded-md cursor-pointer transition-all hover:brightness-105"
          >
            <List />
          </button>
        </div>
      </div>
    </>
  );
};

export default LibraryOptions;

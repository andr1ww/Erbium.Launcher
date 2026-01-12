import React, { useState } from "react";
import { FiPlus } from "react-icons/fi";
import { RiDownload2Line } from "react-icons/ri";
//import { BsFillGrid1X2Fill } from "react-icons/bs";
//import { List } from "lucide-react";
import { open } from "@tauri-apps/plugin-shell";
import ImportBuildModal from "./ImportBuildModal";
import GlassContainer from "../Global/GlassContainer";

const LibraryOptions: React.FC = () => {
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  return (
    <>
      <ImportBuildModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
      />

      <GlassContainer
        variant="grayish"
        className="w-full py-2 px-2 flex justify-between rounded-lg"
      >
        <div className="flex gap-2">
          <GlassContainer
            variant="boring"
            onClick={() => setIsImportModalOpen(true)}
            className="py-1.25 px-1.75 flex items-center text-sm gap-1 text-gray-300 rounded-md cursor-pointer transition-all hover:brightness-120"
          >
            <FiPlus className="w-5 h-5" />
            Import Build
          </GlassContainer>

          <GlassContainer
            variant="boring"
            onClick={async () => {
              await open(
                "https://github.com/llamaqwerty/fortnite-builds-archive?tab=readme-ov-file#online-testing-download-links-start-here"
              );
            }}
            className="py-1.25 px-1.75 flex items-center text-sm gap-1 text-gray-300 rounded-md cursor-pointer transition-all hover:brightness-120"
          >
            <RiDownload2Line className="w-5 h-5" />
            Download Builds
          </GlassContainer>
        </div>
      </GlassContainer>
    </>
  );
};

export default LibraryOptions;

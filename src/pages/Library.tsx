import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Components
import BuildsCol from "@/components/Library/BuildsCol";
import BuildsGrid from "@/components/Library/BuildsGrid";
import LibraryOptions from "@/components/Library/LibraryOptions";

// Zustand
import { useLibraryStore } from "@/zustand/LibraryStore";

const Library: React.FC = () => {
    const { GridBuilds } = useLibraryStore();

    return (
        <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
            type: "tween",
            duration: 0.3,
        }}
        className="w-[calc(100vw-64px)] ml-16 h-screen overflow-y-auto flex p-7 flex-col justify-start items-start"
        >
            <LibraryOptions />

            <AnimatePresence mode="wait">
                {GridBuilds ? <BuildsGrid key="grid" /> : <BuildsCol key="col" />}
            </AnimatePresence>

        </motion.div>
    );
};

export default Library;
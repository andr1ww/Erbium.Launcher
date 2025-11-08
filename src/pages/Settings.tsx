import React from "react";
import { motion } from "framer-motion";

// Components
import SettingsNav from "@/components/Settings/SettingsNav";

const Settings: React.FC = () => {

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
            <SettingsNav />

        </motion.div>
    );
};

export default Settings;
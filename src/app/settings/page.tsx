"use client";

import Particles from "@/components/core/particles";
import Sidebar from "@/components/core/sidebar";
import { motion } from "framer-motion";

export default function Settings() {
  return (
    <div className="font-sans flex min-h-screen">
      <Particles className="absolute inset-0 -z-10" />
      <Sidebar page={{ page: "settings" }} />
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 flex flex-col mt-3"
      >
        <div className="flex justify-between items-start p-6 mt-2">
          <h1 className="text-3xl font-bold text-white mt-3">Settings</h1>
        </div>
      </motion.main>
    </div>
  );
}

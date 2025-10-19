"use client";

import { HiX, HiMinus } from "react-icons/hi";
import { Window } from "@tauri-apps/api/window";
import { useEffect } from "react";

export default function Frame() {
  const close = async () => {
    try {
      const appWindow = new Window("main"); // lowkey dont know why tauri v2 does this
      await appWindow.close();
      console.log("Window Closed");
    } catch (error) {
      console.error("failed to close:", error);
    }
  };

  const minimize = async () => {
    try {
      const appWindow = new Window("main");
      appWindow.minimize();
    } catch (error) {
      console.error("cannot make this smaller:", error);
    }
  };

  // data-tauri-drag-region is used to make the window
  return (
    <div
      data-tauri-drag-region
      className="h-15px w-full flex justify-between items-center select-none absolute top-0 z-50"
    >
      <div className="flex items-center ml-3 mt-1"></div>
      <div className="flex flex-row justify-end items-center mt-2">
        <div
          onClick={minimize}
          className="cursor-pointer hover:transition-all hover:duration-300 w-10 h-7 flex justify-center items-center rounded-sm"
        >
          <HiMinus className="w-2.6 h-2.6 text-white mb-0.5" />
        </div>
        <div
          onClick={close}
          className="cursor-pointer hover:transition-all hover:duration-300 w-10 h-7 mr-1 flex justify-center items-center rounded-sm"
        >
          <HiX className="w-2.6 h-2.6 text-white mb-1 hover:text-gray" />
        </div>
      </div>
    </div>
  );
}

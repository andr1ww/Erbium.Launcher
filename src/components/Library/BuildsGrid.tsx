import React, { useState } from "react";
import { motion } from "framer-motion";
import { Blurhash } from "react-blurhash";
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { invoke } from "@tauri-apps/api/core";
import { join } from "@tauri-apps/api/path";
import BuildStore, { IBuild } from "@/zustand/BuildStore";
import { useGameSettingsStore } from "@/zustand/GameSettingsStore";
import { useUserStore } from "@/zustand/UserStore";

const BuildCard: React.FC<{
  path: string;
  build: IBuild;
  onDelete: (path: string) => void;
  onPlay: (path: string) => void;
  onPlayGS: (path: string) => void;
  isLaunching: boolean;
}> = ({ path, build, onDelete, onPlay, onPlayGS, isLaunching }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasSplash = build.splash && build.splash !== "no splash";

  return (
    <div className="relative w-full h-55 2xl:h-62 rounded-md border border-white/25 overflow-hidden shadow-lg group">
      {!isLoaded && (
        <Blurhash
          hash="LBB.ywK6^6I-3G%3EKxC0JIrR$Ri"
          width="100%"
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
          className="absolute transition-all ease-in-out duration-500 group-hover:scale-110"
        />
      )}
      {hasSplash ? (
        <img
          src={build.splash}
          alt={`Fortnite ${build.version}`}
          className="absolute w-full h-full object-cover transition-all ease-in-out duration-500 group-hover:scale-110"
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsLoaded(true)}
          loading="lazy"
          draggable={false}
        />
      ) : (
        <div className="absolute w-full h-full bg-gradient-to-br from-slate-700/50 to-slate-900/50 flex items-center justify-center">
          <span className="text-white/30 text-sm">No Splash</span>
        </div>
      )}
      <div className="absolute bottom-0 left-0 bg-gradient-to-t px-1.5 py-1.25 from-black/68 to-black/2 w-full h-full group-hover:opacity-100 transition-all ease duration-300 flex flex-col justify-end items-start">
        <span className="text-white/80 text-sm leading-3 group-hover:translate-y-0 transition-all duration-350 delay-45">
          Fortnite {build.version}
        </span>
        <span className="text-white/35 font-light text-xs group-hover:translate-y-0 transition-all duration-350 delay-25">
          {build.real}
        </span>
        <div className="absolute right-0 bottom-0 px-1.5 py-2.25 flex flex-col gap-1.5">
          <button
            onClick={() => onPlay(path)}
            disabled={isLaunching}
            className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-25 bg-black/20 hover:bg-black/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Launch Client"
          >
            <IoPlay className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onPlayGS(path)}
            disabled={isLaunching}
            className="text-green-400/55 p-1.25 rounded-sm border cursor-pointer border-green-400/25 hover:text-green-400/80 hover:border-green-400/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-50 bg-black/20 hover:bg-black/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Launch Game Server"
          >
            <IoPlay className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(path)}
            disabled={isLaunching}
            className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-75 bg-black/20 hover:bg-black/30 backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
            title="Delete Build"
          >
            <MdDeleteForever className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

const BuildsGrid: React.FC = () => {
  const { builds, remove } = BuildStore();
  const { redirectDLL, clientDLL, gameServerDLL, backend, gsEmail, gsPassword } = useGameSettingsStore();
  const { DisplayName } = useUserStore();
  const [isLaunching, setIsLaunching] = useState(false);
  const buildsArray = Array.from(builds.entries());
  
  const email = `${DisplayName}@erbium.dev`;
  const password = "erbiumerbium";

  const handlePlay = async (buildPath: string) => {
  if (!redirectDLL) {
    alert("Please configure the Redirect DLL in Settings first");
    return;
  }

  if (!email || !password || !DisplayName) {
    alert("Please set your display name in settings first");
    return;
  }

  setIsLaunching(true);

  try {
    const executablePath = await join(
      buildPath,
      "FortniteGame",
      "Binaries",
      "Win64",
      "FortniteClient-Win64-Shipping.exe"
    );

    const extraDlls = clientDLL || "";

    console.log("=== CLIENT LAUNCH ===");
    console.log("clientDLL:", clientDLL);
    console.log("extraDlls:", extraDlls);
    console.log("injectExtraDlls:", extraDlls !== "");

    await invoke("launch_game", {
      filePath: executablePath,
      email: email,
      password: password,
      redirectLink: redirectDLL,
      backend: backend || "",
      useBackendParam: backend !== "",
      injectExtraDlls: extraDlls !== "",
      extraDllLinks: extraDlls,
      useCustomPaks: false,
      customPaksLinks: "",
      isGameServer: false
    });

    console.log("Game launched successfully");
  } catch (error) {
    console.error("Failed to launch game:", error);
    alert(`Failed to launch game: ${error}`);
  } finally {
    setIsLaunching(false);
  }
};

const handlePlayGS = async (buildPath: string) => {
  if (!redirectDLL) {
    alert("Please configure the Redirect DLL in Settings first");
    return;
  }

  if (!gameServerDLL) {
    alert("Please configure the Game Server DLL in Settings first");
    return;
  }

  if (!gsEmail || !gsPassword) {
    alert("Please configure Game Server credentials in Settings first");
    return;
  }

  setIsLaunching(true);

  try {
    const executablePath = await join(
      buildPath,
      "FortniteGame",
      "Binaries",
      "Win64",
      "FortniteClient-Win64-Shipping.exe"
    );
    
    const extraDlls = gameServerDLL;

    console.log("=== GAME SERVER LAUNCH ===");
    console.log("gameServerDLL:", gameServerDLL);
    console.log("extraDlls:", extraDlls);
    console.log("injectExtraDlls:", extraDlls !== "");

    await invoke("launch_game", {
      filePath: executablePath,
      email: gsEmail,
      password: gsPassword,
      redirectLink: redirectDLL,
      backend: backend || "",
      useBackendParam: backend !== "",
      injectExtraDlls: extraDlls !== "",
      extraDllLinks: extraDlls,
      useCustomPaks: false,
      customPaksLinks: "",
      isGameServer: true
    });

    console.log("Game Server launched successfully");
  } catch (error) {
    console.error("Failed to launch game server:", error);
    alert(`Failed to launch game server: ${error}`);
  } finally {
    setIsLaunching(false);
  }
};

  const handleDelete = (path: string) => remove(path);

  if (buildsArray.length === 0) {
    return (
      <motion.div
        initial={{ filter: "blur(10px)", opacity: 0 }}
        animate={{ filter: "blur(0px)", opacity: 1 }}
        exit={{ filter: "blur(10px)", opacity: 0 }}
        transition={{ type: "tween", duration: 0.25 }}
        className="w-full my-6 flex items-center justify-center py-16"
      >
        <p className="text-gray-500 text-sm">No builds imported yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ filter: "blur(10px)", opacity: 0 }}
      animate={{ filter: "blur(0px)", opacity: 1 }}
      exit={{ filter: "blur(10px)", opacity: 0 }}
      transition={{ type: "tween", duration: 0.25 }}
      className="w-full my-6"
    >
      <div className="grid 2xl:grid-cols-9 lg:grid-cols-6 grid-cols-4 gap-3.5">
        {buildsArray.map(([path, build]) => (
          <BuildCard
            key={path}
            path={path}
            build={build}
            onDelete={handleDelete}
            onPlay={handlePlay}
            onPlayGS={handlePlayGS}
            isLaunching={isLaunching}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BuildsGrid;
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Blurhash } from "react-blurhash";
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import BuildStore, { IBuild } from "@/zustand/BuildStore";

const BuildRow: React.FC<{
  path: string;
  build: IBuild;
  onDelete: (path: string) => void;
  onPlay: (path: string) => void;
}> = ({ path, build, onDelete, onPlay }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const hasSplash = build.splash && build.splash !== "no splash";

  return (
    <div className="relative w-full h-16 rounded-md border flex justify-between pr-3.5 items-center border-white/25 backdrop-blur-2xl bg-black/1 overflow-hidden shadow-lg group">
      <div className="absolute left-0 top-0 2xl:w-150 w-100 h-full">
        {!isLoaded && (
          <Blurhash
            hash="LCAu8l}EwajYS8EkEyJQI@n%xCxD"
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className="absolute w-full h-full object-cover transition-all duration-350 group-hover:scale-110 mask-r-from-20%"
          />
        )}
        {hasSplash ? (
          <img
            src={build.splash}
            alt={`Fortnite ${build.version}`}
            className="absolute w-full h-full object-cover transition-all duration-350 group-hover:scale-106 mask-r-from-20%"
            onLoad={() => setIsLoaded(true)}
            onError={() => setIsLoaded(true)}
            draggable={false}
            loading="lazy"
          />
        ) : (
          <div className="absolute w-full h-full bg-gradient-to-r from-slate-700/30 to-transparent mask-r-from-20%" />
        )}
      </div>
      <div className="flex pl-1.5 mb-6 gap-2 z-10">
        <span className="text-white/80 px-1.5 py-px rounded-sm text-sm bg-black/10 border border-white/20 backdrop-blur-md drop-shadow-2xl">
          Fortnite {build.version}
        </span>
        <span className="text-white/50 px-1.5 py-px rounded-sm text-xs bg-black/10 border border-white/10 backdrop-blur-md">
          {build.real}
        </span>
      </div>
      <div className="flex gap-2.5 z-10">
        <button
          onClick={() => onPlay(path)}
          className="text-white/55 p-1.75 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 transition-all duration-300 ease backdrop-blur-md"
        >
          <IoPlay className="w-5 h-5" />
        </button>
        <button
          onClick={() => onDelete(path)}
          className="text-white/55 p-1.75 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 transition-all duration-300 ease backdrop-blur-md"
        >
          <MdDeleteForever className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

const BuildsCol: React.FC = () => {
  const { builds, remove } = BuildStore();
  const buildsArray = Array.from(builds.entries());

  const handlePlay = (path: string) => console.log("Playing:", path);
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
      <div className="flex flex-col gap-3.5">
        {buildsArray.map(([path, build]) => (
          <BuildRow
            key={path}
            path={path}
            build={build}
            onDelete={handleDelete}
            onPlay={handlePlay}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default BuildsCol;

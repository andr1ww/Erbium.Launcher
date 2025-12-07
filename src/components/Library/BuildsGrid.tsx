import React, { useState } from "react";
import { motion } from "framer-motion";
import { Blurhash } from "react-blurhash";
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import BuildStore, { IBuild } from "@/zustand/BuildStore";

const BuildCard: React.FC<{
  path: string;
  build: IBuild;
  onDelete: (path: string) => void;
  onPlay: (path: string) => void;
}> = ({ path, build, onDelete, onPlay }) => {
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
            className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-25 bg-black/20 hover:bg-black/30 backdrop-blur-md"
          >
            <IoPlay className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(path)}
            className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-25 bg-black/20 hover:bg-black/30 backdrop-blur-md"
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
      <div className="grid 2xl:grid-cols-9 lg:grid-cols-6 grid-cols-4 gap-3.5">
        {buildsArray.map(([path, build]) => (
          <BuildCard
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

export default BuildsGrid;

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Zustand
import { useLaunchTabStore } from "@/zustand/LaunchTabStore";

const LaunchTab: React.FC = () => {
  const { PostIndex, incrementPostIndex } = useLaunchTabStore();

  const LaunchPosts = [
    {
      title: "Erbium Launcher Release!",
      description: "Erbium's official launcher is now available in an early testing stage.",
      banner: "https://cdn.mos.cms.futurecdn.net/o2kSypkK8YgBtMNc6edcx3.jpg",
      swapDelay: 6,
    },
  ];

  return (
    <div className="relative w-full transition-all flex-2 bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 rounded-lg overflow-hidden shadow-lg 2xl:h-88 h-63">
      <AnimatePresence>
        <motion.img
          key={PostIndex}
          initial={{ filter: "blur(20px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          exit={{ filter: "blur(20px)", opacity: 0 }}
          transition={{
            type: "tween",
            duration: 0.45,
          }}
          src={LaunchPosts[PostIndex].banner}
          alt="banner"
          className="absolute inset-0 w-full h-full object-cover brightness-86"
          draggable={false}
        />
      </AnimatePresence>

      <div className="absolute bottom-0 py-3 px-4 left-0 w-full flex justify-start items-center max-h-26 min-h-20 bg-[#09080a]/90">
        <div className="flex flex-col w-full">
          <AnimatePresence mode="wait">
            <motion.h3
              key={PostIndex}
              initial={{ filter: "blur(10px)", opacity: 0 }}
              animate={{ filter: "blur(0px)", opacity: 1 }}
              exit={{ filter: "blur(10px)", opacity: 0 }}
              transition={{
                type: "tween",
                duration: 0.5,
              }}
              className="2xl:text-lg text-sm font-semibold transition-all text-white mb-1 truncate translate-y-0.75"
            >
              {LaunchPosts[PostIndex].title}
            </motion.h3>
          </AnimatePresence>

          <div className="flex justify-between items-center">
            <AnimatePresence mode="wait">
              <motion.p
                key={PostIndex}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                animate={{ filter: "blur(0px)", opacity: 1 }}
                exit={{ filter: "blur(10px)", opacity: 0 }}
                transition={{
                  type: "tween",
                  duration: 0.5,
                }}
                className="text-gray-300/80 line-clamp-2 leading-relaxed transition-all 2xl:text-sm text-xs truncate max-w-[83%] translate-y-0.5"
              >
                {LaunchPosts[PostIndex].description}
              </motion.p>
            </AnimatePresence>

            <button className="px-4 py-1 bg-white/10 cursor-pointer hover:bg-white/20 border border-white/20 text-white rounded-md font-medium text-xs transition-all flex items-center gap-1.5 backdrop-blur-sm">
              Play Now
            </button>
          </div>

          {LaunchPosts.length > 1 && (
            <div className="mt-3 mb-1.5 h-0.5 bg-white/5 w-full rounded-full overflow-hidden">
              <motion.div
                key={PostIndex}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                className="h-full bg-gradient-to-r from-black-400/60 to-slate-400/60"
                transition={{
                  duration: LaunchPosts[PostIndex]?.swapDelay ?? 6,
                  ease: "linear",
                }}
                onAnimationComplete={incrementPostIndex}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchTab;

// I dont like the animations on h3 and p so if u have any ideas make those better, thx :)

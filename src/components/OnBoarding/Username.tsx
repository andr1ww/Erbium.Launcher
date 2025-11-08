import React, { useState } from "react";
import { motion } from "framer-motion";

// Icons
import { MdWavingHand } from "react-icons/md";

// Zustand
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";
import { useUserStore } from "@/zustand/UserStore";

const Username: React.FC = () => {
  const { setOBstep } = useOnBoardingStore();
  const { DisplayName, setDisplayName } = useUserStore();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="
            relative p-8 w-105 flex flex-col items-center justify-center 
            rounded-md bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 shadow-xl
            "
    >
      <img
        src="Logo.png"
        alt="Logo"
        className="h-18 w-auto object-contain"
        draggable={false}
      />

      <h2 className="flex justify-center items-center gap-2 text-2xl font-semibold text-gray-300 mt-3">
        Let's get you started!
        <motion.div
          animate={{ rotate: [0, 14, -8, 14, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          <MdWavingHand className="text-gray-300" />
        </motion.div>
      </h2>

      <p className="text-gray-300/80 text-sm text-center mt-2 leading-relaxed">
        First, we need to set up your username. This will be displayed in the{" "}
        <strong>Erbium</strong> Launcher only.
      </p>

      <div className="my-4 w-full">
        <input
          type="text"
          value={DisplayName}
          onChange={e => setDisplayName(e.target.value)}
          className="w-full py-3.5 px-4 rounded-lg bg-gradient-to-br from-slate-600/10 via-black-400/10 to-slate-600/10 backdrop-blur-sm border border-gray-600/30 text-gray-200 placeholder-gray-300/60 focus:border-gray-400 focus:ring-2 focus:ring-gray-400/20 outline-none transition-all duration-200 text-base mb-4"
          placeholder="Enter your username"
        />

        <div className="flex gap-3 w-full">
          <button
            onClick={() => setOBstep("GetStarted")}
            className="
                        py-3 px-4 flex-1 rounded-lg border border-white/20 text-white font-semibold transition-all duration-200
                        relative bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-lg w-full cursor-pointer
                        "
          >
            Back
          </button>

          <button
            disabled={!DisplayName.trim()}
            onClick={() => setOBstep("ConfirmName")}
            className={`
                        py-3 px-4 flex-2 rounded-lg border border-white/20 font-semibold transition-all duration-200
                        relative backdrop-blur-md shadow-lg w-full
                        ${
                          !DisplayName.trim()
                            ? "bg-white/5 text-white/40 cursor-not-allowed"
                            : "bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                        }
                        `}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Username;

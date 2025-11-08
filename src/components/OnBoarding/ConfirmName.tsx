import React from "react";
import { motion } from "framer-motion";

// Icons
import { LuClock10 } from "react-icons/lu";

// Zustand
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";
import { useUserStore } from "@/zustand/UserStore";

const ConfirmName: React.FC = () => {
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
            rounded-md bg-linear-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 shadow-xl
            "
    >
      <img
        src="Logo.png"
        alt="Logo"
        className="h-18 w-auto object-contain"
        draggable={false}
      />

      <h2 className="flex justify-center items-center gap-2 text-2xl font-semibold text-gray-300 mt-3">
        Almost There!
        <motion.div
          animate={{ rotate: [0, 14, -8, 14, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatDelay: 1.5,
          }}
        >
          <LuClock10 className="text-gray-300" />
        </motion.div>
      </h2>

      <p className="text-gray-300/80 text-sm text-center mt-2 leading-relaxed">
        Are you sure <strong className="text-gray-200">{DisplayName}</strong> {""}
        is the display name you want to choose?
      </p>

      <div className="flex flex-col mt-8 w-full">
        <div className="flex gap-3 w-full">
          <button
            onClick={() => {
              setDisplayName("");
              setOBstep("UserName");
            }}
            className="
                        py-3 px-4 flex-1 rounded-lg border border-white/20 text-white font-semibold transition-all duration-200
                        relative bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-lg w-full cursor-pointer
                        "
          >
            Back
          </button>

          <button
            onClick={() => setOBstep("Terms")}
            className="
                        py-3 px-4 flex-2 rounded-lg border border-white/20 font-semibold transition-all duration-200
                        relative backdrop-blur-md shadow-lg w-full cursor-pointer bg-white/10 hover:bg-white/20 text-white"
          >
            Continue
          </button>
        </div>

        <p className="text-xs text-gray-200/70 leading-relaxed text-center mt-3">
          Remember, you can always change this in the settings menu later.
        </p>
      </div>
    </motion.div>
  );
};

export default ConfirmName;

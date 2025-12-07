import React from "react";
import { motion } from "framer-motion";
import { MdWavingHand } from "react-icons/md";
import GlassContainer from "@/components/Global/GlassContainer";
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";

const GetStarted: React.FC = () => {
  const { setOBstep } = useOnBoardingStore();

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
    >
      <GlassContainer className="relative p-8 w-105 flex flex-col items-center justify-center rounded-md">
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

        <p className="text-gray-300/80 text-base text-center mt-2 leading-relaxed">
          Are you ready to start the onboarding process?
        </p>

        <button
          onClick={() => setOBstep("UserName")}
          className="py-3 px-4 rounded-lg border border-white/20 text-white font-semibold transition-all duration-200 relative bg-white/10 hover:bg-white/20 backdrop-blur-md shadow-lg w-full mt-10 cursor-pointer"
        >
          Continue
        </button>
      </GlassContainer>
    </motion.div>
  );
};

export default GetStarted;

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import GlassContainer from "@/components/Global/GlassContainer";
import { useUserStore } from "@/zustand/UserStore";

const Finishing: React.FC = () => {
  const navigate = useNavigate();
  const { DisplayName } = useUserStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/home");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
    >
      <GlassContainer className="relative p-8 w-auto flex flex-col items-center justify-center rounded-md shadow-xl">
        <img
          src="Logo.png"
          alt="Logo"
          className="h-18 w-auto mb-2 object-contain"
          draggable={false}
        />

        <h1 className="text-2xl font-bold text-gray-300">Welcome to Erbium, {DisplayName}!</h1>

        <p className="text-gray-200/80 text-lg mt-1.5">Finishing up a few things...</p>

        <div className="relative mt-4">
          <div className="w-16 h-16 border-4 border-gray-600/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-gray-400 rounded-full animate-spin"></div>
        </div>
      </GlassContainer>
    </motion.div>
  );
};

export default Finishing;

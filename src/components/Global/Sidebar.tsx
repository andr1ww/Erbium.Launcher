import React from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";

// Tauri
import { openUrl } from "@tauri-apps/plugin-opener";

// Icons
import { GoHomeFill } from "react-icons/go";
import { LibraryBig } from "lucide-react";
import { MdQuestionMark } from "react-icons/md";
import { TbSettings } from "react-icons/tb";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ x: -70 }}
      animate={{ x: 0 }}
      transition={{
        type: "tween",
        duration: 0.4,
      }}
      className="
        fixed top-0 left-0 w-16 h-screen bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 
        backdrop-blur-lg shadow-xl flex flex-col justify-between items-center px-3 py-4"
    >
      <div className="flex flex-col gap-3.5">
        <img
          src="Logo.png"
          alt="Logo"
          className="scale-92"
          draggable={false}
        />

        <button
          onClick={() => navigate("/home")}
          className={`
                relative flex justify-center items-center w-full p-2 rounded-md transition-all duration-300 cursor-pointer group
                ${
                  location.pathname === "/home"
                    ? "bg-gray-500/10 border border-gray-400/10 shadow-lg shadow-gray-500/10 hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8"
                    : "hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8 border border-transparent hover:border-white/10"
                }
                `}
        >
          <GoHomeFill
            className={` w-5.5 h-5.5
                    ${
                      location.pathname === "/home"
                        ? "text-gray-300 transition-all duration-300 group-hover:text-gray-300 group-hover:scale-110"
                        : "text-gray-400 transition-all duration-300 group-hover:text-white group-hover:scale-105"
                    } `}
          />
        </button>

        <button
          onClick={() => navigate("/library")}
          className={`
                relative flex justify-center items-center w-full p-2 rounded-md transition-all duration-300 cursor-pointer group
                ${
                  location.pathname === "/library"
                    ? "bg-gray-500/10 border border-gray-400/10 shadow-lg shadow-gray-500/10 hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8"
                    : "hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8 border border-transparent hover:border-white/10"
                }
                `}
        >
          <LibraryBig
            className={` w-5.5 h-5.5
                    ${
                      location.pathname === "/library"
                        ? "text-gray-300 transition-all duration-300 group-hover:text-gray-300 group-hover:scale-110"
                        : "text-gray-400 transition-all duration-300 group-hover:text-white group-hover:scale-105"
                    } `}
          />
        </button>
      </div>

      <div className="flex flex-col gap-3.5">
        <button
          onClick={() => openUrl("https://discord.gg/enNpZegnJX")}
          className="
                relative flex justify-center items-center w-full p-2 rounded-md transition-all duration-300 cursor-pointer group
                hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-black-400/8 hover:to-slate-600/8 border border-transparent hover:border-white/10"
        >
          <MdQuestionMark className="text-gray-400 w-5.5 h-5.5 transition-all duration-300 group-hover:text-white group-hover:scale-105" />
        </button>

        <button
          onClick={() => navigate("/settings")}
          className={`
                relative flex justify-center items-center w-full p-2 rounded-md transition-all duration-300 cursor-pointer group
                ${
                  location.pathname === "/settings"
                    ? "bg-gray-500/10 border border-gray-400/10 shadow-lg shadow-gray-500/10 hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8"
                    : "hover:bg-gradient-to-br hover:from-slate-600/8 hover:via-gray-400/8 hover:to-slate-600/8 border border-transparent hover:border-white/10"
                }
                `}
        >
          <TbSettings
            className={` w-5.5 h-5.5
                    ${
                      location.pathname === "/settings"
                        ? "text-gray-300 transition-all duration-300 group-hover:text-gray-300 group-hover:scale-110"
                        : "text-gray-400 transition-all duration-300 group-hover:text-white group-hover:scale-105"
                    }    
                    `}
          />
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar;

// Idk if this should be animated but ye

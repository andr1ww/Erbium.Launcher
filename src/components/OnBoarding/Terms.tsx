import React, { useState } from "react";
import { motion } from "framer-motion";

// Icons
import { MdSafetyCheck } from "react-icons/md";

// Zustand
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";

const Terms: React.FC = () => {
  const { setOBstep } = useOnBoardingStore();
  const [AcceptedTerms, setAcceptedTerms] = useState(false);

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: "tween",
        duration: 0.3,
      }}
      className="
            relative p-4.5 w-full max-w-2xl flex flex-col items-center justify-center 
            rounded-md bg-gradient-to-br from-black-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 shadow-xl
            "
    >
      <img
        src="Logo.png"
        alt="Logo"
        className="h-18 w-auto mb-2 object-contain"
        draggable={false}
      />

      <h2 className="text-xl font-semibold text-gray-300 mb-2 flex items-center justify-center gap-2">
        Terms & Rules
        <MdSafetyCheck className="text-gray-300" />
      </h2>

      <p className="text-gray-300/80 text-sm leading-relaxed">
        Please read and accept our community and in-game rules to continue.
      </p>

      <div className="mt-4 max-h-65 bg-gradient-to-br from-slate-600/10 via-black-400/10 to-slate-600/10 backdrop-blur-sm border border-gray-600/30 rounded-lg p-4 mb-4 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="space-y-4 text-sm text-gray-200/90">
          <div className="overflow-y-auto">
            <h3 className="font-bold text-white mb-3">Community Rules</h3>

            <div className="space-y-2">
              <div>
                <span className="font-medium text-white">Be Respectful:</span> No discrimination,
                hate speech, or threats. Including Racism, Homophobia, etc. This also includes GIF'S
                and other materials.
              </div>

              <div>
                <span className="font-medium text-white">Guild Tags:</span> No inappropriate guild
                tags. This includes abbreviated slurs as well as inappropriate words and politics,
                or illegal material.
              </div>

              <div>
                <span className="font-medium text-white">No NSFW Content:</span> No explicit
                material or adult content. This also includes GIF'S and other materials.
              </div>

              <div>
                <span className="font-medium text-white">English Only:</span> This is an English
                Speaking server, please try to talk in English.
              </div>

              <div>
                <span className="font-medium text-white">No Spam or Drama:</span> Keep conversations
                relevant and respectful.
              </div>

              <div>
                <span className="font-medium text-white">No Trading/Selling:</span> Do not trade or
                sell accounts of any kind doesn't matter what it is.
              </div>

              <div>
                <span className="font-medium text-white">No Harmful Software or Doxing:</span> Don't
                share viruses or personal information. This includes DM'S.
              </div>

              <div>
                <span className="font-medium text-white">
                  No Impersonation or Unapproved Pings:
                </span>{" "}
                Don't pretend to be staff or ping them without reason.
              </div>

              <div>
                <span className="font-medium text-white">No Ads or Political/Illegal Content:</span>{" "}
                No promotions, politics, or illegal material. This includes DM'S.
              </div>

              <div>
                <span className="font-medium text-white">Follow Discord's Terms of Service:</span>{" "}
                <a
                  href="https://discord.com/terms"
                  className="text-gray-400 hover:text-gray-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms
                </a>{" "}
                /{" "}
                <a
                  href="https://discord.com/guidelines"
                  className="text-gray-400 hover:text-gray-300 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Guidelines
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white my-3">In-Game Rules</h3>

              <div className="space-y-2">
                <div>
                  <span className="font-medium text-white">No Cheating:</span> Cheating on Solaris
                  is prohibited aswell as Screen sharing cheats on other servers or in other games
                  will result in a one-day timeout. Repeated offenses will lead to a permanent ban
                  from both the Solaris server and the game.
                </div>

                <div>
                  <span className="font-medium text-white">No Stream Sniping:</span> Don't use live
                  streams for unfair advantages.
                </div>

                <div>
                  <span className="font-medium text-white">No Ban Evading:</span> Don't use
                  alternate accounts to bypass bans.
                </div>

                <div>
                  <span className="font-medium text-white">No False Reporting:</span> Please do not
                  false report players if you are not certain they're cheating as this can get you
                  banned.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={AcceptedTerms}
            onChange={e => setAcceptedTerms(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-gray-600/30 bg-gradient-to-br from-slate-600/10 via-black-400/10 to-slate-600/10 text-gray-400 focus:ring-gray-400/20 focus:ring-2"
          />

          <span className="text-sm text-gray-200/90 leading-relaxed">
            I have read and agree to abide by the Erbium community and in-game rules.
          </span>
        </label>
      </div>

      <div className="flex flex-col mt-8 w-full">
        <div className="flex gap-3 w-full">
          <button
            onClick={() => setOBstep("ConfirmName")}
            className="
                        py-3 px-4 flex-1 rounded-lg border border-white/20 text-white font-semibold transition-all duration-200
                        relative bg-white/5 hover:bg-white/10 backdrop-blur-md shadow-lg w-full cursor-pointer
                        "
          >
            Back
          </button>

          <button
            disabled={!AcceptedTerms}
            onClick={() => setOBstep("Finishing")}
            className={`
                            py-3 px-4 flex-2 rounded-lg border border-white/20 font-semibold transition-all duration-200
                            relative backdrop-blur-md shadow-lg w-full
                            ${AcceptedTerms ? "bg-white/10 hover:bg-white/20 text-white cursor-pointer" : "bg-white/5 text-white/50 cursor-not-allowed"}
                        `}
          >
            Continue
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Terms;

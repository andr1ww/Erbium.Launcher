import React, { useState } from "react";
import { motion } from "framer-motion";
import GlassContainer from "../Global/GlassContainer";
import PlayerTab from "./PlayerTab";
import MiscTab from "./MiscTab";
import { Cog, User } from "lucide-react";

type TabType = "player" | "misc";

const SettingsNav: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>("player");

  const tabs = [
    { id: "player" as TabType, label: "Player", icon: User },
    { id: "misc" as TabType, label: "Options", icon: Cog },
  ];

  return (
    <div className="w-full flex flex-col gap-6 mt-4">
      <GlassContainer
        variant="default"
        className="rounded-xl p-1"
      >
        <div className="flex gap-2">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <motion.div
                key={tab.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveTab(tab.id)}
                className="flex-1"
              >
                <GlassContainer
                  variant={activeTab === tab.id ? "bright" : "boring"}
                  className="px-4 py-2 rounded-lg cursor-pointer transition-all flex items-center justify-center gap-2"
                >
                  <Icon
                    size={18}
                    className={activeTab === tab.id ? "text-white" : "text-white/60"}
                  />
                  <span
                    className={`text-sm font-medium ${
                      activeTab === tab.id ? "text-white" : "text-white/60"
                    }`}
                  >
                    {tab.label}
                  </span>
                </GlassContainer>
              </motion.div>
            );
          })}
        </div>
      </GlassContainer>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {activeTab === "player" && <PlayerTab />}
        {activeTab === "misc" && <MiscTab />}
      </motion.div>
    </div>
  );
};

export default SettingsNav;

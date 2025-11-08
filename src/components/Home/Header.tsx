import { useUserStore } from "@/zustand/UserStore";
import React from "react";

const Header: React.FC = () => {
  const { DisplayName } = useUserStore();
  return (
    <div className="w-full flex justify-between items-start gap-2">
      <div className="min-w-120 rounded-lg bg-linear-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 text-white px-5 py-2.5 shadow font-medium text-base flex items-center justify-between gap-4">
        <p className="opacity-85">
          <b>Note:</b> Keep in mind this launcher is currently in an early testing phase.
        </p>
      </div>

      <div className="rounded-lg bg-linear-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 backdrop-blur-lg border border-white/25 shadow-lg p-3 w-48">
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-white">Hey, {DisplayName}!</h3>
            <span className="text-xs text-gray-300">Online</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;

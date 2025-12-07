import { useUserStore } from "@/zustand/UserStore";
import GlassContainer from "@/components/Global/GlassContainer";
import React from "react";

const Header: React.FC = () => {
  const { DisplayName } = useUserStore();
  return (
    <div className="w-full flex justify-between items-start gap-2">
      <GlassContainer
        variant="grayish"
        className="min-w-120 rounded-lg text-white px-5 py-2.5 font-medium text-base flex items-center justify-between gap-4"
      >
        <p className="opacity-85">
          <b>Note:</b> Keep in mind this launcher is currently in an early testing phase.
        </p>
      </GlassContainer>

      <GlassContainer
        variant="grayish"
        className="rounded-lg p-3 w-48"
      >
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <h3 className="font-medium text-white">Hey, {DisplayName}!</h3>
            <span className="text-xs text-gray-300">Online</span>
          </div>
        </div>
      </GlassContainer>
    </div>
  );
};

export default Header;

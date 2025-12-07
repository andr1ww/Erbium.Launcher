import React from "react";

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "boring" | "bright" | "grayish";
  onClick?: () => void;
}

const GlassContainer: React.FC<GlassContainerProps> = ({
  children,
  className = "",
  variant = "default",
  onClick,
}) => {
  const variants = {
    default: "bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8",
    boring: "bg-gradient-to-br from-slate-600/5 via-black-400/5 to-slate-600/5",
    bright: "bg-gradient-to-br from-slate-600/10 via-black-400/10 to-slate-600/10",
    grayish: "bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 bg-gray-500/5",
  };

  return (
    <div
      onClick={onClick}
      className={`backdrop-blur-lg border border-white/25 shadow-lg ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
};

export default GlassContainer;

import React from "react";
export default function WelcomeStep({
  onContinue,
}: {
  onContinue: () => void;
}) {
  return (
    <div className="w-full min-w-[500px] max-w-4xl mx-auto p-10 bg-black/40 backdrop-blur-xl rounded-md shadow-2xl border border-white/5">
      <div className="text-center space-y-6">
        <div className="py-1">
          <div className="w-20 h-20 mx-auto bg-white/5 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
            <img
              src="./Logo.png"
              alt="Erbium logo"
              className="w-10 h-10 object-contain"
            />
          </div>
        </div>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold text-white">Welcome to Erbium</h1>
          <p className="text-lg text-white/60">
            Let's get you ready to use Erbium
          </p>
        </div>
        <button
          onClick={onContinue}
          className="w-full py-3 px-6 bg-white text-black rounded-lg font-medium hover:bg-white/60 transition-all"
        >
          Get Started
        </button>
      </div>
    </div>
  );
}

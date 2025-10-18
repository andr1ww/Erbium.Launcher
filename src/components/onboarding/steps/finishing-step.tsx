import React from "react";

export default function FinishingStep({ username }: { username: string }) {
  return (
    <div className="w-full min-w-[500px] mx-auto p-8 bg-black/40 backdrop-blur-xl rounded-md shadow-2xl border border-white/5">
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
          <h2 className="text-3xl font-bold text-white">
            All Set, {username}!
          </h2>
          <p className="text-lg text-white/60">Setting up...</p>
        </div>

        <div className="flex justify-center">
          <div className="flex gap-2">
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-3 h-3 bg-white rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";

export default function UsernameStep({
  username,
  onUsernameChange,
  onBack,
  onContinue,
}: {
  username: string;
  onUsernameChange: (value: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const [error, setError] = useState("");

  const handleContinue = () => {
    setError("");
    onContinue();
  };

  return (
    <div className="w-full min-w-[500px] mx-auto p-8 bg-black/40 backdrop-blur-xl rounded-md shadow-2xl border border-white/5">
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Choose a Username</h2>
          <p className="text-white/60">
            This will be your display name for Erbium
          </p>
        </div>

        <div className="space-y-2">
          <input
            type="text"
            value={username}
            onChange={(e) => {
              onUsernameChange(e.target.value);
              setError("");
            }}
            placeholder="Enter username"
            className="w-full px-4 py-3 bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-white/30 focus:border-white/30"
            autoFocus
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-all border border-white/10"
          >
            Back
          </button>
          <button
            onClick={handleContinue}
            disabled={!username.trim()}
            className="flex-1 py-3 px-6 bg-white text-black rounded-lg font-medium hover:bg-white/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

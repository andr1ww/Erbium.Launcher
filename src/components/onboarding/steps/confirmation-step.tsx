import React from "react";

export default function ConfirmationStep({
  username,
  onBack,
  onConfirm,
}: {
  username: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="w-full min-w-[500px] mx-auto p-8 bg-black/40 backdrop-blur-xl rounded-md shadow-2xl border border-white/5">
      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-white">Confirm Username</h2>
          <p className="text-white/60">Is this the username you want?</p>
        </div>

        <div className="p-5 bg-black/30 backdrop-blur-sm rounded-xl border border-white/10">
          <p className="text-sm text-white/60 mb-2">Your username</p>
          <p className="text-2xl font-bold text-white">{username}</p>
        </div>

        <div className="p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
          <p className="text-sm text-white/70">
            <strong className="text-white">Note:</strong> You can change this
            later in settings
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onBack}
            className="flex-1 py-3 px-6 bg-white/10 backdrop-blur-sm text-white rounded-lg font-medium hover:bg-white/20 transition-all border border-white/10"
          >
            Back
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-6 bg-white text-black rounded-lg font-medium hover:bg-white/50 transition-all"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import GlassContainer from "../Global/GlassContainer";
import { useConfigStore } from "@/zustand/configStore";
import { Eye, EyeClosed } from "lucide-react";

const PlayerTab: React.FC = () => {
  const {
    email,
    password,
    hostEmail,
    hostPassword,
    setEmail,
    setPassword,
    setHostEmail,
    setHostPassword,
  } = useConfigStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHostModalOpen, setIsHostModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showHostPassword, setShowHostPassword] = useState(false);
  const [tempEmail, setTempEmail] = useState(email);
  const [tempPassword, setTempPassword] = useState(password);
  const [tempHostEmail, setTempHostEmail] = useState(hostEmail);
  const [tempHostPassword, setTempHostPassword] = useState(hostPassword);

  const handleOpenModal = () => {
    setTempEmail(email);
    setTempPassword(password);
    setIsModalOpen(true);
  };

  const handleOpenHostModal = () => {
    setTempHostEmail(hostEmail);
    setTempHostPassword(hostPassword);
    setIsHostModalOpen(true);
  };

  const handleSave = () => {
    setEmail(tempEmail);
    setPassword(tempPassword);
    setIsModalOpen(false);
    setShowPassword(false);
  };

  const handleSaveHost = () => {
    setHostEmail(tempHostEmail);
    setHostPassword(tempHostPassword);
    setIsHostModalOpen(false);
    setShowHostPassword(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setShowPassword(false);
    setTempEmail(email);
    setTempPassword(password);
  };

  const handleCancelHost = () => {
    setIsHostModalOpen(false);
    setShowHostPassword(false);
    setTempHostEmail(hostEmail);
    setTempHostPassword(hostPassword);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className=""
    >
      <h2 className="text-2xl font-semibold text-white">Credentials</h2>
      <p className="text-sm font-semibold text-white/25 mb-6">
        User and Host account credentials (These must be different)!
      </p>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleOpenModal}
      >
        <GlassContainer
          variant="default"
          className="p-6 rounded-lg group cursor-pointer hover:border-white/40 transition-all"
        >
          <div>
            <small className="text-xs group-hover:text-white transition-all duration-200 text-white/50">
              Click to edit!
            </small>
            <h2 className="text-white text-xl font-semibold">User Info</h2>
            <p className="text-white/40 mb-4">Credentials used for the player to log in</p>
            <div className="space-y-3">
              <p className="text-xs text-white/50 mb-1">Email</p>
              <p className="text-sm text-white/80">{email || "No email"}</p>
            </div>
          </div>
        </GlassContainer>
      </motion.div>

      <AnimatePresence>
        {isModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancel}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={e => e.stopPropagation()}
            >
              <GlassContainer
                variant="bright"
                className="w-full max-w-md p-6 rounded-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Edit Email/Password</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                  <input
                    type="email"
                    value={tempEmail}
                    onChange={e => setTempEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={tempPassword}
                      onChange={e => setTempPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Enter your password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showPassword ? (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      )}
                    </motion.button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-md text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    className="flex-1 px-4 py-2.5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-md text-white text-sm font-medium transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </GlassContainer>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={handleOpenHostModal}
      >
        <GlassContainer
          variant="default"
          className="p-6 rounded-lg group cursor-pointer hover:border-white/40 transition-all"
        >
          <div>
            <small className="text-xs group-hover:text-white transition-all duration-200 text-white/50">
              Click to edit!
            </small>
            <h2 className="text-white text-xl font-semibold">Host Info</h2>
            <p className="text-white/40 mb-4">
              Credentials used for the Game Server (Erbium) to log in
            </p>
            <div className="space-y-3">
              <p className="text-xs text-white/50 mb-1">Host Email</p>
              <p className="text-sm text-white/80">{hostEmail || "No email"}</p>
            </div>
          </div>
        </GlassContainer>
      </motion.div>

      <AnimatePresence>
        {isHostModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCancelHost}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
              onClick={e => e.stopPropagation()}
            >
              <GlassContainer
                variant="bright"
                className="w-full max-w-md p-6 rounded-xl space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">Edit Host Email/Password</h3>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">Host Email</label>
                  <input
                    type="email"
                    value={tempHostEmail}
                    onChange={e => setTempHostEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                    placeholder="Enter host email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-2">
                    Host Password
                  </label>
                  <div className="relative">
                    <input
                      type={showHostPassword ? "text" : "password"}
                      value={tempHostPassword}
                      onChange={e => setTempHostPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-md px-4 py-2.5 pr-12 text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                      placeholder="Enter host password"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowHostPassword(!showHostPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                    >
                      {showHostPassword ? <EyeClosed /> : <Eye />}
                    </motion.button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCancelHost}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/20 rounded-md text-white text-sm font-medium transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveHost}
                    className="flex-1 px-4 py-2.5 bg-white/20 hover:bg-white/25 border border-white/30 rounded-md text-white text-sm font-medium transition-colors"
                  >
                    Save Changes
                  </motion.button>
                </div>
              </GlassContainer>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PlayerTab;

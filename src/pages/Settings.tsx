import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { open } from "@tauri-apps/plugin-dialog";
import { invoke } from "@tauri-apps/api/core";
// Components
import SettingsNav from "@/components/Settings/SettingsNav";
import { useUserStore } from "@/zustand/UserStore";
import { useOnBoardingStore } from "@/zustand/OnBoardingStore";
import { useGameSettingsStore } from "@/zustand/GameSettingsStore";

const Settings: React.FC = () => {
    const navigate = useNavigate();
    const { setDisplayName } = useUserStore();
    const { setOBstep } = useOnBoardingStore();
    
    const {
        redirectDLL,
        clientDLL,
        gameServerDLL,
        gsEmail,
        gsPassword,
        setRedirectDLL,
        setClientDLL,
        setGameServerDLL,
        setGsEmail,
        setGsPassword,
    } = useGameSettingsStore();

    const [verifying, setVerifying] = useState<string | null>(null);
    const [tempGsEmail, setTempGsEmail] = useState(gsEmail);
    const [tempGsPassword, setTempGsPassword] = useState(gsPassword);
    const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");

    const handleSignOut = () => {
        setDisplayName("");
        setGsEmail("");
        setGsPassword("");
        setOBstep("GetStarted");
        navigate("/");
    };

    const handleSaveCredentials = () => {
        setSaveStatus("saving");
        
        setGsEmail(tempGsEmail);
        setGsPassword(tempGsPassword);
        
        setTimeout(() => {
            setSaveStatus("saved");
            setTimeout(() => {
                setSaveStatus("idle");
            }, 2000);
        }, 300);
    };

    const chooseDLL = async (type: "redirect" | "client" | "gameserver") => {
        const selected = await open({
            multiple: false,
            filters: [{
                name: "DLL Files",
                extensions: ["dll"]
            }]
        });

        if (selected) {
            const path = selected as string;
            
            setVerifying(type);
            try {
                const exists = await invoke("check_file_exists", { path });
                
                if (exists) {
                    switch(type) {
                        case "redirect":
                            setRedirectDLL(path);
                            break;
                        case "client":
                            setClientDLL(path);
                            break;
                        case "gameserver":
                            setGameServerDLL(path);
                            break;
                    }
                } else {
                    alert(`File not found at: ${path}`);
                }
            } catch (error) {
                console.error("Error verifying file:", error);
                alert(`Error verifying file: ${error}`);
            } finally {
                setVerifying(null);
            }
        }
    };

    const clearDLL = (type: "redirect" | "client" | "gameserver") => {
        switch(type) {
            case "redirect":
                setRedirectDLL("");
                break;
            case "client":
                setClientDLL("");
                break;
            case "gameserver":
                setGameServerDLL("");
                break;
        }
    };

      return (
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
                type: "tween",
                duration: 0.3,
            }}
            className="w-[calc(100vw-64px)] ml-16 h-screen overflow-y-auto flex p-7 flex-col justify-start items-start"
        >
            <div className="w-full flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <button 
                    onClick={handleSignOut}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors z-50 relative"
                >
                    Sign Out
                </button>
            </div>
            <div className="w-full h-px bg-white mb-6"></div>
            
            <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-xl bg-transparent flex items-center justify-center text-2xl font-bold text-white">
                    <img src="/Logo.png" alt="Erbium Logo" className="w-full h-full object-contain" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white">
                        Erbium
                    </h2>
                    <p className="text-sm text-gray-400">
                        Made with ❤️ from andrew, peeks and abstract
                    </p>
                </div>
            </div>

            <div className="w-full space-y-4 relative z-10 mb-6">

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-white font-semibold mb-2">Redirect</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => chooseDLL("redirect")}
                            disabled={verifying === "redirect"}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors relative z-20 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed"
                        >
                            {verifying === "redirect" ? "Verifying..." : "Choose DLL"}
                        </button>
                        {redirectDLL && (
                            <button 
                                onClick={() => clearDLL("redirect")}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {redirectDLL && (
                        <div className="mt-2 p-2 bg-gray-900 rounded">
                            <p className="text-sm text-green-400 font-mono break-all">{redirectDLL}</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-white font-semibold mb-2">UE Patch (Client)</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => chooseDLL("client")}
                            disabled={verifying === "client"}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors relative z-20 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed"
                        >
                            {verifying === "client" ? "Verifying..." : "Choose DLL"}
                        </button>
                        {clientDLL && (
                            <button 
                                onClick={() => clearDLL("client")}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {clientDLL && (
                        <div className="mt-2 p-2 bg-gray-900 rounded">
                            <p className="text-sm text-green-400 font-mono break-all">{clientDLL}</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                    <h3 className="text-white font-semibold mb-2">GS</h3>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => chooseDLL("gameserver")}
                            disabled={verifying === "gameserver"}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors relative z-20 cursor-pointer disabled:bg-blue-800 disabled:cursor-not-allowed"
                        >
                            {verifying === "gameserver" ? "Verifying..." : "Choose DLL"}
                        </button>
                        {gameServerDLL && (
                            <button 
                                onClick={() => clearDLL("gameserver")}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Clear
                            </button>
                        )}
                    </div>
                    {gameServerDLL && (
                        <div className="mt-2 p-2 bg-gray-900 rounded">
                            <p className="text-sm text-green-400 font-mono break-all">{gameServerDLL}</p>
                        </div>
                    )}
                </div>

                <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
    <h3 className="text-white font-semibold mb-3">Game Server Credentials (Optional)</h3>
    <p className="text-sm text-gray-400 mb-3">Configure credentials for game server authentication</p>
    <div className="space-y-3">
        <div>
            <label className="text-sm text-gray-400 mb-1 block">Game Server Email</label>
            <input
                type="email"
                value={tempGsEmail}
                onChange={(e) => setTempGsEmail(e.target.value)}
                placeholder="gameserver@example.com"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
        </div>
        <div>
            <label className="text-sm text-gray-400 mb-1 block">Game Server Password</label>
            <input
                type="password"
                value={tempGsPassword}
                onChange={(e) => setTempGsPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
        </div>
        <button
            onClick={handleSaveCredentials}
            disabled={saveStatus === "saving"}
            className={`w-full px-4 py-2 rounded font-medium transition-all ${
                saveStatus === "saved" 
                    ? "bg-green-600 text-white" 
                    : "bg-blue-600 text-white hover:bg-blue-700"
            } disabled:bg-blue-800 disabled:cursor-not-allowed`}
        >
            {saveStatus === "saving" && "Saving..."}
            {saveStatus === "saved" && "Saved!"}
            {saveStatus === "idle" && "Save Credentials"}
        </button>
    </div>
</div>

            </div>

            <SettingsNav />
        </motion.div>
    );
};

export default Settings;
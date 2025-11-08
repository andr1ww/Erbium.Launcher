import React, { useState } from "react";
import { motion } from "framer-motion";
import { Blurhash } from "react-blurhash";

// Icons
import { IoPlay } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";

const BuildsGrid: React.FC = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <motion.div 
            initial={{ filter: "blur(10px)", opacity: 0 }}
            animate={{ filter: "blur(0px)", opacity: 1 }}
            exit={{ filter: "blur(10px)", opacity: 0 }}
            transition={{
                type: "tween",
                duration: 0.25
            }}
            className="w-full my-6"
        >
            <div className="grid 2xl:grid-cols-9 lg:grid-cols-6 grid-cols-4 gap-3.5">
                <div className="relative w-full h-55 2xl:h-62 rounded-md border border-white/25 overflow-hidden shadow-lg group">
                    {!isLoaded && (
                        <Blurhash
                            hash="LBB.ywK6^6I-3G%3EKxC0JIrR$Ri"
                            width="100%"
                            height="100%"
                            resolutionX={32}
                            resolutionY={32}
                            punch={1}
                            className="absolute transition-all ease-in-out duration-500 group-hover:scale-110"
                        />
                    )}
                    <img
                        src="https://raw.githubusercontent.com/CodeWslt/Fortnite-Splash-Screens/refs/heads/main/Season%2018/Splash.bmp"
                        alt="Splash"
                        className="absolute w-full h-full object-cover transition-all ease-in-out duration-500 group-hover:scale-110"
                        onLoad={() => setIsLoaded(true)}
                        loading="lazy"
                        draggable={false}
                    />
                    
                    <div className="absolute bottom-0 left-0 bg-gradient-to-t px-1.5 py-1.25 group from-black/68 to-black/2 w-full h-full opacity-0 group-hover:opacity-100 transition-all ease duration-300 flex flex-col justify-end items-start">
                        <span className="text-white/80 text-sm leading-3 translate-y-10 group-hover:translate-y-0 transition-all duration-350 delay-45">
                            Fortnite 18.40
                        </span>

                        <span className="text-white/35 font-light text-xs translate-y-10 group-hover:translate-y-0 transition-all duration-350 delay-25">
                            18.40-CL-9380822
                        </span>

                        <div className="absolute right-0 bottom-0 px-1.5 py-2.25 flex flex-col gap-1.5">
                            <div className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-25 bg-black/20 hover:bg-black/30 backdrop-blur-md">
                                <IoPlay className="w-3.5 h-3.5" />
                            </div>

                            <div className="text-white/55 p-1.25 rounded-sm border cursor-pointer border-white/25 hover:text-white/80 hover:border-white/50 translate-x-8 group-hover:translate-x-0 transition-all duration-350 delay-25 bg-black/20 hover:bg-black/30 backdrop-blur-md">
                                <MdDeleteForever className="w-3.5 h-3.5" />
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </motion.div> 
    );
};

export default BuildsGrid;
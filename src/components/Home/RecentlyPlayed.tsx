import { LibraryBig } from "lucide-react";
import React, { useState } from "react";
import { Blurhash } from "react-blurhash";

const RecentlyPlayed: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-600/8 via-black-400/8 to-slate-600/8 p-3 border-white/25 rounded-lg w-full max-w-xl text-left shadow-lg backdrop-blur-sm border relative overflow-hidden">
      <h2 className="text-white 2xl:text-xl text-base font-semibold mb-2 relative text-center">
        Recently Played Builds
        <span>
          <LibraryBig className="inline-block ml-2 text-gray-400 w-5 h-5" />
        </span>
      </h2>

      <div className="flex flex-col gap-3.5">
        <div className="relative w-full h-12 rounded-sm border flex justify-between pr-3.5 items-center border-white/25 backdrop-blur-2xl bg-black/1 overflow-hidden shadow-lg group">
          <div className="absolute left-0 top-0 2xl:w-150 w-100 h-full">
            {!isLoaded && (
              <Blurhash
                hash="LCAu8l}EwajYS8EkEyJQI@n%xCxD"
                width="100%"
                height="100%"
                resolutionX={32}
                resolutionY={32}
                punch={1}
                className="absolute w-full h-full object-cover transition-all duration-350 group-hover:scale-110 mask-r-from-20%"
              />
            )}

            <img
              src="https://cdn2.unrealengine.com/s18-ss-cinematic-1920x1080-01-1920x1080-26b0af26e89b.jpg"
              alt="Splash"
              className="absolute w-full h-full object-cover transition-all duration-350 group-hover:scale-106 mask-r-from-20%"
              onLoad={() => setIsLoaded(true)}
              draggable={false}
              loading="lazy"
            />
          </div>

          <div className="flex pl-1.5 mb-2 gap-2">
            <span className="text-white/80 px-1.5 py-px rounded-sm text-sm bg-black/10 border border-white/20 backdrop-blur-md drop-shadow-2xl">
              Fortnite 18.40
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentlyPlayed;

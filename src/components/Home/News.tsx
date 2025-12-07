import React, { useEffect, useRef, useState } from "react";
import { Blurhash } from "react-blurhash";
import removeMarkdown from "remove-markdown";

// Tauri
import { openUrl } from "@tauri-apps/plugin-opener";

// Icons
import { FaNewspaper } from "react-icons/fa";
import GlassContainer from "../Global/GlassContainer";

const News: React.FC = () => {
  const [Scrolled, setScrolled] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const gridRef = useRef<HTMLDivElement>(null);
  const topMarkerRef = useRef<HTMLDivElement>(null);

  const posts = [
    {
      id: 1,
      title: "Erbium 1.0.0",
      description: "Welcome to Erbium!",
      image:
        "https://static.wikia.nocookie.net/fortnite/images/2/29/Tilted_Towers_%28S6%29_-_Location_-_Fortnite_OG.png",
      blurhash: "LPCs{s55E0nNLNs9n3nhO]xFV@e-",
    },
  ];

  useEffect(() => {
    const sentinel = topMarkerRef.current;
    const observer = new IntersectionObserver(
      entries => {
        const entry = entries[0];
        setScrolled(!entry.isIntersecting);
      },
      { root: gridRef.current, threshold: 0.01 }
    );

    if (sentinel) observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  const handleImageLoad = (id: number) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  return (
    <div className="w-full h-full py-1">
      <h2 className="text-gray-200/95 2xl:text-xl text-base font-semibold mb-4 flex items-center gap-1">
        <FaNewspaper className="text-gray-200/95 2xl:w-6 2xl:h-6 w-4.5 h-4.5 mr-1" />
        Announcements:
      </h2>

      <div
        ref={gridRef}
        className={`relative w-full max-h-full grid grid-cols-5 gap-1.5 overflow-y-auto pb-12 transition-all duration-300 ${
          Scrolled ? "mask-t-from-85%" : ""
        }`}
      >
        <div
          ref={topMarkerRef}
          className="absolute top-0 left-0 pointer-events-none h-px w-full"
        />

        {posts.map((post, index) => {
          const isLoaded = loadedImages[post.id];

          return (
            <div
              key={post.id}
              onClick={() => console.log("erm")}
              className={`w-full cursor-pointer pointer-events-auto relative z-50 hover:bg-white/10 rounded-lg p-1.75 group transition-all ease ${index === 0 ? "col-span-2" : ""}`}
            >
              <div
                className={`w-full rounded-md overflow-hidden relative ${
                  index < 4 ? "2xl:h-58 xl:h-35 h-32" : "aspect-[2/1]"
                }`}
              >
                {!isLoaded && (
                  <Blurhash
                    hash={post.blurhash}
                    width={"100%"}
                    height={"100%"}
                    resolutionX={32}
                    resolutionY={32}
                    punch={1}
                    className="object-cover"
                  />
                )}

                <img
                  src={post.image}
                  alt={post.title}
                  draggable={false}
                  onLoad={() => handleImageLoad(post.id)}
                  loading="lazy"
                  className={`transition-all ease duration-350 w-full h-full group-hover:blur-sm object-cover ${
                    index < 4 ? "object-center" : "object-cover"
                  }`}
                />
              </div>

              <h3
                className={`text-white font-semibold mt-2 line-clamp-1 leading-5.5 truncate max-w-48 ${
                  index === 0 ? "2xl:text-lg text-md" : "2xl:text-md text-sm"
                }`}
              >
                {post.title}
              </h3>

              <p
                className={`text-gray-200/70 leading-relaxed line-clamp-2 truncate max-w-48 ${
                  index === 0 ? "2xl:text-md text-sm" : "2xl:text-sm text-xs"
                }`}
              >
                {removeMarkdown(post.description)}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default News;

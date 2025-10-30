"use client";

import Particles from "@/components/core/particles";
import Sidebar from "@/components/core/sidebar";
import Modal from "@/components/home/modal";
import { useUserState } from "@/zustand/user-state";
import { motion } from "framer-motion";
import { useState } from "react";

interface Card {
  title: string;
  image: string;
  description: string;
  body: string;
  blurhash: string;
}

export default function Home() {
  const { DisplayName } = useUserState();
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});

  const cards: Card[] = [
    {
      title: "Chapter 2 Season 9",
      image: "https://i.ytimg.com/vi/NjNelAbKd-E/maxresdefault.jpg",
      description: "suck me penis",
      body: "Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. Today chapter 2 season 9 will release. ",
      blurhash: "L5BjP}bY00oyJNoM%3WB0Jj[~Eay",
    },
  ];

  const handleImageLoad = (id: number) => {
    setLoadedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="font-sans flex min-h-screen">
      <Particles className="absolute inset-0 -z-10" />
      <Sidebar page={{ page: "home" }} />
      <motion.main
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="flex-1 flex flex-col mt-3"
      >
        <div className="flex flex-col gap-6 p-6 mt-2">
          <div className="flex flex-col gap-2">
            <h1 className="text-5xl font-bold text-foreground">
              Hey, {DisplayName}!
            </h1>
            <p className="text-lg text-muted-foreground">
              There is currently 1 person using Erbium!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {cards.map((card, index) => {
              const isLoaded = loadedImages[index];

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  onClick={() => setSelectedCard(card)}
                  className="cursor-pointer group"
                >
                  <div className="rounded-lg overflow-hidden bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all duration-200">
                    <div className="w-full h-34 relative overflow-hidden">
                      <img
                        src={card.image || "/placeholder.svg"}
                        alt={card.title}
                        draggable={false}
                        onLoad={() => handleImageLoad(index)}
                        loading="lazy"
                        className="w-full h-full object-cover transition-all duration-300 group-hover:blur-sm group-hover:scale-105"
                      />
                    </div>

                    <div className="bg-zinc-950 p-4 border-t border-zinc-800">
                      <h3 className="text-white font-semibold text-lg line-clamp-1 mb-1">
                        {card.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                        {card.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.main>

      <Modal
        isOpen={selectedCard !== null}
        onClose={() => setSelectedCard(null)}
        card={selectedCard}
      />
    </div>
  );
}

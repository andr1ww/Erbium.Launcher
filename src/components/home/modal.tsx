"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

interface Card {
  title: string;
  image: string;
  description: string;
  body: string;
  blurhash: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: Card | null;
}

export default function Modal({ isOpen, onClose, card }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "unset";
      return;
    }

    document.body.style.overflow = "hidden";

    const handleDocMouseDown = (e: MouseEvent) => {
      const modalEl = document.querySelector(".bg-zinc-900");
      if (modalEl && !modalEl.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleDocMouseDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("mousedown", handleDocMouseDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && card && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-zinc-900 border border-zinc-800 rounded-md shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden"
            >
              <div className="w-full h-32 relative overflow-hidden">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="bg-zinc-950 p-6 border-t border-zinc-800">
                <h2 className="text-2xl font-bold text-white mb-2">
                  {card.title}
                </h2>
                <p className="text-zinc-400 text-sm mb-4">{card.description}</p>
                <div className="h-px bg-zinc-800 mb-4" />
                <p className="text-zinc-300 leading-relaxed">{card.body}</p>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

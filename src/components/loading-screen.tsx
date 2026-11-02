"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

// Fixed "random" positions so server and client render the same markup.
const DOTS = Array.from({ length: 10 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  top: (i * 61 + 23) % 100,
}));

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [showBar, setShowBar] = useState(false);

  useEffect(() => {
    const reveal = setTimeout(() => setShowBar(true), 100);
    let value = 0;
    let done: ReturnType<typeof setTimeout> | undefined;
    const tick = setInterval(() => {
      value = Math.min(100, value + 15 + Math.random() * 35);
      setProgress(value);
      if (value >= 100) {
        clearInterval(tick);
        done = setTimeout(onComplete, 100);
      }
    }, 50);

    return () => {
      clearTimeout(reveal);
      clearInterval(tick);
      clearTimeout(done);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[10001] flex flex-col items-center justify-center bg-[#020202fc]"
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <AnimatePresence>
        {showBar && (
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }}
            exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
          >
            <div className="h-1 w-64 overflow-hidden rounded-full bg-gray-800">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>
            <motion.div
              className="mt-4 font-mono text-sm text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {Math.round(progress)}%
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {DOTS.map((dot, i) => (
          <motion.div
            key={i}
            className="absolute h-1 w-1 rounded-full bg-gray-400"
            style={{ left: `${dot.left}%`, top: `${dot.top}%` }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: [-20, 20, -20], opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2 + 0.5 * i, repeat: Infinity, delay: 0.3 * i }}
          />
        ))}
      </div>
    </motion.div>
  );
}

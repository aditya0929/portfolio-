"use client";

import { useEffect, useState } from "react";

export type Presence = {
  label: string;
  dotClass: string;
  isCoding: boolean;
  isMusic: boolean;
  isGaming: boolean;
};

type LanyardActivity = { type: number; name: string; details?: string; state?: string };
type LanyardData = {
  discord_status: "online" | "idle" | "dnd" | "offline";
  listening_to_spotify: boolean;
  activities: LanyardActivity[];
};

const DOT = {
  green: "bg-emerald-400 shadow-[0_0_8px_#34d399]",
  greenPulse: "bg-emerald-400 shadow-[0_0_8px_#34d399] animate-pulse",
  blue: "bg-blue-400 shadow-[0_0_8px_#60a5fa] animate-pulse",
  purple: "bg-purple-400 shadow-[0_0_8px_#c084fc] animate-pulse",
  yellow: "bg-yellow-400 shadow-[0_0_8px_#facc15]",
  red: "bg-red-400 shadow-[0_0_8px_#f87171]",
};

const IDLE = { isCoding: false, isMusic: false, isGaming: false };

function toPresence(data: LanyardData | null, fallback: string): Presence {
  if (!data) return { label: fallback, dotClass: DOT.green, ...IDLE };

  // Lanyard activity type 0 = "Playing"; editors show up as "Playing Visual Studio Code" etc.
  const coding = data.activities.find((a) => a.type === 0 && /code|cursor|visual studio/i.test(a.name));
  const game = data.activities.find((a) => a.type === 0 && !/code|cursor/i.test(a.name));
  const isMusic = data.listening_to_spotify;
  const isCoding = !!coding && !isMusic;
  const isGaming = !!game && !isMusic && !isCoding;
  const flags = { isCoding, isMusic, isGaming };

  if (isMusic) {
    const spotify = data.activities.find((a) => a.name === "Spotify");
    const track = spotify?.details ? `${spotify.details} - ${spotify.state}` : "Spotify";
    return { label: `Listening to: ${track}`, dotClass: DOT.greenPulse, ...flags };
  }
  if (isCoding) return { label: `Coding: ${coding.details || coding.state || "VS Code"}`, dotClass: DOT.blue, ...flags };
  if (isGaming) return { label: `Playing: ${game.name}`, dotClass: DOT.purple, ...flags };

  switch (data.discord_status) {
    case "online":
      return { label: "Online Now", dotClass: DOT.green, ...flags };
    case "idle":
      return { label: "Away", dotClass: DOT.yellow, ...flags };
    case "dnd":
      return { label: "Do Not Disturb", dotClass: DOT.red, ...flags };
    default:
      return { label: fallback, dotClass: DOT.green, ...flags };
  }
}

/** Live Discord presence via Lanyard, polled every 15s. Without a Discord ID it returns the static label. */
export function usePresence(discordId: string | undefined, fallbackLabel: string): Presence {
  const [data, setData] = useState<LanyardData | null>(null);

  useEffect(() => {
    if (!discordId) return;
    let active = true;
    const load = async () => {
      try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${discordId}`);
        if (!res.ok) return;
        const json = (await res.json()) as { success: boolean; data?: LanyardData };
        if (active && json.success && json.data) setData(json.data);
      } catch {
        // Presence is decorative; keep the last known state.
      }
    };
    load();
    const id = setInterval(load, 15_000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [discordId]);

  return toPresence(data, fallbackLabel);
}

"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { NowPlayingData } from "@/types";

const POLL_INTERVAL = 30_000;

export function NowPlaying() {
  const [track, setTrack] = useState<NowPlayingData>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch("/api/spotify");
        if (!res.ok) return;
        const data = (await res.json()) as { track: NowPlayingData };
        setTrack(data.track);
      } catch {
        // silently ignore network errors
      }
    }

    fetchTrack();
    timer.current = setInterval(fetchTrack, POLL_INTERVAL);

    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  if (!track) return null;

  return (
    <a
      href={track.songUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2.5 text-xs text-foreground-muted transition-colors hover:text-foreground"
      aria-label={`${track.isPlaying ? "Now playing" : "Last played"}: ${track.title} by ${track.artist}`}
    >
      {track.albumArt && (
        <Image
          src={track.albumArt}
          alt={track.title}
          width={20}
          height={20}
          className="rounded-sm"
          unoptimized
        />
      )}
      <span className="font-mono">
        {track.isPlaying ? (
          <span className="mr-1 inline-block text-primary">&#9654;</span>
        ) : (
          <span className="mr-1 inline-block">&#9632;</span>
        )}
        {track.title}{" "}
        <span className="text-foreground-muted/60">- {track.artist}</span>
      </span>
    </a>
  );
}

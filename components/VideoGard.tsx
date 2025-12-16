"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pin, PinOff } from "lucide-react";

type VideoItem = {
  socketId: string;
  stream: MediaStream;
};

interface VideoGridProps {
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  videos: VideoItem[];
}

const VideoGrid: React.FC<VideoGridProps> = ({ localVideoRef, videos }) => {
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Local + Remote combine (use window.localStream for the local video)
  const localStream = (window as any).localStream as
    | MediaStream
    | null
    | undefined;
  const allVideos = [
    {
      id: "local",
      stream:
        localStream ??
        (localVideoRef.current?.srcObject as MediaStream | null) ??
        null,
    },
    ...videos.map((v) => ({
      id: v.socketId,
      stream: v.stream,
    })),
  ];

  // If the pinned participant has left (or local stream ended), clear pinnedId
  useEffect(() => {
    if (!pinnedId) return;

    const exists =
      pinnedId === "local"
        ? !!localStream
        : videos.some((v) => v.socketId === pinnedId);

    if (!exists) setPinnedId(null);
  }, [pinnedId, localStream, videos]);

  const pinnedVideo = allVideos.find((v) => v.id === pinnedId);
  const otherVideos = allVideos.filter((v) => v.id !== pinnedId);

  /* =======================
     🔹 NORMAL GRID MODE
  ======================= */
  if (!pinnedId) {
    return (
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {allVideos.map((v) => (
          <VideoTile
            key={v.id}
            id={v.id}
            stream={v.stream}
            localVideoRef={localVideoRef}
            onPin={() => setPinnedId(v.id)}
          />
        ))}
      </div>
    );
  }

  /* =======================
     🔹 PINNED MODE
  ======================= */
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
      {/* BIG PINNED VIDEO */}
      <div className="relative h-[60vh] w-full overflow-hidden rounded-2xl">
        <VideoPlayer
          id={pinnedVideo!.id}
          stream={pinnedVideo!.stream}
          localVideoRef={localVideoRef}
        />
        <PinButton pinned onClick={() => setPinnedId(null)} />
      </div>

      {/* SMALL VIDEOS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {otherVideos.map((v) => (
          <div key={v.id} className="relative h-40 overflow-hidden rounded-xl">
            <VideoPlayer
              id={v.id}
              stream={v.stream}
              localVideoRef={localVideoRef}
            />
            <PinButton onClick={() => setPinnedId(v.id)} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoGrid;

/* =======================
   🔹 VIDEO TILE
======================= */

function VideoTile({
  id,
  stream,
  localVideoRef,
  onPin,
}: {
  id: string;
  stream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
  onPin: () => void;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
      <VideoPlayer id={id} stream={stream} localVideoRef={localVideoRef} />
      <PinButton onClick={onPin} />
    </div>
  );
}

/* =======================
   🔹 VIDEO PLAYER
======================= */

function VideoPlayer({
  id,
  stream,
  localVideoRef,
}: {
  id: string;
  stream: MediaStream | null;
  localVideoRef: React.RefObject<HTMLVideoElement | null>;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const localStream = (window as any).localStream as
      | MediaStream
      | null
      | undefined;
    const src =
      id === "local"
        ? localStream ??
          (localVideoRef.current?.srcObject as MediaStream | null)
        : stream;

    if (el.srcObject !== src) {
      el.srcObject = src ?? null;
    }

    // try to ensure playback starts (may be blocked by browser policies if not muted)
    try {
      void el.play();
    } catch (e) {
      // ignore autoplay errors
    }
  }, [id, stream]);

  return (
    <video
      autoPlay
      playsInline
      muted={id === "local"}
      ref={(el) => {
        ref.current = el;
      }}
      className="h-full w-full object-cover"
    />
  );
}

/* =======================
   🔹 PIN BUTTON
======================= */

function PinButton({
  pinned = false,
  onClick,
}: {
  pinned?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="absolute right-2 top-2 z-10 rounded-full bg-black/60 p-2 text-white backdrop-blur hover:bg-black/80"
    >
      {pinned ? <PinOff size={16} /> : <Pin size={16} />}
    </button>
  );
}

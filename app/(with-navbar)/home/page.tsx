"use client";

import React, { useEffect, useRef, useState } from "react";
import { VanishForm } from "@/components/ui/skiper-ui/skiper56";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Mic, MicOff, Camera, CameraOff } from "lucide-react";

type MediaState = {
  video: boolean;
  audio: boolean;
};

const Home: React.FC = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const { addToUserHistory } = useAuth();

  const [meetingCode, setMeetingCode] = useState("");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [media, setMedia] = useState<MediaState>({
    video: true,
    audio: true,
  });

  /* ----------------------------------
     CAMERA & MIC PERMISSION
  -----------------------------------*/
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const initMedia = async () => {
      try {
        activeStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setStream(activeStream);
        if (videoRef.current) {
          videoRef.current.srcObject = activeStream;
        }
      } catch {
        alert("Camera & microphone permission denied");
      }
    };

    initMedia();

    return () => {
      activeStream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  /* ----------------------------------
     MEDIA CONTROLS
  -----------------------------------*/
  const toggleAudio = () => {
    if (!stream) return;
    stream.getAudioTracks().forEach((t) => (t.enabled = !t.enabled));
    setMedia((p) => ({ ...p, audio: !p.audio }));
  };

  const toggleVideo = async () => {
    if (!stream) return;

    if (media.video) {
      stream.getVideoTracks().forEach((t) => t.stop());
      setMedia((p) => ({ ...p, video: false }));
    } else {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: media.audio,
      });

      const combined = new MediaStream([
        ...stream.getAudioTracks(),
        ...newStream.getVideoTracks(),
      ]);

      setStream(combined);
      if (videoRef.current) videoRef.current.srcObject = combined;
      setMedia((p) => ({ ...p, video: true }));
    }
  };

  /* ----------------------------------
     MEETING ACTIONS
  -----------------------------------*/
  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) {
      alert("Enter meeting code first!");
      return;
    }

    await addToUserHistory(meetingCode);
    router.push(`/meet/${meetingCode}`);
  };

  const handleCreateMeeting = async () => {
    const newCode = crypto.randomUUID().replace(/-/g, "").slice(0, 10);
    await addToUserHistory(newCode);
    router.push(`/meet/${newCode}`);
  };

  /* ----------------------------------
     UI
  -----------------------------------*/
  return (
    <div className="min-h-screen pt-23 w-full overflow-x-hidden bg-[#fafdef] px-4 sm:px-6">
      {/* HEADER */}
      <div className="text-center pt-12 sm:pt-16 pb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Mine Video Call
        </h1>
        <p className="text-gray-600 mt-3 max-w-md mx-auto">
          Connect instantly with high-quality video meetings
        </p>
      </div>

      {/* CONTENT */}
      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {/* CAMERA PREVIEW */}
        <div className="relative rounded-xl bg-black overflow-hidden aspect-video flex items-center justify-center">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="h-full w-full object-cover"
          />

          <div className="absolute bottom-3 flex gap-3">
            <span
              onClick={toggleAudio}
              className="rounded-full p-3 text-white  transition"
            >
              {media.audio ? <Mic size={30} /> : <MicOff size={30} />}
            </span>

            <span
              onClick={toggleVideo}
              className="rounded-full text-white p-3  transition"
            >
              {media.video ? <Camera size={30} /> : <CameraOff size={30} />}
            </span>
          </div>
        </div>

        {/* JOIN / CREATE */}
        <div className="flex flex-col justify-center gap-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Join or Create a Meeting
          </h2>

          <VanishForm
            autoFocus
            placeholder="Enter meeting code"
            onChange={(e) => setMeetingCode(e.target.value)}
            onSubmit={handleJoinMeeting}
          />

          <button
            onClick={handleCreateMeeting}
            className="w-fit rounded-lg  px-6 py-3 bg-[#c2f84f] hover:bg-black text-black hover:text-white transition"
          >
            Create Instant Meeting
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;

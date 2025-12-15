"use client";

import { Controllers } from "@/components/Controllers";
import { Skiper85 } from "@/components/ui/skiper-ui/skiper85";
import { Skiper90 } from "@/components/ui/skiper-ui/skiper90";
import React, { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:8080";

type VideoItem = {
  socketId: string;
  stream: MediaStream;
};

type ConnectionsMap = {
  [key: string]: RTCPeerConnection;
};

declare global {
  interface Window {
    localStream?: MediaStream;
  }
}
let connections: ConnectionsMap = {};

const peerConfig: RTCConfiguration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

const VideoMeet: React.FC = () => {
  const socketRef = useRef<Socket | null>(null);
  const socketIdRef = useRef<string | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  const [username, setUsername] = useState("");
  const [askUsername, setAskUsername] = useState(true);

  const [video, setVideo] = useState(true);
  const [audio, setAudio] = useState(true);

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>(
    []
  );
  const [message, setMessage] = useState("");
  const [chatOpen, setChatOpen] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);

  const params = useParams();
  const meetingCode = params.roomId as string;

  /* ---------------- MEDIA ---------------- */
  const getUserMedia = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video,
      audio,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }

    (window as any).localStream = stream;
  };

  const handleUserJoined = (id: string, clients: string[]) => {
    clients.forEach((clientId) => {
      if (!connections[clientId]) {
        connections[clientId] = createPeer(clientId);
      }
    });

    // agar current user hai, to offers bhejo
    if (id === socketIdRef.current) {
      Object.keys(connections).forEach((clientId) => {
        if (clientId === socketIdRef.current) return;

        const pc = connections[clientId];

        pc.createOffer().then((offer) => {
          pc.setLocalDescription(offer);
          socketRef.current?.emit(
            "signal",
            clientId,
            JSON.stringify({ sdp: offer })
          );
        });
      });
    }
  };

  //for screen sharing feature, can be implemented later
  const toggleScreenShare = async () => {
    if (!screenSharing) {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      const sender = Object.values(connections)
        .map((pc) => pc.getSenders().find((s) => s.track?.kind === "video"))
        .find(Boolean);

      sender?.replaceTrack(screenTrack);

      screenTrack.onended = () => {
        const camTrack = (window as any).localStream?.getVideoTracks()[0];
        sender?.replaceTrack(camTrack);
        setScreenSharing(false);
      };

      setScreenSharing(true);
    }
  };

  /* ---------------- SOCKET ---------------- */
  const connectSocket = () => {
    socketRef.current = io(SERVER_URL);

    socketRef.current.on("connect", () => {
      socketIdRef.current = socketRef.current?.id ?? null;
      socketRef.current?.emit("join-call", window.location.href, username);
    });

    socketRef.current.on("signal", handleSignal);

    socketRef.current.on("user-joined", handleUserJoined);

    socketRef.current.on("user-left", (id: string) => {
      setVideos((prev) => prev.filter((v) => v.socketId !== id));
      delete connections[id];
    });

    socketRef.current.on("chat-message", ({ user, text }) => {
      setMessages((prev) => [...prev, { sender: user, text }]);
    });
  };

  /* ---------------- SIGNAL ---------------- */
  const handleSignal = async (fromId: string, data: string) => {
    const signal = JSON.parse(data);
    let pc = connections[fromId];

    if (!pc) {
      pc = createPeer(fromId);
      connections[fromId] = pc;
    }

    if (signal.sdp) {
      await pc.setRemoteDescription(signal.sdp);
      if (signal.sdp.type === "offer") {
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socketRef.current?.emit(
          "signal",
          fromId,
          JSON.stringify({ sdp: answer })
        );
      }
    }

    if (signal.ice) {
      await pc.addIceCandidate(signal.ice);
    }
  };

  //
  useEffect(() => {
    let activeStream: MediaStream;

    const startMedia = async () => {
      activeStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      window.localStream = activeStream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = activeStream;
      }
    };

    startMedia();

    // 🔥 CLEANUP (सबसे जरूरी)
    return () => {
      activeStream?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  /* ---------------- PEER ---------------- */
  const createPeer = (id: string) => {
    const pc = new RTCPeerConnection(peerConfig);

    const stream = (window as any).localStream as MediaStream;
    stream?.getTracks().forEach((track) => pc.addTrack(track, stream));

    pc.onicecandidate = (e) => {
      if (e.candidate) {
        socketRef.current?.emit(
          "signal",
          id,
          JSON.stringify({ ice: e.candidate })
        );
      }
    };

    pc.ontrack = (e) => {
      setVideos((prev) => {
        if (prev.find((v) => v.socketId === id)) return prev;
        return [...prev, { socketId: id, stream: e.streams[0] }];
      });
    };

    return pc;
  };

  /* ---------------- JOIN ---------------- */
  const joinMeeting = async () => {
    if (!username.trim()) return alert("Enter username");

    setAskUsername(false);
    await getUserMedia();
    connectSocket();
  };
  /* ---------------- MEDIA TOGGLES ---------------- */

  const toggleAudio = () => {
    const stream = (window as any).localStream as MediaStream | undefined;
    if (!stream) return;

    const audioTrack = stream.getAudioTracks()[0];
    if (!audioTrack) return;

    audioTrack.enabled = !audioTrack.enabled;
    setAudio(audioTrack.enabled);
  };

  const toggleVideo = () => {
    const stream = (window as any).localStream as MediaStream | undefined;
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    if (!videoTrack) return;

    videoTrack.enabled = !videoTrack.enabled;
    setVideo(videoTrack.enabled);
  };

  //levave meeting function can be added here
  const leaveMeeting = () => {
    try {
      const stream = (window as any).localStream as MediaStream | undefined;
      stream?.getTracks().forEach((t) => t.stop());
    } catch {}

    Object.values(connections).forEach((pc) => pc.close());
    connections = {};

    socketRef.current?.disconnect();

    window.location.href = "/";
  };

  /* ---------------- CHAT ---------------- */
  const sendMessage = () => {
    if (!message.trim()) return;

    socketRef.current?.emit("chat-message", {
      user: username,
      text: message,
    });

    setMessage("");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen pt-10 bg-black text-white flex flex-col items-center p-6">
      {askUsername ? (
        <div className="bg-slate-800 p-6 rounded-xl w-full max-w-md">
          <h2 className="text-xl mb-4 text-center">Join Meeting</h2>

          <Input
            className="w-full p-2 rounded bg-slate-700 mb-4"
            placeholder="Enter your name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <Button
            onClick={joinMeeting}
            className="w-full bg-[#c2f84f] hover:bg-black text-black hover:text-white transition py-2 rounded"
          >
            Join
          </Button>

          <video
            ref={localVideoRef}
            autoPlay
            muted
            className="mt-4 w-full rounded"
          />
        </div>
      ) : (
        <>
          {/* VIDEOS */}
          {/* <VideoGrid localVideoRef={localVideoRef} videos={videos} /> */}
          <Skiper90 localVideoRef={localVideoRef} videos={videos} />
          <div className="absolute top-3 left-3 z-50 rounded-lg px-3 py-1 text-sm text-white backdrop-blur">
            Meeting Code:{" "}
            <span className="font-semibold text-white">{meetingCode}</span>
          </div>

          {/* CONTROLS */}
          <Controllers
            toggleVideo={toggleVideo}
            toggleAudio={toggleAudio}
            video={video}
            audio={audio}
            setChatOpen={setChatOpen}
            leaveMeeting={leaveMeeting}
            toggleScreenShare={toggleScreenShare}
          />

          {/* CHAT */}
          {chatOpen && (
            // <div className="mt-6 w-full max-w-md bg-white text-black rounded p-4">
            //   <div className="h-64 overflow-y-auto mb-2 space-y-2">
            //     {messages.map((m, i) => (
            //       <div
            //         key={i}
            //         className={`p-2 rounded ${
            //           m.sender === username
            //             ? "bg-blue-100 text-right"
            //             : "bg-gray-100 text-left"
            //         }`}
            //       >
            //         <strong>{m.sender}</strong>: {m.text}
            //       </div>
            //     ))}
            //   </div>

            //   <div className="flex gap-2">
            //     <input
            //       className="flex-1 border p-2 rounded"
            //       value={message}
            //       onChange={(e) => setMessage(e.target.value)}
            //     />
            //     <button
            //       onClick={sendMessage}
            //       className="bg-blue-600 text-white px-4 rounded"
            //     >
            //       Send
            //     </button>
            //   </div>
            // </div>

            <Skiper85
              open={chatOpen}
              messages={messages}
              username={username}
              message={message}
              setMessage={setMessage}
              sendMessage={sendMessage}
            />
          )}
        </>
      )}
    </div>
  );
};

export default VideoMeet;

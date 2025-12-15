"use client";

import { ultrabol } from "@/app/fonts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fafdef] pt-20 px-4 flex flex-col items-center">
      

      {/* ABOUT CARD */}
      <Card className="w-full max-w-3xl shadow-md bg-[#1e3b4b]/60 lg:p-30">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            About <span className={`${ultrabol.className}`}>V</span>ideoCh
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6 text-gray-100 leading-relaxed">
          <p>
            <span className={`${ultrabol.className}`}>V</span>ideoCh is a
            modern, secure, and easy-to-use video calling platform designed for
            instant communication. It allows users to create or join meetings in
            seconds without any complex setup or unnecessary steps.
          </p>

          <p>
            This platform is built with real-time technologies like WebRTC and
            Socket.IO to ensure smooth video, audio, and chat communication. The
            focus is on performance, simplicity, and a clean user experience
            across all devices.
          </p>

          <p>
            VideoCh also provides useful features such as meeting history,
            secure authentication, user profiles, and a responsive interface.
            These features help users manage their meetings efficiently and stay
            connected effortlessly.
          </p>

          <p>
            The goal of VideoCh is to deliver a fast, reliable, and professional
            video communication experience while keeping the interface minimal
            and user-friendly. It is continuously evolving with more features
            and improvements planned ahead.
          </p>
        </CardContent>
      </Card>

      
    </div>
  );
}

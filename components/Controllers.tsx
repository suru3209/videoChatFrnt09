import {
  Mic,
  MicOff,
  Camera,
  CameraOff,
  MessagesSquare,
  LogOut,
  MonitorUp,
} from "lucide-react";

type ControllersProps = {
  toggleVideo: () => void;
  toggleAudio: () => void;
  toggleScreenShare: () => void;
  leaveMeeting: () => void;
  video: boolean;
  audio: boolean;
  setChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const Controllers = ({
  toggleVideo,
  toggleAudio,
  video,
  audio,
  setChatOpen,
  leaveMeeting,
  toggleScreenShare,
}: ControllersProps) => {
  return (
    <>
      <nav className="w-full py-6 flex justify-center z-50">
        <div className="rounded-full w-[450px] max-lg:w-[800px] max-[370px]:w-[345px] max-[450px]:w-[400px] max-[350px]:w-[330px] max-[321px]:w-[310px] px-2 py-1 bg-white/40 bg-opacity-1 backdrop-blur-lg border dark:border-white/20 flex items-center justify-center dark:shadow-none shadow">
          <div className="flex justify-center px-2 items-center max-sm:gap-4 gap-8 max-[400px]:gap-4 max-[450px]:gap-5 transition-all">
            <div className="flex gap-4">
              <button onClick={toggleVideo} className="px-4 py-2 text-black">
                {video ? <Camera /> : <CameraOff />}
              </button>

              <button onClick={toggleAudio} className="px-4 py-2 text-black">
                {audio ? <Mic /> : <MicOff />}
              </button>

              <button
                onClick={() => setChatOpen((p) => !p)}
                className="px-4 py-2 text-black"
              >
                <MessagesSquare />
              </button>

              <button onClick={leaveMeeting} className="px-4 py-2 text-red-600">
                <LogOut />
              </button>

              <button
                onClick={toggleScreenShare}
                className="px-4 py-2 text-black"
              >
                <MonitorUp />
              </button>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

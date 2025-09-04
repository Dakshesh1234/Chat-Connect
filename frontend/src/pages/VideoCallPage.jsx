import { useEffect, useRef } from "react";
import { useVideoCallStore } from "../store/useVideoCallStore";
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  PhoneIncoming,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useNavigate } from "react-router-dom";

const VideoCallPage = () => {
  const {
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    incomingCall,
    caller,
    inCall,
    toggleMute,
    toggleCamera,
    answerCall,
    rejectCall,
    hangUp,
  } = useVideoCallStore();

  const { selectedUser } = useChatStore();
  const { authUser } = useAuthStore();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);

  const handleHangUp = () => {
    hangUp();
    navigate("/");
  };

  if (incomingCall && !inCall) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-base-200">
        <div className="text-center space-y-4">
          <p>{caller.fullName} is calling...</p>
          <div className="flex gap-4 justify-center">
            <button className="btn btn-success" onClick={answerCall}>
              <PhoneIncoming /> Accept
            </button>
            <button className="btn btn-error" onClick={rejectCall}>
              <PhoneOff /> Reject
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-base-200 relative">
      <div className="relative w-full h-full">
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className="absolute w-48 h-32 bottom-4 right-4 border-2 border-white rounded-md"
        />
      </div>

      <div className="absolute bottom-10 flex gap-4">
        <button
          className={`btn btn-circle ${isMuted ? "btn-error" : "btn-success"}`}
          onClick={toggleMute}
        >
          {isMuted ? <MicOff /> : <Mic />}
        </button>
        <button
          className={`btn btn-circle ${
            isCameraOff ? "btn-error" : "btn-success"
          }`}
          onClick={toggleCamera}
        >
          {isCameraOff ? <VideoOff /> : <Video />}
        </button>
        <button className="btn btn-circle btn-error" onClick={handleHangUp}>
          <PhoneOff />
        </button>
      </div>
    </div>
  );
};

export default VideoCallPage;
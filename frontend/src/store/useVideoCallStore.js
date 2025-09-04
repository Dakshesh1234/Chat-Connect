import { create } from "zustand";
import { useAuthStore } from "./useAuthStore";

let peerConnection;
const configuration = {
  iceServers: [
    {
      urls: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
    },
  ],
};

export const useVideoCallStore = create((set, get) => ({
  localStream: null,
  remoteStream: null,
  isMuted: false,
  isCameraOff: false,
  inCall: false,
  incomingCall: false,
  caller: null,
  callee: null,

  initCall: async (callee) => {
    const socket = useAuthStore.getState().socket;
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    set({ localStream, callee });

    peerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      set({ remoteStream: event.streams[0] });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: callee._id,
          candidate: event.candidate,
        });
      }
    };

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);

    socket.emit("call-user", { to: callee._id, offer });
    set({ inCall: true });
  },

  answerCall: async () => {
    const socket = useAuthStore.getState().socket;
    const { incomingCall, caller, localStream } = get();

    set({ inCall: true });
    peerConnection = new RTCPeerConnection(configuration);

    localStream.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream);
    });

    peerConnection.ontrack = (event) => {
      set({ remoteStream: event.streams[0] });
    };

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ice-candidate", {
          to: caller._id,
          candidate: event.candidate,
        });
      }
    };

    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(incomingCall.offer)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("make-answer", { to: caller._id, answer });
    set({ incomingCall: null });
  },

  rejectCall: () => {
    const socket = useAuthStore.getState().socket;
    const { caller } = get();
    socket.emit("reject-call", { to: caller._id });
    set({ incomingCall: null, caller: null });
  },

  hangUp: () => {
    const socket = useAuthStore.getState().socket;
    const { callee, caller } = get();
    const otherParty = callee || caller;

    if (otherParty) {
      socket.emit("hang-up", { to: otherParty._id });
    }

    if (peerConnection) {
      peerConnection.close();
      peerConnection = null;
    }

    const { localStream } = get();
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    set({
      localStream: null,
      remoteStream: null,
      inCall: false,
      incomingCall: false,
      caller: null,
      callee: null,
    });
  },

  toggleMute: () => {
    const { localStream, isMuted } = get();
    if (localStream) {
      localStream.getAudioTracks()[0].enabled = isMuted;
      set({ isMuted: !isMuted });
    }
  },

  toggleCamera: () => {
    const { localStream, isCameraOff } = get();
    if (localStream) {
      localStream.getVideoTracks()[0].enabled = isCameraOff;
      set({ isCameraOff: !isCameraOff });
    }
  },

  handleCallMade: async (data) => {
    const localStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    set({ localStream, incomingCall: data, caller: data.caller });
  },

  handleAnswerMade: async (data) => {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(data.answer)
    );
  },

  handleIceCandidate: (data) => {
    if (peerConnection) {
      peerConnection.addIceCandidate(new RTCIceCandidate(data.candidate));
    }
  },

  handleCallRejected: () => {
    get().hangUp();
  },

  handleHangUp: () => {
    get().hangUp();
  },
}));
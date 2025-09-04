import Navbar from "./components/Navbar";

import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import VideoCallPage from "./pages/VideoCallPage";

import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { useThemeStore } from "./store/useThemeStore";
import { useEffect } from "react";

import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import { useVideoCallStore } from "./store/useVideoCallStore";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const {
    incomingCall,
    inCall,
    handleCallMade,
    handleAnswerMade,
    handleIceCandidate,
    handleCallRejected,
    handleHangUp,
  } = useVideoCallStore();
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // This hook navigates the user to the call screen when a call comes in
  useEffect(() => {
    if (incomingCall && !inCall) {
      navigate("/video-call");
    }
  }, [incomingCall, inCall, navigate]);

  // This hook sets up and tears down the WebRTC socket listeners
  useEffect(() => {
    if (socket) {
      socket.on("call-made", handleCallMade);
      socket.on("answer-made", handleAnswerMade);
      socket.on("ice-candidate", handleIceCandidate);
      socket.on("call-rejected", handleCallRejected);
      socket.on("hang-up", handleHangUp);

      // Clean up listeners when the component unmounts or socket changes
      return () => {
        socket.off("call-made", handleCallMade);
        socket.off("answer-made", handleAnswerMade);
        socket.off("ice-candidate", handleIceCandidate);
        socket.off("call-rejected", handleCallRejected);
        socket.off("hang-up", handleHangUp);
      };
    }
  }, [
    socket,
    handleCallMade,
    handleAnswerMade,
    handleIceCandidate,
    handleCallRejected,
    handleHangUp,
  ]);

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <div data-theme={theme}>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route path="/settings" element={<SettingsPage />} />
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/video-call"
          element={authUser ? <VideoCallPage /> : <Navigate to="/login" />}
        />
      </Routes>

      <Toaster />
    </div>
  );
};
export default App;
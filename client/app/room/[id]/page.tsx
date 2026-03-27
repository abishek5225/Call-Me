"use client";

import { useParams, useRouter } from "next/navigation";
import { useWebRTC }    from "./hooks/useWebRTC";
import RoomHeader       from "./components/RoomHeader";
import VideoStage       from "./components/VideoStage";
import ControlBar       from "./components/ControlBar";
import ErrorScreen      from "./components/ErrorScreen";
import styles           from "./room.module.css";

export default function RoomPage() {
  const { id: roomId } = useParams<{ id: string }>();
  const router = useRouter();

  // All WebRTC + Socket.IO logic is encapsulated in this hook
  const {
    localVideoRef,
    remoteVideoRef,
    status,
    error,
    isMuted,
    isCameraOff,
    toggleMute,
    toggleCamera,
    hangUp,
  } = useWebRTC(roomId);

  // Show error screen if camera/mic access failed or server unreachable
  if (error) {
    return (
      <ErrorScreen
        message={error}
        onBack={() => router.push("/")}
      />
    );
  }

  return (
    <div className={styles.room}>
      {/* Top bar: logo, room ID, status pill, invite button */}
      <RoomHeader
        roomId={roomId}
        status={status}
      />

      {/* Main area: remote video (full) + local video (PiP) */}
      <VideoStage
        localVideoRef={localVideoRef}
        remoteVideoRef={remoteVideoRef}
        status={status}
        isCamOff={isCameraOff}
      />

      {/* Bottom bar: mute, camera, hang-up controls */}
      <ControlBar
        isMuted={isMuted}
        isCamOff={isCameraOff}
        onToggleMute={toggleMute}
        onToggleCamera={toggleCamera}
        onHangUp={hangUp}
      />
    </div>
  );
}
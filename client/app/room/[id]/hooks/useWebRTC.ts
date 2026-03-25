"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { ConnectionStatus } from "../types";

const SIGNALING_SERVER =
  process.env.NEXT_PUBLIC_SIGNALING_SERVER || "http://localhost:3001";
 
const ICE_SERVERS: RTCIceServer[] = [
  { urls: "stun:stun.l.google.com:19302" },
];

export function useWebRTC(roomId: string) {
  const router = useRouter();

  const localVideoRef  = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const socketRef      = useRef<Socket | null>(null);
  const pcRef          = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);

  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const[isMuted, setIsMuted] = useState(false);
  const[isCameraOff, setIsCameraOff] = useState(false);
  const [error, setError] = useState<string | null>(null);

  //create peer connection 

  const createPeerConnection = useCallback(() => {
    // Create RTCPeerConnection with ICE servers
    const pc = new RTCPeerConnection({ iceServers: ICE_SERVERS });
  
    // ICE candidates found -> forward it to other peer via signaling server
    pc.onicecandidate = (event) => {
      if (event.candidate && socketRef.current) {
        socketRef.current.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });
      }
    }

    //  Remote track arrived — attach it to the remote <video> element
    pc.ontrack = (event) => {
      if (remoteVideoRef.current && event.streams[0]) {
        remoteVideoRef.current.srcObject = event.streams[0];
        setStatus("connected");
      }
    }

    //connection dropped
    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "disconnected" || pc.connectionState === "failed") {
        setStatus("disconnected");
      }
    }

    //share local audio and video with remote peer
    localStreamRef.current?.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current!);
    });

    pcRef.current = pc;
    return pc;
  }, [roomId]);
    

  //main setup effect
  useEffect(() => {
    let mounted = true;

    const init = async () => {

      try{
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });

        if (!mounted) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
      }catch {
        setError("Unable to access camera and microphone. Please grant permissions and try again.");
        return;
      }

      // Connect to signaling server
      const socket = io(SIGNALING_SERVER, { transports: ["websocket"] });
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("join-room", { roomId });
        setStatus("waiting");
      });

      
    }
  })
}
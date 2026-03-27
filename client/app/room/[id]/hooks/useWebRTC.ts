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
      //get camera + mic access
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

       socket.on("connect_error", () => {
        setError(
          "Cannot reach the signaling server.\n" +
            "Make sure server.js is running on port 3001."
        );
      });

      // signaling: offer / answer / ICE

      // caller — second person just joined we send the offer
       socket.on("user-joined", async () => {
        if (!mounted) return;
        setStatus("calling");
        const pc = createPeerConnection();
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit("offer", { roomId, offer });
      });


      // callee — received an offer, create and send answer
      socket.on("offer", async ({ offer }: { offer: RTCSessionDescriptionInit }) => {
        if (!mounted) return;
        setStatus("calling");
        const pc = createPeerConnection();
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit("answer", { roomId, answer });
      });

      //caller — received the answer handshake complete
      socket.on("answer", async ({ answer }: { answer: RTCSessionDescriptionInit }) => {
        if (!mounted || !pcRef.current) return;
        await pcRef.current.setRemoteDescription(
          new RTCSessionDescription(answer)
        );
      });

      //Both sides — trickle ICE candidates back and forth
      socket.on("ice-candidate", async ({ candidate }: { candidate: RTCIceCandidateInit }) => {
        if (!mounted || !pcRef.current) return;
        try {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch {
          // Candidate arrived before setRemoteDescription 
        }
      });

       //  The other person left the room
      socket.on("user-left", () => {
        if (!mounted) return;
        setStatus("disconnected");
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
        pcRef.current?.close();
        pcRef.current = null;
      });

    }
  })
}
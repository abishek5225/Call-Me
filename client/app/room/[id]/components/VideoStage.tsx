"use client";
 
import { RefObject } from "react";
import { ConnectionStatus, STATUS_CONFIG } from "../types";
import styles from "../room.module.css";
 
interface VideoStageProps {
  localVideoRef:  RefObject<HTMLVideoElement | null>;
  remoteVideoRef: RefObject<HTMLVideoElement | null>;
  status:         ConnectionStatus;
  isCamOff:       boolean;
}
 
export default function VideoStage({
  localVideoRef,
  remoteVideoRef,
  status,
  isCamOff,
}: VideoStageProps) {
  const { label } = STATUS_CONFIG[status];
 
  return (
    <div className={styles.stage}>
 
      {/*  remote video */}
      <div className={styles.remoteContainer}>
        <video
          ref={remoteVideoRef}
          autoPlay
          playsInline
          className={styles.remoteVideo}
        />
 
        {/* waiting overlay — hidden once "connected" */}
        {status !== "connected" && (
          <div className={styles.remoteOverlay}>
            <div className={styles.waitingDots}>
              <span /><span /><span />
            </div>
            <p>{label}</p>
          </div>
        )}
 
        <div className={styles.remoteLabel}>Remote</div>
      </div>
 
      {/* local video */}
      <div className={styles.localContainer}>
        <video
          ref={localVideoRef}
          autoPlay
          playsInline
          muted
          className={`${styles.localVideo} ${isCamOff ? styles.hidden : ""}`}
        />
 
        {/* Shown when the user turns their camera off */}
        {isCamOff && (
          <div className={styles.camOffPlaceholder}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <line x1="1"  y1="1"  x2="23" y2="23" />
              <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
            </svg>
          </div>
        )}
 
        <div className={styles.localLabel}>You</div>
      </div>
    </div>
  );
}
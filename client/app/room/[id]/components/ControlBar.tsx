"use client";

import styles from "../room.module.css";

interface ControlBarProps {
  isMuted:      boolean;
  isCamOff:     boolean;
  onToggleMute:   () => void;
  onToggleCamera: () => void;
  onHangUp:       () => void;
}

export default function ControlBar({
  isMuted,
  isCamOff,
  onToggleMute,
  onToggleCamera,
  onHangUp,
}: ControlBarProps) {
  return (
    <footer className={styles.controls}>
        {/*mute unmute*/}
      <button
        className={`${styles.controlBtn} ${isMuted ? styles.controlOff : ""}`}
        onClick={onToggleMute}
        title={isMuted ? "Unmute microphone" : "Mute microphone"}
      >
        {isMuted ? (
          // mic icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
            <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8"  y1="23" x2="16" y2="23" />
          </svg>
        ) : (
          // mic-on icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8"  y1="23" x2="16" y2="23" />
          </svg>
        )}
        <span>{isMuted ? "Unmute" : "Mute"}</span>
      </button>

      {/*  Stop / Start Camera */}
      <button
        className={`${styles.controlBtn} ${isCamOff ? styles.controlOff : ""}`}
        onClick={onToggleCamera}
        title={isCamOff ? "Turn camera on" : "Turn camera off"}
      >
        {isCamOff ? (
          // Camera-off icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="1" y1="1" x2="23" y2="23" />
            <path d="M21 21H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h3m3-3h6l2 3h4a2 2 0 0 1 2 2v9.34m-7.72-2.06a4 4 0 1 1-5.56-5.56" />
          </svg>
        ) : (
          // Camera-on icon
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
        )}
        <span>{isCamOff ? "Start Cam" : "Stop Cam"}</span>
      </button>

      {/* Hang Up  */}
      <button
        className={`${styles.controlBtn} ${styles.hangupBtn}`}
        onClick={onHangUp}
        title="End call"
      >
        {/* phone hang-up icon */}
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M6.62 10.79a15.53 15.53 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.01-.24
               a11.5 11.5 0 0 0 3.63.58 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1
               A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1
               a11.5 11.5 0 0 0 .58 3.63 1 1 0 0 1-.25 1.01z"
            transform="rotate(135 12 12)"
          />
        </svg>
        <span>End</span>
      </button>
    </footer>
  );
}
"use client";
 
import { useState } from "react";
import { ConnectionStatus, STATUS_CONFIG } from "../types";
import styles from "../room.module.css";
 
interface RoomHeaderProps {
  roomId: string;
  status: ConnectionStatus;
}
 
export default function RoomHeader({ roomId, status }: RoomHeaderProps) {
  const [copied, setCopied] = useState(false);
 
  const { label, color } = STATUS_CONFIG[status];
 
  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  return (
    <header className={styles.header}>
      {/* Left — logo + room ID */}
      <div className={styles.headerLeft}>
        <span className={styles.logo}>VC</span>
        <div className={styles.roomInfo}>
          <span className={styles.roomLabel}>Room</span>
          <code className={styles.roomId}>{roomId}</code>
        </div>
      </div>
 
      {/* Center — live status pill */}
      <div
        className={styles.statusPill}
        style={{ "--status-color": color } as React.CSSProperties}
      >
        <span className={styles.statusDot} />
        {label}
      </div>
 
      {/* Right — copy invite link */}
      <button
        className={styles.copyBtn}
        onClick={copyLink}
        title="Copy invite link"
      >
        {copied ? (
          <>
            {/* Checkmark icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Copied!
          </>
        ) : (
          <>
            {/* Copy icon */}
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
            Invite
          </>
        )}
      </button>
    </header>
  );
}
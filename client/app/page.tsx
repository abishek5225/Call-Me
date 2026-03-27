"use client"

import { useRouter } from "next/router"
import { useState } from "react"
import styles from "./page.module.css"


function generateRoomId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from(
    { length: 10 },
    () => chars[Math.floor(Math.random() * chars.length)]
  ).join("");
}

export default function HomePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
 
  const handleStart = () => {
    setLoading(true);
    const roomId = generateRoomId();
    router.push(`/room/${roomId}`);
  };

return(

  <main className={styles.main}>
    {/*Grid bg*/}
     <div className={styles.grid} aria-hidden="true">
        {Array.from({ length: 80 }).map((_, i) => (
          <div key={i} className={styles.cell} />
        ))}
      </div>
        {/* Hero content */}
      <div className={styles.content}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.dot} />
          WebRTC · Peer-to-Peer · Encrypted
        </div>
 
        {/* Title */}
        <h1 className={styles.title}>
          <span className={styles.titleSolid}>Video</span>
          <span className={styles.titleOutline}>Call</span>
        </h1>
 
        {/* Subtitle */}
        <p className={styles.description}>
          Instant peer-to-peer video calls.
          <br />
          No accounts. No recording. No middleman.
        </p>
 
        {/* CTA button */}
        <button
          className={styles.button}
          onClick={handleStart}
          disabled={loading}
        >
          {loading ? (
            <span className={styles.btnInner}>
              <span className={styles.spinner} />
              Creating room…
            </span>
          ) : (
            <span className={styles.btnInner}>
              {/* Camera icon */}
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polygon points="23 7 16 12 23 17 23 7" />
                <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
              </svg>
              Start Meeting
            </span>
          )}
        </button>
 
        <p className={styles.hint}>
          Share the room link with one other person to connect
        </p>
      </div>
 
      {/* Footer version tag */}
      <div className={styles.corner} aria-hidden="true">
        <span>v1.0</span>
        <span>·</span>
        <span>WebRTC + Socket.IO</span>
      </div>
  </main>
)
}
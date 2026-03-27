"use client";

import styles from "../room.module.css";

interface ErrorScreenProps {
  message: string;
  onBack: () => void;
}

export default function ErrorScreen({ message, onBack }: ErrorScreenProps) {
return (
    <div className={styles.errorScreen}>
      <div className={styles.errorBox}>
        {/* Warning circle icon */}
        <svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="var(--danger)"
          strokeWidth="1.8"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8"  x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
 
        {/* Error message — \n characters render as line breaks */}
        <p>{message}</p>
 
        <button className={styles.backBtn} onClick={onBack}>
          ← Back to Home
        </button>
      </div>
    </div>
  );
}
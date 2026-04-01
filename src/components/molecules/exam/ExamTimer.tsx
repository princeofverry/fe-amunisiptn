"use client";

import { useState, useEffect, useCallback } from "react";

interface ExamTimerProps {
  remainingSeconds: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ remainingSeconds, onTimeUp }: ExamTimerProps) {
  const [seconds, setSeconds] = useState(remainingSeconds);

  useEffect(() => {
    setSeconds(remainingSeconds);
  }, [remainingSeconds]);

  useEffect(() => {
    if (seconds <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds <= 0]); // eslint-disable-line

  const validSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(validSeconds / 60);
  const secs = validSeconds % 60;
  const isLow = validSeconds < 300; // Less than 5 minutes

  return (
    <div
      className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold border-2 transition-colors ${
        isLow
          ? "bg-red-50 text-red-600 border-red-200 animate-pulse"
          : "bg-[#EBF4FF] text-[#004AAB] border-[#004AAB]/20"
      }`}
    >
      <span>Sisa waktu</span>
      <span className="font-mono">
        {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
      </span>
    </div>
  );
}

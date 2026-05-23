"use client";

import { useState, useEffect } from "react";

interface ExamTimerProps {
  remainingSeconds: number;
  onTimeUp: () => void;
}

export default function ExamTimer({ remainingSeconds, onTimeUp }: ExamTimerProps) {
  const [displaySeconds, setDisplaySeconds] = useState(remainingSeconds);

  useEffect(() => {
    if (remainingSeconds <= 0) {
      setDisplaySeconds(0);
      onTimeUp();
      return;
    }

    // Set target end time
    const endTime = Date.now() + remainingSeconds * 1000;
    
    // Immediate sync
    setDisplaySeconds(remainingSeconds);

    const timer = setInterval(() => {
      const now = Date.now();
      const diff = Math.ceil((endTime - now) / 1000);
      
      if (diff <= 0) {
        clearInterval(timer);
        setDisplaySeconds(0);
        onTimeUp();
      } else {
        setDisplaySeconds(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [remainingSeconds]); // Sync with prop changes (like subtest change or refresh)

  const mins = Math.floor(displaySeconds / 60);
  const secs = displaySeconds % 60;
  const isLow = displaySeconds < 300; // Less than 5 minutes

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

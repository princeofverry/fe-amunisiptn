"use client";

import { useState, useEffect } from "react";
import { useDataMode } from "@/components/providers/DataModeProvider";

export function useRegisteredTryouts() {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);
  const { mode } = useDataMode();

  useEffect(() => {
    if (mode === "dummy") {
      const saved = localStorage.getItem("amunisi_registered_tryouts");
      if (saved) {
        try {
          setRegisteredIds(JSON.parse(saved));
        } catch (e) {
          setRegisteredIds([]);
        }
      }
    }
    // In backend mode, registration status is handled via API
  }, [mode]);

  const registerTryout = (tryoutId: string) => {
    if (mode === "backend") {
      // In backend mode, use POST /tryouts/{id}/enroll
      // This is handled by the enroll mutation directly
      return;
    }

    const current = localStorage.getItem("amunisi_registered_tryouts");
    let arr: string[] = [];
    if (current) {
      try {
        arr = JSON.parse(current);
      } catch (e) {
        arr = [];
      }
    }
    
    if (!arr.includes(tryoutId)) {
      arr.push(tryoutId);
      localStorage.setItem("amunisi_registered_tryouts", JSON.stringify(arr));
      setRegisteredIds(arr);
    }
  };

  const checkIsRegistered = (tryoutId: string): boolean => {
    if (mode === "backend") {
      // In backend mode, check via my-tryouts API
      return false; // Will be overridden by actual API data
    }
    return registeredIds.includes(tryoutId);
  };

  return { registeredIds, registerTryout, checkIsRegistered, isBackendMode: mode === "backend" };
}

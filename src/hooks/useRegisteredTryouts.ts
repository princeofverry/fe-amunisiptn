"use client";

import { useState, useEffect } from "react";

export function useRegisteredTryouts() {
  const [registeredIds, setRegisteredIds] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("amunisi_registered_tryouts");
    if (saved) {
      try {
        setRegisteredIds(JSON.parse(saved));
      } catch (e) {
        setRegisteredIds([]);
      }
    }
  }, []);

  const registerTryout = (tryoutId: string) => {
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
    return registeredIds.includes(tryoutId);
  };

  return { registeredIds, registerTryout, checkIsRegistered };
}

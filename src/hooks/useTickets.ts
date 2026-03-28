"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useDataMode } from "@/components/providers/DataModeProvider";

export function useTickets() {
  const [ticketCount, setTicketCount] = useState<number>(0);
  const { mode } = useDataMode();
  const { data: session } = useSession();

  useEffect(() => {
    if (mode === "backend") {
      // Read from session user's ticket_balance
      const balance = (session?.user as any)?.ticket_balance ?? 0;
      setTicketCount(balance);
    } else {
      // Dummy mode: use localStorage
      const savedTickets = localStorage.getItem("amunisi_tickets");
      if (savedTickets !== null) {
        setTicketCount(parseInt(savedTickets, 10));
      } else {
        localStorage.setItem("amunisi_tickets", "0");
      }

      const handleStorageChange = (e: Event) => {
        let newValue: string | null = null;
        if (e.type === "storage") {
          if ((e as StorageEvent).key === "amunisi_tickets") {
            newValue = (e as StorageEvent).newValue;
          }
        } else if (e.type === "tickets_updated") {
          newValue = localStorage.getItem("amunisi_tickets");
        }

        if (newValue !== null && newValue !== undefined) {
          setTicketCount(parseInt(newValue, 10));
        }
      };

      window.addEventListener("storage", handleStorageChange);
      window.addEventListener("tickets_updated", handleStorageChange);

      return () => {
        window.removeEventListener("storage", handleStorageChange);
        window.removeEventListener("tickets_updated", handleStorageChange);
      };
    }
  }, [mode, session]);

  const addTicket = (amount: number = 1) => {
    if (mode === "backend") {
      // In backend mode, tickets are managed server-side
      // This is a no-op; refresh session instead
      return;
    }
    const current = parseInt(localStorage.getItem("amunisi_tickets") || "0", 10);
    const newCount = current + amount;
    localStorage.setItem("amunisi_tickets", newCount.toString());
    setTicketCount(newCount);
    window.dispatchEvent(new CustomEvent("tickets_updated"));
  };

  const deductTicket = (amount: number = 1): boolean => {
    if (mode === "backend") {
      // In backend mode, ticket deduction happens via POST /enroll
      return true; // Optimistic - actual deduction is server-side
    }
    const current = parseInt(localStorage.getItem("amunisi_tickets") || "0", 10);
    if (current >= amount) {
      const newCount = current - amount;
      localStorage.setItem("amunisi_tickets", newCount.toString());
      setTicketCount(newCount);
      window.dispatchEvent(new CustomEvent("tickets_updated"));
      return true;
    }
    return false;
  };

  return { ticketCount, addTicket, deductTicket, isBackendMode: mode === "backend" };
}

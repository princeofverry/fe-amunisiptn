"use client";

import { useState, useEffect } from "react";

export function useTickets() {
  const [ticketCount, setTicketCount] = useState<number>(0);

  // Sync state with localStorage across components
  useEffect(() => {
    // Initial load
    const savedTickets = localStorage.getItem("amunisi_tickets");
    if (savedTickets !== null) {
      setTicketCount(parseInt(savedTickets, 10));
    } else {
      // Default initial value if not set
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
  }, []);

  const addTicket = (amount: number = 1) => {
    const current = parseInt(localStorage.getItem("amunisi_tickets") || "0", 10);
    const newCount = current + amount;
    localStorage.setItem("amunisi_tickets", newCount.toString());
    setTicketCount(newCount);
    // Dispatch custom event for other components in the same window
    window.dispatchEvent(new CustomEvent("tickets_updated"));
  };

  const deductTicket = (amount: number = 1): boolean => {
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

  return { ticketCount, addTicket, deductTicket };
}

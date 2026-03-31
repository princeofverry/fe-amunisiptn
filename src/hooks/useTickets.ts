"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export function useTickets() {
  const [ticketCount, setTicketCount] = useState<number>(0);
  const { data: session } = useSession();

  useEffect(() => {
    // Read from session user's ticket_balance
    const balance = (session?.user as any)?.ticket_balance ?? 0;
    setTicketCount(balance);
  }, [session]);

  const addTicket = (_amount: number = 1) => {
    // In backend mode, tickets are managed server-side
    // This is a no-op; refresh session instead
    return;
  };

  const deductTicket = (_amount: number = 1): boolean => {
    // In backend mode, ticket deduction happens via POST /enroll
    return true; // Optimistic - actual deduction is server-side
  };

  return { ticketCount, addTicket, deductTicket };
}

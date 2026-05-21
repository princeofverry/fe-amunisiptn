"use client";

import { useSession } from "next-auth/react";

export function useTickets() {
  const { data: session } = useSession();
  const ticketCount = session?.user?.ticket_balance ?? 0;

  const addTicket = () => {
    // In backend mode, tickets are managed server-side
    // This is a no-op; refresh session instead
    return;
  };

  const deductTicket = (): boolean => {
    // In backend mode, ticket deduction happens via POST /enroll
    return true; // Optimistic - actual deduction is server-side
  };

  return { ticketCount, addTicket, deductTicket };
}

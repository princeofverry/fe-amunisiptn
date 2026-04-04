"use client";

import { useGetDetailTransaction } from "@/http/transactions/get-detail-transaction";
import { useSession } from "next-auth/react";

interface DashboardAdminTransactionDetailWrapperProps {
  id: string;
}

export default function DashboardAdminTransactionDetailWrapper({
  id,
}: DashboardAdminTransactionDetailWrapperProps) {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetDetailTransaction({
    id,
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated" && !!id,
    },
  });

  return (
    <section>
      <div></div>
    </section>
  );
}

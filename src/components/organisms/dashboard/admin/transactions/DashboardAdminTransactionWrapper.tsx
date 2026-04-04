"use client";

import { transactionColumns } from "@/components/atoms/datacolumn/DataTransaction";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllTransaction } from "@/http/transactions/get-all-transactions";
import { useSession } from "next-auth/react";

export default function DashboardAdminTransactionWrapper() {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetAllTransaction({
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });
  return (
    <section>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <Input
              placeholder="Cari berdasarkan nama pengguna..."
              className="max-w-xs w-full"
            />
            <DataTable
              columns={transactionColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

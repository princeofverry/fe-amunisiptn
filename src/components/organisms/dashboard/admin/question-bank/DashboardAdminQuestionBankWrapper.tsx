"use client";

import { questionBankColumns } from "@/components/atoms/datacolumn/DataQuestionBank";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllSubtest } from "@/http/subtest/get-all-subtest";
import { useSession } from "next-auth/react";

export default function DashboardAdminQuestionBankWrapper() {
  const { data: session } = useSession();

  const { data, isPending } = useGetAllSubtest({
    token: session?.access_token as string,
  });

  return (
    <section>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <Input
              placeholder="Cari berdasarkan nama bank soal..."
              className="max-w-xs w-full"
            />
            <DataTable
              columns={questionBankColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

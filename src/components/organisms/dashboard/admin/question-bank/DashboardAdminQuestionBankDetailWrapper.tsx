"use client";

import { questionColumns } from "@/components/atoms/datacolumn/DataQuestion";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllQuestionBySubtest } from "@/http/questions/get-all-question-by-subtest";
import { useSession } from "next-auth/react";

interface DashboardAdminQuestionBankDetailWrapperProps {
  id: string;
}

export default function DashboardAdminQuestionBankDetailWrapper({
  id,
}: DashboardAdminQuestionBankDetailWrapperProps) {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetAllQuestionBySubtest({
    id,
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
              placeholder="Cari berdasarkan pertanyaan..."
              className="max-w-xs w-full"
            />
            <DataTable
              columns={questionColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

"use client";

import { questionColumns } from "@/components/atoms/datacolumn/DataQuestion";
import { questionSubtestTryoutColumns } from "@/components/atoms/datacolumn/DataQuestionSubtestTryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllQuestionBySubtest } from "@/http/questions/get-all-question-by-subtest";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

interface DashboardAdminQuestionSubtestTryoutProps {
  tryoutId: string;
  subtestId: string;
}

export default function DashboardAdminQuestionSubtestTryoutWrapper({
  tryoutId,
  subtestId,
}: DashboardAdminQuestionSubtestTryoutProps) {
  const { data: session, status } = useSession();

  const { data: question, isPending: isPendingQuestion } =
    useGetAllQuestionBySubtest({
      id: subtestId,
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
            <div className="flex items-center justify-between gap-6">
              <Input
                placeholder="Cari berdasarkan pertanyaan..."
                className="max-w-xs w-full"
              />
            </div>
            <DataTable
              columns={questionColumns}
              data={question?.data ?? []}
              isLoading={isPendingQuestion}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

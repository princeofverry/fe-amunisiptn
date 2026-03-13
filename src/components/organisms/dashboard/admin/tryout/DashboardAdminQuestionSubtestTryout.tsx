"use client";

import { questionSubtestTryoutColumns } from "@/components/atoms/datacolumn/DataQuestionSubtestTryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetQuestionSubtestTryout } from "@/http/subtest/get-question-subtest-tryout";
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

  const { data, isPending } = useGetQuestionSubtestTryout({
    tryoutId,
    subtestId,
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
              <Button size={"lg"} asChild>
                <Link href="/dashboard/admin/try-out/create">
                  <Plus /> Tambah Soal
                </Link>
              </Button>
            </div>
            <DataTable
              columns={questionSubtestTryoutColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

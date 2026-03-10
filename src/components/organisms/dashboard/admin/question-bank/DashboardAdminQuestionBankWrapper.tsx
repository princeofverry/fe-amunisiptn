"use client";

import { questionBankColumns } from "@/components/atoms/datacolumn/DataQuestionBank";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllQuestionBank } from "@/http/question-bank/question-bank";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardAdminQuestionBankWrapper() {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetAllQuestionBank({
    token: session?.access_token as string,
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
                <Link href="/dashboard/admin/question-bank/create">
                  <Plus /> Tambah Soal
                </Link>
              </Button>
            </div>
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

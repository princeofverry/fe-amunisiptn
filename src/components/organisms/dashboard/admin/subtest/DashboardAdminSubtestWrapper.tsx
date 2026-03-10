"use client";

import { subtestColumns } from "@/components/atoms/datacolumn/DataSubtest";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllSubtest } from "@/http/subtest/get-all-subtest";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardAdminSubtestWrapper() {
  const { data: session } = useSession();

  const { data, isPending } = useGetAllSubtest({
    token: session?.access_token as string,
  });

  return (
    <section>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-6">
              <Input
                placeholder="Cari berdasarkan nama subtes..."
                className="max-w-xs w-full"
              />
              <Button size={"lg"} asChild>
                <Link href="/dashboard/admin/subtest/create">
                  <Plus /> Tambah Subtes
                </Link>
              </Button>
            </div>
            <DataTable
              columns={subtestColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

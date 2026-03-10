"use client";

import { tryoutColumns } from "@/components/atoms/datacolumn/DataTryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetAllTryout } from "@/http/tryout/get-all-tryout";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function DashboardAdminTryoutWrapper() {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetAllTryout({
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
                placeholder="Cari berdasarkan judul..."
                className="max-w-xs w-full"
              />
              <Button size={"lg"} asChild>
                <Link href="/dashboard/admin/try-out/create">
                  <Plus /> Tambah Tryout
                </Link>
              </Button>
            </div>
            <DataTable
              columns={tryoutColumns}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

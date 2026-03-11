"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useGetDetailTryout } from "@/http/tryout/get-detail-tryout";
import { format } from "date-fns";
import { useSession } from "next-auth/react";
import { id as IdLocale } from "date-fns/locale";
import { useGetSubtestByTryout } from "@/http/subtest/get-subtest-by-tryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { subtestTryoutColumns } from "@/components/atoms/datacolumn/DataSubtestByTryout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import DialogCreateSubtestTryout from "@/components/atoms/dialog/subtest/DialogCreateSubtestTryout";

interface DashboardAdminTryoutDetailWrapperProps {
  id: string;
}

export default function DashboardAdminTryoutDetailWrapper({
  id,
}: DashboardAdminTryoutDetailWrapperProps) {
  const { data: session, status } = useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isPending } = useGetDetailTryout({
    id,
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const { data: subtest, isPending: isPendingSubtest } = useGetSubtestByTryout({
    id,
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const handleOpenDialog = () => {
    setIsDialogOpen(true);
  };

  return (
    <section>
      <Card>
        <CardContent className="space-y-12">
          <div className="grid xl:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Judul Tryout</h3>
              <span className="font-medium">{data?.data.title}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Deskripsi Tryout</h3>
              <span className="font-medium">{data?.data.description}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Status Tryout</h3>
              <Badge
                className={
                  data?.data.is_published
                    ? "bg-green-100 text-green-700 hover:bg-green-100 text-xs"
                    : "bg-red-100 text-red-700 hover:bg-red-100 text-xs"
                }
              >
                {data?.data.is_published ? "Dipublish" : "Draft"}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Dibuat Oleh</h3>
              <span className="font-medium">{data?.data.creator.name}</span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Tanggal Dibuat</h3>
              <span className="font-medium">
                {data?.data.created_at
                  ? format(
                      new Date(data.data.created_at),
                      "dd MMM yyyy HH:mm",
                      {
                        locale: IdLocale,
                      },
                    )
                  : "-"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-muted-foreground">Tanggal Diubah</h3>
              <span className="font-medium">
                {data?.data.updated_at
                  ? format(
                      new Date(data.data.updated_at),
                      "dd MMM yyyy HH:mm",
                      {
                        locale: IdLocale,
                      },
                    )
                  : "-"}
              </span>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-medium text-lg">Subtes</h3>
              <Button size={"lg"} onClick={handleOpenDialog}>
                <Plus /> Tambahkan Subtes
              </Button>
            </div>
            <DataTable
              columns={subtestTryoutColumns}
              data={subtest?.data ?? []}
              isLoading={isPendingSubtest}
            />
          </div>
        </CardContent>
      </Card>

      <DialogCreateSubtestTryout
        open={isDialogOpen}
        setOpen={setIsDialogOpen}
        tryoutId={id}
      />
    </section>
  );
}

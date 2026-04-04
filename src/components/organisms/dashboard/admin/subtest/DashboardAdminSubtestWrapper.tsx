"use client";

import AlertDialogDeleteSubtest from "@/components/atoms/alert-dialog/subtest/AlertDialogDeleteSubtest";
import { subtestColumns } from "@/components/atoms/datacolumn/DataSubtest";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteSubtest } from "@/http/subtest/delete-subtest";
import { useGetAllSubtest } from "@/http/subtest/get-all-subtest";
import { Subtest } from "@/types/subtest/subtest";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardAdminSubtestWrapper() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const [isSelectedDeleteSubtest, setIsSelectedDeleteSubtest] =
    useState<Subtest | null>(null);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);

  const { data, isPending } = useGetAllSubtest({
    token: session?.access_token as string,
  });

  const deleteSubtestHandler = (data: Subtest) => {
    setIsSelectedDeleteSubtest(data);
    setIsDialogDeleteOpen(true);
  };

  const { mutate: deleteSubtest } = useDeleteSubtest({
    onError: (error) => {
      toast.error("Gagal menghapus subtes!", {
        description:
          error.response?.data.message ||
          "Terjadi kesalahan saat menghapus subtes.",
      });
    },
    onSuccess: () => {
      setIsSelectedDeleteSubtest(null);
      toast.success("Berhasil menghapus subtes!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-subtests"],
      });
    },
  });

  const handleDeleteSubtest = () => {
    if (isSelectedDeleteSubtest) {
      deleteSubtest({
        id: isSelectedDeleteSubtest.id,
        token: session?.access_token as string,
      });
    }
  };

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
              columns={subtestColumns({
                deleteSubtestHandler,
              })}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {isSelectedDeleteSubtest && (
        <AlertDialogDeleteSubtest
          open={isDialogDeleteOpen}
          setOpen={setIsDialogDeleteOpen}
          confirmDelete={handleDeleteSubtest}
        />
      )}
    </section>
  );
}

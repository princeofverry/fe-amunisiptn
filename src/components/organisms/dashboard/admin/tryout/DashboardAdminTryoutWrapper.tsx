"use client";

import AlertDialogDeleteTryout from "@/components/atoms/alert-dialog/tryout/AlertDialogDeleteTryout";
import { tryoutColumns } from "@/components/atoms/datacolumn/DataTryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteTryout } from "@/http/tryout/delete-tryout";
import { useGetAllTryout } from "@/http/tryout/get-all-tryout";
import { Tryout } from "@/types/tryout/tryout";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardAdminTryoutWrapper() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [isSelectedDeleteTryout, setIsSelectedDeleteTryout] =
    useState<Tryout | null>(null);
  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);

  const deleteTryoutHandler = (data: Tryout) => {
    setIsSelectedDeleteTryout(data);
    setIsDialogDeleteOpen(true);
  };

  const { data, isPending } = useGetAllTryout({
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const { mutate: deleteTryout } = useDeleteTryout({
    onError: (error) => {
      toast.error("Gagal menghapus tryout!", {
        description:
          error.response?.data.message ||
          "Terjadi kesalahan saat menghapus tryout.",
      });
    },
    onSuccess: () => {
      setIsSelectedDeleteTryout(null);
      toast.success("Berhasil menghapus tryout!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-tryouts"],
      });
    },
  });

  const handleDeleteTryout = () => {
    if (isSelectedDeleteTryout) {
      deleteTryout({
        id: isSelectedDeleteTryout.id,
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
              columns={tryoutColumns({
                deleteTryoutHandler,
              })}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {isSelectedDeleteTryout && (
        <AlertDialogDeleteTryout
          open={isDialogDeleteOpen}
          setOpen={setIsDialogDeleteOpen}
          confirmDelete={handleDeleteTryout}
        />
      )}
    </section>
  );
}

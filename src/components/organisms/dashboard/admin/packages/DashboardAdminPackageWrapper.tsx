"use client";

import AlertDialogDeletePackage from "@/components/atoms/alert-dialog/package/AlertDialogDeletePackage";
import { packageColumns } from "@/components/atoms/datacolumn/DataPackage";
import DialogPackageDetail from "@/components/atoms/dialog/package/DialogPackageDetail";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeletePackage } from "@/http/packages/delete-package";
import { useGetAllPackage } from "@/http/packages/get-all-package";
import { Package } from "@/types/packages/package";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export default function DashboardAdminPackageWrapper() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSelectedDeletePackage, setIsSelectedDeletePackage] =
    useState<Package | null>(null);

  const deletePackageHandler = (data: Package) => {
    setIsSelectedDeletePackage(data);
    setIsDeleteDialogOpen(true);
  };

  const { mutate: deletePackage } = useDeletePackage({
    onError: (error) => {
      toast.error("Gagal menghapus paket!", {
        description:
          error.response?.data.message ||
          "Terjadi kesalahan saat menghapus paket.",
      });
    },
    onSuccess: () => {
      setIsSelectedDeletePackage(null);
      toast.success("Berhasil menghapus paket!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-packages"],
      });
    },
  });

  const handleDeletePackage = () => {
    if (isSelectedDeletePackage) {
      deletePackage({
        id: isSelectedDeletePackage.id,
        token: session?.access_token as string,
      });
    }
  };

  const handleDetailPackage = (data: Package) => {
    setSelectedPackage(data);
    setIsDialogOpen(true);
  };

  const { data, isPending } = useGetAllPackage({
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
                placeholder="Cari berdasarkan nama paket..."
                className="max-w-xs w-full"
              />
              <Button size={"lg"} asChild>
                <Link href="/dashboard/admin/packages/create">
                  <Plus /> Tambah Paket
                </Link>
              </Button>
            </div>
            <DataTable
              columns={packageColumns({
                detailPackageHandler: handleDetailPackage,
                deletePackageHandler: deletePackageHandler,
              })}
              data={data?.data ?? []}
              isLoading={isPending}
            />
          </div>
        </CardContent>
      </Card>

      {selectedPackage && (
        <DialogPackageDetail
          open={isDialogOpen}
          setOpen={setIsDialogOpen}
          packageId={selectedPackage.id}
        />
      )}

      {isSelectedDeletePackage && (
        <AlertDialogDeletePackage
          open={isDeleteDialogOpen}
          setOpen={setIsDeleteDialogOpen}
          confirmDelete={handleDeletePackage}
        />
      )}
    </section>
  );
}

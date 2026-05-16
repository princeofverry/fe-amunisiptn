"use client";

import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import { useGetAllKelasAdmin } from "@/http/kelas/get-all-kelas-admin";
import { useDeleteKelasAdmin } from "@/http/kelas/delete-kelas-admin";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminKelasPage() {
  const { data: session } = useSession();
  const token = (session as any)?.access_token || "";
  const queryClient = useQueryClient();

  const { data, isLoading } = useGetAllKelasAdmin({ token });
  const kelasList = data?.data ?? [];

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const { mutate: deleteKelas, isPending: isDeleting } = useDeleteKelasAdmin({
    onSuccess: () => {
      toast.success("Kelas berhasil dihapus!");
      queryClient.invalidateQueries({ queryKey: ["get-all-kelas-admin"] });
      setDeleteDialogOpen(false);
      setDeleteId(null);
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message ?? "Gagal menghapus kelas.";
      toast.error(message);
    },
  });

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteId) {
      deleteKelas({ id: deleteId, token });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Manajemen Kelas
        </h1>
        <Link href="/dashboard/admin/kelas/create">
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Tambah Kelas
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 animate-pulse">
                <div className="h-4 bg-gray-200 rounded flex-1" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-16" />
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-24" />
              </div>
            ))}
          </div>
        ) : kelasList.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <p className="text-base">Belum ada kelas. Tambahkan kelas pertama!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50 text-gray-600 text-left">
                  <th className="px-5 py-3.5 font-semibold">Nama</th>
                  <th className="px-5 py-3.5 font-semibold">Harga</th>
                  <th className="px-5 py-3.5 font-semibold">Diskon</th>
                  <th className="px-5 py-3.5 font-semibold">Tiket Bonus</th>
                  <th className="px-5 py-3.5 font-semibold">Peserta</th>
                  <th className="px-5 py-3.5 font-semibold">Status</th>
                  <th className="px-5 py-3.5 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {kelasList.map((kelas) => (
                  <tr
                    key={kelas.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-5 py-4 font-medium text-gray-900 max-w-[200px] truncate">
                      {kelas.name}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {kelas.price === 0
                        ? "Gratis"
                        : `Rp${kelas.price.toLocaleString("id-ID")}`}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {kelas.discount_price != null
                        ? `Rp${kelas.discount_price.toLocaleString("id-ID")}`
                        : "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {kelas.ticket_amount > 0 ? kelas.ticket_amount : "-"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {kelas.enrollments_count ?? 0}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          kelas.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {kelas.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/dashboard/admin/kelas/${kelas.id}/edit`}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDeleteClick(kelas.id)}
                          className="p-2 hover:bg-red-50 text-red-500 rounded-lg transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kelas?</AlertDialogTitle>
            <AlertDialogDescription>
              Tindakan ini tidak dapat dibatalkan. Kelas yang dihapus tidak
              dapat dikembalikan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Menghapus..." : "Hapus"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

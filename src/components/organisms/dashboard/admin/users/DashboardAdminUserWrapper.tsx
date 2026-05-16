"use client";

import AlertDialogDeleteUser from "@/components/atoms/alert-dialog/user/AlertDialogDeleteUser";
import { userColumns } from "@/components/atoms/datacolumn/DataUser";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteUser } from "@/http/users/delete-user";
import { useGetAllUsers } from "@/http/users/get-all-users";
import type { User } from "@/types/user/user";
import { useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export default function DashboardAdminUserWrapper() {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(15);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDeleteUser, setSelectedDeleteUser] = useState<User | null>(null);

  const { data, isPending } = useGetAllUsers({
    token: session?.access_token as string,
    page,
    perPage,
    search,
    options: { enabled: status === "authenticated" },
  });

  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser({
    onError: (error) => {
      toast.error("Gagal menghapus pengguna!", {
        description: error.response?.data?.message || "Terjadi kesalahan.",
      });
    },
    onSuccess: () => {
      setSelectedDeleteUser(null);
      setIsDeleteDialogOpen(false);
      toast.success("Berhasil menghapus pengguna!");
      queryClient.invalidateQueries({ queryKey: ["get-all-users"] });
    },
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleDeleteUser = () => {
    if (selectedDeleteUser) {
      deleteUser({
        id: selectedDeleteUser.id,
        token: session?.access_token as string,
      });
    }
  };

  return (
    <section>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
              <Input
                placeholder="Cari nama atau email pengguna..."
                className="max-w-xs w-full"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
              <Button type="submit" variant="outline">Cari</Button>
            </form>

            <DataTable
              columns={userColumns({
                deleteUserHandler: (user) => {
                  setSelectedDeleteUser(user);
                  setIsDeleteDialogOpen(true);
                },
              })}
              data={data?.data ?? []}
              isLoading={isPending}
            />

            {/* Pagination */}
            {data && (
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>
                    {data.total > 0
                      ? `Menampilkan ${(page - 1) * perPage + 1}–${Math.min(page * perPage, data.total)} dari ${data.total} pengguna`
                      : "Tidak ada pengguna"}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs">Tampilkan</span>
                    <Select
                      value={String(perPage)}
                      onValueChange={(v) => { setPerPage(Number(v)); setPage(1); }}
                    >
                      <SelectTrigger className="h-7 w-16 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PAGE_SIZE_OPTIONS.map((s) => (
                          <SelectItem key={s} value={String(s)} className="text-xs">{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <span className="text-xs">per halaman</span>
                  </div>
                </div>
                {data.last_page > 1 && (
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600 min-w-20 text-center">
                      {data.current_page} / {data.last_page}
                    </span>
                    <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(data.last_page, p + 1))} disabled={page === data.last_page}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedDeleteUser && (
        <AlertDialogDeleteUser
          open={isDeleteDialogOpen}
          setOpen={setIsDeleteDialogOpen}
          confirmDelete={handleDeleteUser}
          isPending={isDeleting}
        />
      )}
    </section>
  );
}

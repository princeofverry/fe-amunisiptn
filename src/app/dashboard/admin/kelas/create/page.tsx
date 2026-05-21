import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FormCreateKelas from "@/components/molecules/form/kelas/FormCreateKelas";

export default function AdminCreateKelasPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/admin/kelas"
          className="p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Tambah Kelas
        </h1>
      </div>

      <FormCreateKelas />
    </div>
  );
}

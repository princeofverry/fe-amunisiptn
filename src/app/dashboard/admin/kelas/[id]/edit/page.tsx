import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import FormUpdateKelas from "@/components/molecules/form/kelas/FormUpdateKelas";

interface AdminEditKelasPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminEditKelasPage({
  params,
}: AdminEditKelasPageProps) {
  const { id } = await params;

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
          Edit Kelas
        </h1>
      </div>

      <FormUpdateKelas kelasId={id} />
    </div>
  );
}

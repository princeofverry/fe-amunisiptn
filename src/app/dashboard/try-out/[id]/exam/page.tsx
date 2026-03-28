"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function ExamPlaceholderPage() {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 py-12 px-4">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/try-out" className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Keluar Ujian
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center flex flex-col items-center justify-center min-h-[50vh]">
        <h2 className="text-2xl font-bold text-[#3B9245] mb-4">Halaman Pengerjaan Ujian (Simulasi)</h2>
        <p className="text-gray-600 max-w-lg mx-auto">
          Ini adalah halaman kosong sementara untuk pengerjaan soal simulasi. Sistem pengerjaan Try Out CBT akan diimplementasikan di sini.
        </p>
      </div>
    </div>
  );
}

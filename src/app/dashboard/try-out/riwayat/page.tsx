"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetHistoryTryout } from "@/http/tryout/get-history-tryout";

export default function RiwayatTryoutPage() {
  const { data: session } = useSession();
  const token = (session as any)?.access_token || "";

  const { data, isLoading } = useGetHistoryTryout({ token });
  const histories = data?.data || [];

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-2 mb-6">
        <Link
          href="/dashboard/try-out"
          className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Riwayat Try Out</h1>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm p-6">
        {isLoading ? (
          <div className="flex justify-center p-10 text-slate-500">Memuat riwayat...</div>
        ) : histories.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-slate-500 gap-4">
            <BookOpen className="w-12 h-12 text-slate-300" />
            <p>Belum ada riwayat Try Out yang pernah dikerjakan.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {histories.map((hist) => (
              <div key={hist.id} className="flex flex-col md:flex-row justify-between items-start md:items-center p-5 border border-slate-100 bg-slate-50 rounded-xl gap-4 hover:shadow-sm transition-shadow">
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 text-lg">{hist.tryoutName}</span>
                  <div className="flex items-center gap-3 text-sm text-slate-500">
                    <span>Dikirim: {new Date(hist.dateTaken).toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute:'2-digit' })}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm text-slate-500">Skor:</span>
                    <span className="font-bold text-[#004AAB] text-xl">{hist.score}</span>
                  </div>
                  {hist.status === "selesai" ? (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wider">Selesai</span>
                  ) : (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider">Mengerjakan</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

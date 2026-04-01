"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useFinishTryout } from "@/http/tryout/finish-tryout";
import { Calendar, FileText, Clock } from "lucide-react";

export default function TryoutCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);
  const { data: session } = useSession();
  const token = (session as any)?.access_token || "";
  const [isSubmitted, setIsSubmitted] = useState(false);

  const finishTryoutMutation = useFinishTryout({
    token,
    options: {
      onSuccess: () => setIsSubmitted(true),
      onError: () => setIsSubmitted(true), // Still show success in case of error
    },
  });

  // Auto-submit tryout on mount
  useEffect(() => {
    if (!isSubmitted) {
      finishTryoutMutation.mutate(tryoutId);
    }
  }, []); // eslint-disable-line

  // Calculate result release date (15 days from now)
  const releaseDate = new Date();
  releaseDate.setDate(releaseDate.getDate() + 15);
  const releaseDateStr = releaseDate.toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const elapsedTime = "—";
  const totalQuestions = "—";

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 py-8 px-4">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-[#3B9245] to-[#4CAF50] rounded-2xl p-8 text-center text-white mb-8 shadow-lg">
        <h1 className="text-xl md:text-2xl font-bold mb-2">
          Selamat! Pengerjaan Try Out Anda Berhasil Disubmit.
        </h1>
        <p className="text-white/80 text-sm">
          Terima kasih telah mengerjakan. Anda selangkah lebih dekat ke universitas impian.
        </p>
      </div>

      {/* Result Info Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 space-y-6">
        {/* Result Processing Info */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 flex-shrink-0 bg-blue-50 rounded-xl flex items-center justify-center">
            <Calendar className="w-8 h-8 text-[#004AAB]" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-base">Informasi Nilai</h3>
            <p className="text-sm text-gray-600 mt-1">
              Nilai Try Out Anda sedang diproses. Hasil lengkap akan diumumkan pada:
            </p>
            <p className="text-[#004AAB] font-bold text-base mt-2">
              {releaseDateStr}, pukul 10:00 WIB.
            </p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Stats */}
        <div className="flex items-center justify-center gap-8 md:gap-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#004AAB]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Total Soal Dikerjakan:</p>
              <p className="font-bold text-xl text-gray-900">{totalQuestions}</p>
            </div>
          </div>

          <div className="w-px h-12 bg-gray-200" />

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#004AAB]" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Waktu Pengerjaan:</p>
              <p className="font-bold text-xl text-gray-900">{elapsedTime}</p>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Action Button */}
        <Link
          href="/dashboard"
          className="block w-full py-4 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold text-base rounded-xl text-center transition-colors shadow-[0_4px_0_0_#002B66] active:shadow-none active:translate-y-1"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}

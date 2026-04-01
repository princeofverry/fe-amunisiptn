"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, FileText, Clock, Ticket, Upload } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useTickets } from "@/hooks/useTickets";
import { useEnrollTryout } from "@/http/tryout/enroll-tryout";
import { useGetUserTryoutDetail } from "@/http/tryout/get-user-tryout-detail";
import { toast } from "sonner";
import type { SubtestByTryout } from "@/types/subtest/subtest";

export default function TryoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);
  const { data: session } = useSession();
  const token = (session as any)?.access_token || "";
  const { ticketCount } = useTickets();

  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  // Fetch tryout detail from API
  const { data: tryoutDetail, isLoading } = useGetUserTryoutDetail({
    id: tryoutId,
    token,
  });

  const tryout = tryoutDetail?.data;
  const tryoutTitle = tryout?.title || "";
  const isFree = tryout?.is_free ?? true;
  const tryoutType = isFree ? "Gratis" : "Premium";

  // Parse subtests from API data
  const subtests = (tryout?.tryout_subtests || [])
    .sort((a: SubtestByTryout, b: SubtestByTryout) => a.order_no - b.order_no)
    .map((ts: SubtestByTryout) => ({
      name: ts.subtest.name,
      questions: ts.subtest.max_questions,
      duration: ts.duration_minutes,
      category: ts.subtest.category,
    }));

  // Calculate totals  
  const tpsSubtests = subtests.filter((s: any) => s.category === "TPS");
  const litSubtests = subtests.filter((s: any) => s.category === "Literasi");
  const totalQuestions = subtests.reduce((sum: number, s: any) => sum + s.questions, 0);
  const totalDuration = subtests.reduce((sum: number, s: any) => sum + s.duration, 0);
  const tpsQuestions = tpsSubtests.reduce((sum: number, s: any) => sum + s.questions, 0);
  const tpsDuration = tpsSubtests.reduce((sum: number, s: any) => sum + s.duration, 0);
  const litQuestions = litSubtests.reduce((sum: number, s: any) => sum + s.questions, 0);
  const litDuration = litSubtests.reduce((sum: number, s: any) => sum + s.duration, 0);

  // Enroll mutation
  const enrollMutation = useEnrollTryout({
    token,
    options: {
      onSuccess: () => {
        setShowEnrollDialog(false);
        setProofImage(null);
        setProofPreview(null);
        toast.success(isFree ? "Berhasil mendaftar tryout!" : "Tiket berhasil digunakan! Kamu terdaftar untuk tryout ini.");
      },
      onError: (error: any) => {
        const msg = error?.response?.data?.message || "Gagal mendaftar tryout";
        toast.error(msg);
      },
    },
  });

  const handleEnroll = () => {
    enrollMutation.mutate({
      tryoutId,
      proofImage: isFree ? proofImage || undefined : undefined,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProofImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setProofPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004AAB]" />
      </div>
    );
  }

  if (!tryout) {
    return (
      <div className="w-full max-w-3xl mx-auto py-12 px-4 text-center">
        <p className="text-gray-500">Tryout tidak ditemukan.</p>
        <Link href="/dashboard/try-out" className="text-[#004AAB] font-semibold mt-4 inline-block">
          ← Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-12 bg-white min-h-screen">
      {/* Header */}
      <div className="flex items-center gap-2 p-6 border-b border-gray-100 mb-6">
        <Link href="/dashboard/try-out" className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Detail Try Out</h1>
      </div>

      <div className="px-6 md:px-10 space-y-6 max-w-4xl mx-auto">
        {/* Title */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${isFree ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
              {tryoutType}
            </span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{tryoutTitle}</h2>

          <div className="flex items-center justify-center gap-4 text-sm text-[#004AAB] font-semibold">
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>Total Waktu {totalDuration} menit</span>
            </div>
            <div className="w-px h-4 bg-gray-300" />
            <div className="flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-gray-400" />
              <span>Total Soal {totalQuestions} soal</span>
            </div>
          </div>
        </div>

        {/* Subtests Info */}
        <div className="border border-gray-200 rounded-xl p-6 md:p-8 space-y-8">
          {/* TPS */}
          {tpsSubtests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-lg">Tes Potensi Skolastik (TPS)</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Jumlah Soal : {tpsQuestions} Soal</p>
                <p>Durasi : {tpsDuration} menit</p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2">Isi subtest :</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {tpsSubtests.map((s: any) => (
                    <li key={s.name}>• {s.name} : {s.questions} soal</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {tpsSubtests.length > 0 && litSubtests.length > 0 && <hr className="border-gray-100" />}

          {/* Literasi */}
          {litSubtests.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-bold text-gray-900 text-lg">Tes Literasi</h4>
              <div className="text-sm text-gray-600 space-y-1">
                <p>Jumlah Soal : {litQuestions} Soal</p>
                <p>Durasi : {litDuration} menit</p>
              </div>
              <div className="pt-2">
                <p className="text-sm text-gray-600 mb-2">Isi subtest :</p>
                <ul className="text-sm text-gray-600 space-y-1.5">
                  {litSubtests.map((s: any) => (
                    <li key={s.name}>• {s.name} : {s.questions} soal</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-4">
          <button 
            onClick={() => setShowEnrollDialog(true)}
            className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#004AAB] hover:bg-[#003B8A] text-white shadow-[0_4px_0_0_#002B66] active:shadow-none active:translate-y-1 transition-all"
          >
            {isFree ? "Daftar Tryout (Gratis)" : `Daftar Tryout (1 Tiket)`}
          </button>
        </div>
      </div>

      {/* Enroll Dialog */}
      <Dialog open={showEnrollDialog} onOpenChange={setShowEnrollDialog}>
        <DialogContent showCloseButton={false} className="sm:max-w-md p-0 rounded-2xl overflow-hidden">
          <div className="bg-[#004AAB] p-6 text-white text-center">
            <DialogTitle className="text-xl font-bold text-white">
              {isFree ? "Daftar Tryout Gratis" : "Gunakan Tiket"}
            </DialogTitle>
            <DialogDescription className="text-white/80 text-sm mt-1">
              {isFree
                ? "Upload bukti follow akun sosial media kami untuk mendaftar"
                : `Kamu akan menggunakan 1 tiket. Sisa tiket: ${ticketCount}`
              }
            </DialogDescription>
          </div>

          <div className="p-6 space-y-5">
            {isFree ? (
              <>
                <div>
                  <label className="font-semibold text-gray-800 text-sm mb-3 block">Bukti Follow Sosial Media</label>
                  <div className="relative">
                    {proofPreview ? (
                      <div className="relative rounded-xl overflow-hidden border-2 border-green-400">
                        <img src={proofPreview} alt="Preview" className="w-full h-48 object-cover" />
                        <button
                          onClick={() => { setProofImage(null); setProofPreview(null); }}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 hover:border-[#004AAB] transition-colors">
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500 font-medium">Klik untuk upload gambar</span>
                        <span className="text-xs text-gray-400 mt-1">JPG, PNG Max 5MB</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3">
                <Ticket className="w-6 h-6 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-gray-800 text-sm">1 Tiket akan digunakan</p>
                  <p className="text-xs text-gray-500">Sisa tiket kamu: <strong>{ticketCount}</strong></p>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setShowEnrollDialog(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold py-3 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleEnroll}
                disabled={enrollMutation.isPending || (isFree && !proofImage)}
                className="flex-1 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {enrollMutation.isPending ? "Memproses..." : isFree ? "Daftar Sekarang" : "Gunakan Tiket"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

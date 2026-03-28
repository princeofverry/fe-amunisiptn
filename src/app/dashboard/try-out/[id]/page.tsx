"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, FileText, Clock, Ticket, Upload, ImageIcon } from "lucide-react";
import { useSession } from "next-auth/react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useDataMode } from "@/components/providers/DataModeProvider";
import { useTickets } from "@/hooks/useTickets";
import { useRegisteredTryouts } from "@/hooks/useRegisteredTryouts";
import { toast } from "sonner";

// Mock data
const MOCK_TRYOUT_DATA = [
  {
    id: "1",
    title: "Mini TO SNBT Episode 01",
    type: "Gratis" as const,
    startDate: "2026-04-01T00:00:00",
    endDate: "2026-04-07T23:59:59",
    description: "Mini tryout SNBT episode pertama untuk mempersiapkan siswa menghadapi UTBK SNBT.",
    subtests: [
      { name: "Penalaran Umum", questions: 30, duration: 30, category: "TPS" },
      { name: "Pengetahuan & Pemahaman Umum", questions: 20, duration: 20, category: "TPS" },
      { name: "Pemahaman Bacaan & Menulis", questions: 20, duration: 20, category: "TPS" },
      { name: "Pengetahuan Kuantitatif", questions: 20, duration: 20, category: "TPS" },
      { name: "Literasi Bahasa Indonesia", questions: 30, duration: 30, category: "Literasi" },
      { name: "Literasi Bahasa Inggris", questions: 20, duration: 25, category: "Literasi" },
      { name: "Penalaran Matematika", questions: 20, duration: 30, category: "Literasi" },
    ],
  },
  {
    id: "2",
    title: "Mini TO SNBT Episode 02",
    type: "Premium" as const,
    startDate: "2026-04-08T00:00:00",
    endDate: "2026-04-14T23:59:59",
    description: "Mini tryout SNBT episode kedua. Akses premium diperlukan.",
    subtests: [
      { name: "Penalaran Umum", questions: 30, duration: 30, category: "TPS" },
      { name: "Pengetahuan & Pemahaman Umum", questions: 20, duration: 20, category: "TPS" },
      { name: "Pemahaman Bacaan & Menulis", questions: 20, duration: 20, category: "TPS" },
      { name: "Pengetahuan Kuantitatif", questions: 20, duration: 20, category: "TPS" },
      { name: "Literasi Bahasa Indonesia", questions: 30, duration: 30, category: "Literasi" },
      { name: "Literasi Bahasa Inggris", questions: 20, duration: 25, category: "Literasi" },
      { name: "Penalaran Matematika", questions: 20, duration: 30, category: "Literasi" },
    ],
  },
  {
    id: "3",
    title: "Mini TO SNBT Episode 03",
    type: "Gratis" as const,
    startDate: "2026-04-15T00:00:00",
    endDate: "2026-04-21T23:59:59",
    description: "Mini tryout SNBT episode ketiga.",
    subtests: [
      { name: "Penalaran Umum", questions: 30, duration: 30, category: "TPS" },
      { name: "Pengetahuan & Pemahaman Umum", questions: 20, duration: 20, category: "TPS" },
      { name: "Pemahaman Bacaan & Menulis", questions: 20, duration: 20, category: "TPS" },
      { name: "Pengetahuan Kuantitatif", questions: 20, duration: 20, category: "TPS" },
      { name: "Literasi Bahasa Indonesia", questions: 30, duration: 30, category: "Literasi" },
      { name: "Literasi Bahasa Inggris", questions: 20, duration: 25, category: "Literasi" },
      { name: "Penalaran Matematika", questions: 20, duration: 30, category: "Literasi" },
    ],
  },
];

export default function TryoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);
  const { data: session } = useSession();
  const { mode } = useDataMode();
  const { ticketCount, deductTicket } = useTickets();
  const { checkIsRegistered, registerTryout } = useRegisteredTryouts();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showEnrollDialog, setShowEnrollDialog] = useState(false);
  const [proofImage, setProofImage] = useState<File | null>(null);
  const [proofPreview, setProofPreview] = useState<string | null>(null);

  const mockData = MOCK_TRYOUT_DATA.find(item => item.id === tryoutId) || MOCK_TRYOUT_DATA[0];
  const tryoutTitle = mockData.title;
  const tryoutType = mockData.type;
  const isFree = tryoutType === "Gratis";
  const subtests = mockData.subtests;

  // Calculate totals  
  const tpsSubtests = subtests.filter(s => s.category === "TPS");
  const litSubtests = subtests.filter(s => s.category === "Literasi");
  const totalQuestions = subtests.reduce((sum, s) => sum + s.questions, 0);
  const totalDuration = subtests.reduce((sum, s) => sum + s.duration, 0);
  const tpsQuestions = tpsSubtests.reduce((sum, s) => sum + s.questions, 0);
  const tpsDuration = tpsSubtests.reduce((sum, s) => sum + s.duration, 0);
  const litQuestions = litSubtests.reduce((sum, s) => sum + s.questions, 0);
  const litDuration = litSubtests.reduce((sum, s) => sum + s.duration, 0);

  useEffect(() => {
    if (mode === "dummy") {
      setIsEnrolled(checkIsRegistered(tryoutId));
    }
  }, [mode, tryoutId, checkIsRegistered]);

  const handleEnroll = () => {
    if (isFree) {
      // Free tryout - need proof image
      if (mode === "dummy") {
        registerTryout(tryoutId);
        setIsEnrolled(true);
        setShowEnrollDialog(false);
        setProofImage(null);
        setProofPreview(null);
        toast.success("Berhasil mendaftar tryout!");
      }
    } else {
      // Premium tryout - need ticket
      if (mode === "dummy") {
        if (deductTicket(1)) {
          registerTryout(tryoutId);
          setIsEnrolled(true);
          setShowEnrollDialog(false);
          toast.success("Tiket berhasil digunakan! Kamu terdaftar untuk tryout ini.");
        } else {
          toast.error("Tiket tidak cukup! Silakan beli tiket terlebih dahulu.");
        }
      }
    }
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
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-lg">Tes Potensi Skolastik (TPS)</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Jumlah Soal : {tpsQuestions} Soal</p>
              <p>Durasi : {tpsDuration} menit</p>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">Isi subtest :</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {tpsSubtests.map((s) => (
                  <li key={s.name}>• {s.name} : {s.questions} soal</li>
                ))}
              </ul>
            </div>
          </div>

          <hr className="border-gray-100" />

          {/* Literasi */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 text-lg">Tes Literasi</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Jumlah Soal : {litQuestions} Soal</p>
              <p>Durasi : {litDuration} menit</p>
            </div>
            <div className="pt-2">
              <p className="text-sm text-gray-600 mb-2">Isi subtest :</p>
              <ul className="text-sm text-gray-600 space-y-1.5">
                {litSubtests.map((s) => (
                  <li key={s.name}>• {s.name} : {s.questions} soal</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4">
          {isEnrolled ? (
            <Link 
              href={`/dashboard/try-out/${tryoutId}/start`}
              className="w-full block py-3.5 rounded-xl font-bold text-sm text-center bg-[#3B9245] hover:bg-[#317A3A] text-white shadow-[0_4px_0_0_#2b6a32] active:shadow-none active:translate-y-1 transition-all"
            >
              Mulai Tryout
            </Link>
          ) : (
            <button 
              onClick={() => setShowEnrollDialog(true)}
              className="w-full py-3.5 rounded-xl font-bold text-sm bg-[#004AAB] hover:bg-[#003B8A] text-white shadow-[0_4px_0_0_#002B66] active:shadow-none active:translate-y-1 transition-all"
            >
              {isFree ? "Daftar Tryout (Gratis)" : `Daftar Tryout (1 Tiket)`}
            </button>
          )}
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
                disabled={isFree && !proofImage && mode === "backend"}
                className="flex-1 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
              >
                {isFree ? "Daftar Sekarang" : "Gunakan Tiket"}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

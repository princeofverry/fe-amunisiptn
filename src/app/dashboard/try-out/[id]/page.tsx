"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, Clock, FileText, Info, Lock, ChevronDown, ChevronUp } from "lucide-react";
import { useTickets } from "@/hooks/useTickets";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function TryoutDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);

  // Mock data to match TryoutPage
  const MOCK_DATA = [
    {
      id: "1",
      title: "Mini TO SNBT Episode 01",
      type: "Gratis" as const,
      startDate: "2026-04-01T00:00:00",
      endDate: "2026-04-07T23:59:59",
    },
    {
      id: "2",
      title: "Mini TO SNBT Episode 02",
      type: "Premium" as const,
      startDate: "2026-04-08T00:00:00",
      endDate: "2026-04-14T23:59:59",
    },
    {
      id: "3",
      title: "Mini TO SNBT Episode 03",
      type: "Gratis" as const,
      startDate: "2026-04-15T00:00:00",
      endDate: "2026-04-21T23:59:59",
    },
  ];

  const currentTryout = MOCK_DATA.find(item => item.id === tryoutId) || MOCK_DATA[0];

  const [statusText, setStatusText] = useState("Menghitung status...");
  const [statusColor, setStatusColor] = useState("bg-gray-100 text-gray-700");
  
  // Use mock phase 1 for this detail page example
  const phaseStart = new Date(currentTryout.startDate).getTime();
  const phaseEnd = new Date(currentTryout.endDate).getTime();

  const [isTPSOpen, setIsTPSOpen] = useState(true);
  const [isLiterasiOpen, setIsLiterasiOpen] = useState(true);

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  
  const { ticketCount, addTicket, deductTicket } = useTickets();

  // Gratis tryouts don't need tickets
  const isGratis = currentTryout.type === "Gratis";

  useEffect(() => {
    const updateStatus = () => {
      const now = new Date().getTime();
      
      if (now >= phaseStart && now <= phaseEnd) {
        setStatusText("Telah Dibuka!");
        setStatusColor("bg-[#83CC75] text-white");
      } else if (now < phaseStart) {
        setStatusText("Akan Datang");
        setStatusColor("bg-[#F59E0B] text-white");
      } else {
        setStatusText("Selesai");
        setStatusColor("bg-[#6B7280] text-white");
      }
    };

    updateStatus();
    const intervalId = setInterval(updateStatus, 1000);
    return () => clearInterval(intervalId);
  }, [phaseStart, phaseEnd]);

  const formatDate = (dateMs: number) => {
    const d = new Date(dateMs);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) + `, ${d.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;
  };

  const router = useRouter();

  const handleActionClick = () => {
    if (isGratis) return; // Should not reach here if UI is updated, but safe guard

    if (ticketCount > 0) {
      setIsConfirmOpen(true);
    } else {
      setIsAlertOpen(true);
    }
  };

  const confirmRegistration = () => {
    if (deductTicket(1)) {
      setIsConfirmOpen(false);
      // Immediately redirect to instruction page upon consuming ticket
      router.push(`/dashboard/try-out/${tryoutId}/start`);
    }
  };

  const buyTicketMock = () => {
    addTicket(1);
    setIsAlertOpen(false);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header Area */}
      <div className="flex items-center gap-2 mb-6">
        <Link href="/dashboard/try-out" className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">
          Detail Tryout
        </h1>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm relative">
        {/* Banner Image with overlaying Badges */}
        <div className="relative w-full h-[200px] md:h-[280px]">
          <Image
            src="/images/background/bg_detailto.png"
            alt="Detail Tryout Banner"
            fill
            className="object-cover"
            priority
          />
          {/* Badges on top-left of banner */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs px-4 py-1.5 rounded-full font-medium">
              UTBK
            </span>
            <span className="bg-white/30 backdrop-blur-md border border-white/40 text-white text-xs px-4 py-1.5 rounded-full font-medium">
              {currentTryout.type}
            </span>
          </div>
        </div>

        <div className="p-6 md:p-8 relative">
          {/* Info Header */}
          <div className="flex flex-col items-center text-center mt-2 space-y-3">
            <h2 className="text-xl font-bold text-[#2A3547]">
              {currentTryout.title}
            </h2>
            <p className="text-gray-600 text-sm">
              {formatDate(phaseStart)} - {formatDate(phaseEnd)}
            </p>

            <div className={`w-full max-w-2xl py-2.5 rounded-lg font-semibold text-sm ${statusColor}`}>
              {statusText}
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-[#004AAB] font-medium pt-2">
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>Total Waktu <span className="font-bold">195 menit</span></span>
              </div>
              <div className="w-[1px] h-4 bg-gray-300"></div>
              <div className="flex items-center gap-1.5">
                <FileText className="w-4 h-4" />
                <span>Total Soal <span className="font-bold">160 soal</span></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      {!isGratis && (
        <div className="bg-[#F4F6F9] rounded-xl p-4 flex items-center gap-3 text-sm text-gray-700">
          <div className="bg-[#2A3547] rounded-full p-1"><Info className="w-4 h-4 text-white flex-shrink-0" /></div>
          <p>Yuk, ikut tryout ini! Klik <strong className="font-semibold text-gray-900 border-b border-gray-400">Pakai Tiket</strong> di bawah untuk mulai.</p>
        </div>
      )}

      {/* Subjects Section: TPS */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsTPSOpen(!isTPSOpen)}
        >
          <h3 className="text-lg font-bold text-[#2A3547]">
            Tes Potensi Skolastik (TPS) (90 Soal, ≈ 90 Menit)
          </h3>
          {isTPSOpen ? <ChevronUp className="text-[#004AAB]" /> : <ChevronDown className="text-[#004AAB]" />}
        </div>
        
        {isTPSOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Penalaran Umum</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 30 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Pengetahuan dan Pemahaman Umum</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 20 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Pemahaman Bacaan dan Menulis</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 20 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Pengetahuan Kuantitatif</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 20 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
          </div>
        )}
      </div>

      {/* Subjects Section: Literasi */}
      <div className="space-y-4">
        <div 
          className="flex items-center justify-between cursor-pointer"
          onClick={() => setIsLiterasiOpen(!isLiterasiOpen)}
        >
          <h3 className="text-lg font-bold text-[#2A3547]">
            Tes Literasi (70 Soal, 105 Menit)
          </h3>
          {isLiterasiOpen ? <ChevronUp className="text-[#004AAB]" /> : <ChevronDown className="text-[#004AAB]" />}
        </div>
        
        {isLiterasiOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Literasi dalam Bahasa Indonesia</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 30 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Literasi dalam Bahasa Inggris</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 20 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-[#2A3547] mb-2">Penalaran Matematika</h4>
                <div className="flex items-center text-sm text-gray-500 gap-3">
                  <span className="flex items-center gap-1"><FileText className="w-4 h-4" /> 20 soal</span>
                </div>
              </div>
              <div className="bg-[#EAEFF4] p-2 rounded-full"><Lock className="w-4 h-4 text-[#004AAB]" /></div>
            </div>
          </div>
        )}
      </div>

      {/* Action Button Area */}
      <div className="pt-6 w-full flex justify-center">
        {isGratis ? (
          <Link href={`/dashboard/try-out/${tryoutId}/start`} className="block w-full">
            <button className="w-full bg-[#3B9245] hover:bg-[#317a3a] transition-colors text-white py-3.5 rounded-xl text-sm font-bold shadow-[0_4px_0_0_#2b6a32] active:shadow-none active:translate-y-1 text-center">
              Mulai Try Out
            </button>
          </Link>
        ) : (
          <button 
            onClick={handleActionClick}
            className="w-full bg-[#004AAB] hover:bg-[#003B8A] transition-colors text-white py-3.5 rounded-xl text-sm font-bold shadow-[0_4px_0_0_#002b66] active:shadow-none active:translate-y-1 text-center"
          >
            Pakai Tiket
          </button>
        )}
      </div>

      {/* Ticket Not Enough Modal */}
      <Dialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md text-center p-8 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 bg-[#FFF4E5] rounded-full flex items-center justify-center">
              <span className="text-3xl">⚠️</span>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mt-2">
              Maaf Tiket Kamu Tidak Cukup
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4 whitespace-pre-line px-4">
              Untuk mengikuti tryout ini kamu membutuhkan minimal 1 tiket.
              Silakan beli tiket terlebih dahulu agar dapat mendaftar.
            </DialogDescription>
            <div className="flex w-full gap-3 pt-2">
              <button 
                onClick={() => setIsAlertOpen(false)}
                className="flex-1 bg-[#F4F6F9] hover:bg-gray-200 text-[#004AAB] font-semibold py-3 rounded-xl transition-colors"
              >
                Kembali
              </button>
              <button 
                onClick={buyTicketMock}
                className="flex-1 bg-[#004AAB] hover:bg-[#003B8A] text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
              >
                Beli Tiket
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm Registration Modal */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent showCloseButton={false} className="sm:max-w-md text-center p-8 rounded-2xl">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 flex items-center justify-center mb-1">
              <span className="text-4xl">🚀</span>
            </div>
            <DialogTitle className="text-xl font-bold text-gray-900 mt-2">
              Yakin Ingin Mendaftar Tryout?
            </DialogTitle>
            <DialogDescription className="text-gray-600 mb-4">
              Tryout ini akan menggunakan 1 tiket dari akunmu.
            </DialogDescription>
            <div className="flex w-full gap-3 pt-2">
              <button 
                onClick={() => setIsConfirmOpen(false)}
                className="flex-1 bg-[#F4F6F9] hover:bg-gray-200 text-[#8492A6] font-semibold py-3 rounded-xl transition-colors"
              >
                Batal
              </button>
              <button 
                onClick={confirmRegistration}
                className="flex-1 bg-[#004AAB] hover:bg-[#003B8A] text-white font-semibold py-3 rounded-xl transition-colors shadow-sm"
              >
                Pakai Tiket
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}

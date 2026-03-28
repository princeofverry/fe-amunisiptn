"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronLeft, X, CheckCircle2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useGetDetailPackage } from "@/http/pembelian/get-detail-package";

export default function DetailPaketPage() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.access_token || "";

  const params = useParams();
  const idStr = params?.id as string;
  const pkgId = idStr ? parseInt(idStr, 10) : 1;
  
  const { data, isLoading } = useGetDetailPackage({ id: pkgId, token });
  const pkg = data?.data;

  const [dialogState, setDialogState] = useState<"none" | "summary" | "midtrans" | "success">("none");
  const [referral, setReferral] = useState("");

  if (isLoading || !pkg) {
    return <div className="p-10 text-center text-slate-500">Memuat detail paket...</div>;
  }

  const discountAmount = pkg.originalPrice - pkg.price;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 relative min-h-screen">
      {/* Header Area */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2 mb-1">
          <Link
            href="/dashboard/pembelian"
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Detail Paket</h1>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-white border border-slate-200 rounded-2xl w-full p-6 lg:p-8 flex flex-col gap-6 shadow-sm">
        
        {/* Title Box */}
        <div className="w-full bg-[#EBF4FF] text-[#004AAB] font-bold text-xl text-center py-4 rounded-xl">
          {pkg.title}
        </div>

        {/* Price and Details */}
        <div className="flex flex-col gap-6 border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-3">
              <span className="font-bold text-2xl text-[#004AAB]">
                Rp{pkg.price.toLocaleString("id-ID")}
              </span>
              <span className="text-sm font-medium text-slate-500 line-through">
                Rp{pkg.originalPrice.toLocaleString("id-ID")}
              </span>
            </div>
            <div className="bg-[#EBF4FF] text-[#004AAB] px-4 py-1.5 rounded-sm text-sm font-bold">
              Diskon {pkg.discount}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-slate-800 text-sm">Deskripsi:</h4>
            <p className="text-slate-600 text-sm leading-relaxed text-justify">
              {pkg.description}
            </p>
          </div>
        </div>

        <button 
          onClick={() => setDialogState("summary")}
          className="w-full py-3 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold rounded-lg transition-colors text-base shadow-sm mt-2"
        >
          Bayar
        </button>

      </div>

      {/* Modals/Dialogs Area */}

      {/* 1. Pembayaran Summary Dialog */}
      {dialogState === "summary" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="border-b border-gray-100 p-4 flex items-center justify-between">
              <h3 className="font-bold text-[#004AAB] text-lg">Pembayaran</h3>
              <button onClick={() => setDialogState("none")} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 flex flex-col gap-6">
              
              <div className="flex flex-col gap-2 border border-gray-100 rounded-xl p-4 text-sm bg-gray-50/50">
                <h4 className="font-bold text-gray-800 mb-2">Ringkasan Pembelian</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">{pkg.title}</span>
                  <span className="font-medium">Rp{pkg.originalPrice.toLocaleString("id-ID")}</span>
                </div>
                <div className="flex justify-between items-center text-red-500">
                  <span>Potongan Harga</span>
                  <span>-Rp{discountAmount.toLocaleString("id-ID")}</span>
                </div>
                <div className="w-full h-px bg-gray-200 my-2"></div>
                <div className="flex justify-between items-center font-bold text-black">
                  <span>Total Pembayaran</span>
                  <span>Rp{pkg.price.toLocaleString("id-ID")}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-bold text-gray-800 text-sm">Kode Referral</label>
                <input 
                  type="text" 
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="Masukkan Kode Referral (opsional)" 
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#004AAB]/30 focus:border-[#004AAB]"
                />
              </div>

              <button 
                onClick={() => setDialogState("midtrans")}
                className="w-full py-3 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold rounded-lg transition-colors mt-2"
              >
                Pilih Metode Pembayaran
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Mock Midtrans Dialog */}
      {dialogState === "midtrans" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col font-sans">
            {/* Midtrans Header */}
            <div className="bg-[#002f6c] text-white p-4 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-lg">Amunisi PTN</span>
                </div>
                <button onClick={() => setDialogState("none")} className="text-white/80 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="flex items-end justify-between">
                <div className="flex flex-col">
                  <span className="font-bold text-xl">Rp{pkg.price.toLocaleString("id-ID")}</span>
                  <span className="text-xs text-white/70">Order ID: #Amunisi-{pkg.id}-{Math.floor(Math.random() * 10000)}</span>
                </div>
                <span className="text-xs text-[#00aaff] cursor-pointer">Details ▼</span>
              </div>
            </div>

            {/* Methods */}
            <div className="bg-slate-50 border-b border-gray-200 py-2 px-4 text-center text-xs text-slate-500 font-medium">
              Choose within <span className="font-bold text-slate-700">00:29:59</span>
            </div>
            
            <div className="flex flex-col overflow-y-auto max-h-[400px] p-2 bg-white">
              <div className="p-3 text-xs font-bold text-gray-500 uppercase tracking-widest mt-2">All payment methods</div>
              
              {/* Payment Option Row */}
              <button 
                onClick={() => setDialogState("success")}
                className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-gray-100 text-left transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 text-sm">Virtual account</span>
                  <div className="flex gap-2">
                    <span className="w-6 h-4 bg-blue-600 rounded-sm inline-block"></span>
                    <span className="w-6 h-4 bg-orange-500 rounded-sm inline-block"></span>
                    <span className="w-6 h-4 bg-green-500 rounded-sm inline-block"></span>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button 
                onClick={() => setDialogState("success")}
                className="flex items-center justify-between p-4 hover:bg-slate-50 border-b border-gray-100 text-left transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 text-sm">QRIS</span>
                  <div className="flex gap-2">
                    <span className="text-[10px] font-bold text-red-600 border border-red-200 px-1 rounded">QRIS</span>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>

              <button 
                onClick={() => setDialogState("success")}
                className="flex items-center justify-between p-4 hover:bg-slate-50 text-left transition-colors"
              >
                <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800 text-sm">Credit/debit card</span>
                  <div className="flex gap-2">
                    <span className="w-6 h-4 bg-blue-800 rounded-sm inline-block"></span>
                    <span className="w-6 h-4 bg-red-500 rounded-sm inline-block"></span>
                  </div>
                </div>
                <span className="text-slate-400">›</span>
              </button>

            </div>
          </div>
        </div>
      )}

      {/* 3. Pembayaran Berhasil Dialog */}
      {dialogState === "success" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-in fade-in duration-200 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col items-center justify-center p-8 gap-4 text-center">
            
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>

            <h2 className="font-bold text-xl text-gray-900">Pembayaran Berhasil 🎉</h2>
            <p className="text-sm text-gray-500">
              Transaksi Anda telah berhasil. Detail pesanan dapat dilihat di halaman transaksi.
            </p>

            <button 
              onClick={() => {
                setDialogState("none");
                // In real app, might redirect to riwayat or tryout here
              }}
              className="w-full mt-4 py-3 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold rounded-lg transition-colors"
            >
              Tutup
            </button>
            
          </div>
        </div>
      )}

    </div>
  );
}

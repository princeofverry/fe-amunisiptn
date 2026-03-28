"use client";

import { useState } from "react";
import { ChevronLeft, History, Search } from "lucide-react";
import Link from "next/link";
import TryoutCard from "@/components/molecules/card/TryoutCard";
import { useSession } from "next-auth/react";
import { useGetUserTryouts } from "@/http/tryout/get-user-tryouts";

const FILTER_OPTIONS = [
  "Semua Tryout",
  "Tryout Premium",
  "Tryout Gratis",
  "Terdaftar",
];

export default function TryoutPage() {
  const { data: session } = useSession();
  const token = (session?.user as any)?.access_token || "";

  const [activeFilter, setActiveFilter] = useState("Semua Tryout");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: tryoutsData, isLoading } = useGetUserTryouts({ token });
  const tryouts = tryoutsData?.data || [];

  const filteredData = tryouts.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (activeFilter === "Semua Tryout" ||
        (activeFilter === "Tryout Premium" && item.type === "Premium") ||
        (activeFilter === "Tryout Gratis" && item.type === "Gratis") ||
        activeFilter === "Terdaftar") // for Terdaftar we'll just show all in this mock
  );

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        {/* Title and Subtitle */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <Link href="/dashboard" className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Daftar Tryout
            </h1>
          </div>
          <p className="text-gray-600 text-sm pl-9">
            Amunisian, tingkatkan skor tryoutmu dan persiapkan diri menghadapi
            ujian yang akan datang.
          </p>
        </div>

        {/* History Button */}
        <Link 
          href="/dashboard/try-out/riwayat"
          className="flex items-center gap-2 bg-[#3C8D60] hover:bg-[#327851] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-colors w-fit md:mt-0"
        >
          <History className="w-4 h-4" />
          <span>Riwayat TO</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="space-y-4 pt-2">
        {/* Search Bar */}
        <div className="relative w-full max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Mau tryout seperti apa?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#004AAB]/20 focus:border-[#004AAB] transition-all shadow-sm"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 md:gap-3">
          {FILTER_OPTIONS.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                activeFilter === filter
                  ? "bg-[#004AAB] text-white"
                  : "bg-[#EAEFF4] text-[#5A6A80] hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Tryout Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 pt-4">
        {filteredData.map((item) => (
          <TryoutCard
            key={item.id}
            id={item.id}
            title={item.title}
            type={item.type}
            startDate={item.startDate}
            endDate={item.endDate}
          />
        ))}
      </div>
      
      {filteredData.length === 0 && (
        <div className="w-full py-12 flex flex-col items-center justify-center text-gray-500">
          <p>Tidak ada tryout yang ditemukan.</p>
        </div>
      )}
    </div>
  );
}

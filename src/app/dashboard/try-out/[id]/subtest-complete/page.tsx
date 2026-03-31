"use client";

import { use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const SUBTESTS = [
  { id: "s1", name: "Penalaran Umum", duration: 30, questions: 30 },
  { id: "s2", name: "Pengetahuan & Pemahaman Umum", duration: 20, questions: 20 },
  { id: "s3", name: "Pemahaman Bacaan & Menulis", duration: 20, questions: 20 },
  { id: "s4", name: "Pengetahuan Kuantitatif", duration: 20, questions: 20 },
  { id: "s5", name: "Literasi Bahasa Indonesia", duration: 30, questions: 30 },
  { id: "s6", name: "Literasi Bahasa Inggris", duration: 25, questions: 20 },
  { id: "s7", name: "Penalaran Matematika", duration: 30, questions: 20 },
];

function SubtestCompleteContent({ tryoutId }: { tryoutId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentIdx = parseInt(searchParams.get("current") || "0");
  const nextIdx = parseInt(searchParams.get("next") || "1");
  const totalSubtests = parseInt(searchParams.get("total") || String(SUBTESTS.length));

  const completedSubtest = SUBTESTS[currentIdx] || SUBTESTS[0];
  const nextSubtest = nextIdx < SUBTESTS.length ? SUBTESTS[nextIdx] : null;
  const isLastSubtest = nextIdx >= totalSubtests;

  const handleStartNext = () => {
    // Navigate to exam page with the NEXT subtest index
    router.push(`/dashboard/try-out/${tryoutId}/exam?subtest=${nextIdx}`);
  };

  const handleFinishTryout = () => {
    router.push(`/dashboard/try-out/${tryoutId}/tryout-complete`);
  };

  return (
    <div className="w-full max-w-3xl mx-auto animate-in fade-in duration-500 py-12 px-4">
      {/* Success Banner */}
      <div className="bg-gradient-to-r from-[#3B9245] to-[#4CAF50] rounded-2xl p-8 text-center text-white mb-8 shadow-lg">
        <h1 className="text-2xl font-bold mb-2">
          Subtest {completedSubtest.name} Selesai
        </h1>
        <p className="text-white/80 text-sm">
          {isLastSubtest
            ? "Semua subtest telah selesai dikerjakan."
            : "Selanjutnya kamu akan mengerjakan subtest berikutnya."}
        </p>
      </div>

      {!isLastSubtest && nextSubtest ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-6">
          <h2 className="text-xl font-bold text-[#004AAB]">{nextSubtest.name}</h2>

          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">📝</span>
              <span>Jumlah Soal : <strong>{nextSubtest.questions} Soal</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">⏱️</span>
              <span>Waktu : <strong>{nextSubtest.duration} menit</strong></span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            Subtest {nextIdx + 1} dari {totalSubtests}
          </div>

          <button
            onClick={handleStartNext}
            className="w-full py-4 bg-[#004AAB] hover:bg-[#003B8A] text-white font-bold text-base rounded-xl transition-colors shadow-[0_4px_0_0_#002B66] active:shadow-none active:translate-y-1"
          >
            Mulai Subtest Berikutnya
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
            <span className="text-3xl">🎉</span>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Semua Subtest Selesai!</h2>
          <p className="text-gray-600 text-sm">
            Kamu telah menyelesaikan seluruh subtest. Submit dan lihat hasilnya sekarang!
          </p>
          <button
            onClick={handleFinishTryout}
            className="w-full py-4 bg-[#3B9245] hover:bg-[#317A3A] text-white font-bold text-base rounded-xl transition-colors"
          >
            Submit & Akhiri Try Out
          </button>
        </div>
      )}
    </div>
  );
}

export default function SubtestCompletePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004AAB]" /></div>}>
      <SubtestCompleteContent tryoutId={tryoutId} />
    </Suspense>
  );
}

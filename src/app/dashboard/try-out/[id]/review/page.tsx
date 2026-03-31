"use client";

import { use, useState } from "react";
import Link from "next/link";
import { ChevronLeft, CheckCircle2, XCircle, MinusCircle, MessageSquareText } from "lucide-react";
import { useSession } from "next-auth/react";
import { useGetTryoutReview } from "@/http/tryout/get-tryout-review";
import type { ReviewQuestion } from "@/types/exam/exam";

export default function ReviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);
  const { data: session } = useSession();
  const token = (session?.user as any)?.access_token || "";
  const [selectedSubtest, setSelectedSubtest] = useState<string>("all");

  const { data: beReview, isLoading } = useGetTryoutReview({
    tryoutId,
    token,
  });

  const reviewItems = beReview?.data?.review || [];

  // Group subtests
  const subtestNames = Array.from(new Set(reviewItems.map((r) => r.subtest.name)));
  const filteredItems = selectedSubtest === "all" ? reviewItems : reviewItems.filter((r) => r.subtest.name === selectedSubtest);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004AAB]" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <Link href={`/dashboard/try-out/${tryoutId}/result`} className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-800">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-gray-900">Pembahasan Soal</h1>
      </div>

      {/* Subtest Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 scrollbar-hide">
        <button
          onClick={() => setSelectedSubtest("all")}
          className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedSubtest === "all"
              ? "bg-[#004AAB] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Semua ({reviewItems.length})
        </button>
        {subtestNames.map((name) => (
          <button
            key={name}
            onClick={() => setSelectedSubtest(name)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedSubtest === name
                ? "bg-[#004AAB] text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {name} ({reviewItems.filter((r) => r.subtest.name === name).length})
          </button>
        ))}
      </div>

      {/* Questions */}
      <div className="space-y-6">
        {filteredItems.map((item, idx) => (
          <ReviewCard key={item.question_id} item={item} index={idx + 1} />
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <p>Tidak ada soal untuk ditampilkan.</p>
        </div>
      )}
    </div>
  );
}

function ReviewCard({ item, index }: { item: ReviewQuestion; index: number }) {
  const [showDiscussion, setShowDiscussion] = useState(false);
  const correctAnswer = item.question.correct_answer;
  const myAnswer = item.my_answer;
  const isCorrect = item.is_correct;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Question Header */}
      <div className="flex items-center justify-between px-6 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500">Soal {index}</span>
          <span className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full">{item.subtest.name}</span>
        </div>
        <div className="flex items-center gap-1.5">
          {isCorrect === true && <CheckCircle2 className="w-5 h-5 text-green-500" />}
          {isCorrect === false && <XCircle className="w-5 h-5 text-red-500" />}
          {isCorrect === null && <MinusCircle className="w-5 h-5 text-gray-400" />}
          <span className={`text-sm font-semibold ${isCorrect === true ? "text-green-600" : isCorrect === false ? "text-red-600" : "text-gray-400"}`}>
            {isCorrect === true ? "Benar" : isCorrect === false ? "Salah" : "Tidak Dijawab"}
          </span>
        </div>
      </div>

      {/* Question Content */}
      <div className="p-6">
        {item.question.question_image_url && (
          <div className="mb-4">
            <img src={item.question.question_image_url} alt="Soal" className="max-h-[200px] w-auto object-contain rounded-lg" />
          </div>
        )}

        <div className="text-gray-800 text-sm leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: item.question.question_text }} />

        {/* Options */}
        <div className="flex flex-col gap-2 mb-4">
          {item.question.options.map((option) => {
            const isMyAnswer = myAnswer === option.option_key;
            const isCorrectAnswer = correctAnswer === option.option_key;

            let optionClass = "border-gray-200 bg-white";
            if (isCorrectAnswer) optionClass = "border-green-400 bg-green-50";
            if (isMyAnswer && !isCorrect) optionClass = "border-red-400 bg-red-50";

            return (
              <div
                key={option.id}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 ${optionClass}`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  isCorrectAnswer ? "bg-green-500 text-white" : isMyAnswer && !isCorrect ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
                }`}>
                  {option.option_key}
                </div>
                <span className={`text-sm ${isCorrectAnswer ? "text-green-700 font-semibold" : isMyAnswer && !isCorrect ? "text-red-700" : "text-gray-700"}`}>
                  {option.option_text}
                </span>
                {isCorrectAnswer && <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto flex-shrink-0" />}
                {isMyAnswer && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto flex-shrink-0" />}
              </div>
            );
          })}
        </div>

        {/* Discussion Toggle */}
        {item.question.discussion && (
          <div>
            <button
              onClick={() => setShowDiscussion(!showDiscussion)}
              className="flex items-center gap-2 text-sm font-semibold text-[#004AAB] hover:text-[#003B8A] transition-colors"
            >
              <MessageSquareText className="w-4 h-4" />
              <span>{showDiscussion ? "Sembunyikan Pembahasan" : "Lihat Pembahasan"}</span>
            </button>

            {showDiscussion && (
              <div className="mt-3 p-4 bg-blue-50 border border-blue-100 rounded-xl animate-in slide-in-from-top-2 duration-200">
                <p className="text-sm text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: item.question.discussion }} />
                {item.question.discussion_image_url && (
                  <img src={item.question.discussion_image_url} alt="Pembahasan" className="max-h-[200px] mt-3 rounded-lg" />
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

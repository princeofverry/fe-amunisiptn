"use client";

import Image from "next/image";
import type { ExamQuestion } from "@/types/exam/exam";

interface QuestionViewProps {
  question: ExamQuestion;
  selectedAnswer: string | null;
  onSelectAnswer: (answer: string | null) => void;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
}

export default function QuestionView({
  question,
  selectedAnswer,
  onSelectAnswer,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: QuestionViewProps) {
  const handleOptionClick = (optionKey: string) => {
    // Toggle: if already selected, deselect
    if (selectedAnswer === optionKey) {
      onSelectAnswer(null);
    } else {
      onSelectAnswer(optionKey);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Question Content */}
      <div className="flex-1 p-6 lg:p-8 overflow-y-auto">
        {/* Question Image */}
        {question.question_image_url && (
          <div className="mb-6 flex justify-center">
            <div className="relative max-w-full max-h-[300px] w-auto">
              <img
                src={question.question_image_url}
                alt="Soal"
                className="max-h-[300px] w-auto object-contain rounded-lg"
              />
            </div>
          </div>
        )}

        {/* Question Text */}
        <div
          className="text-gray-800 text-[15px] leading-relaxed mb-6 font-medium"
          dangerouslySetInnerHTML={{ __html: question.question_text }}
        />

        {/* Options */}
        <div className="flex flex-col gap-3">
          {question.options.map((option) => {
            const isSelected = selectedAnswer === option.option_key;

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.option_key)}
                className={`w-full flex items-start gap-4 p-4 rounded-xl border-2 text-left transition-all ${
                  isSelected
                    ? "border-[#004AAB] bg-[#EBF4FF]"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-colors ${
                    isSelected
                      ? "bg-[#004AAB] text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {option.option_key}
                </div>
                <span className={`text-sm pt-2 ${isSelected ? "text-[#004AAB] font-semibold" : "text-gray-700"}`}>
                  {option.option_text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-100 px-6 lg:px-8 py-4 flex items-center justify-between">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            hasPrev ? "text-gray-600 hover:text-gray-900" : "text-gray-300 cursor-not-allowed"
          }`}
        >
          <span>‹</span>
          <span>Sebelumnya</span>
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-bold transition-colors ${
            hasNext
              ? "bg-[#004AAB] hover:bg-[#003B8A] text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}
        >
          <span>Selanjutnya</span>
          <span>›</span>
        </button>
      </div>
    </div>
  );
}

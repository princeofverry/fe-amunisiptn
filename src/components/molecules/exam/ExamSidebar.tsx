"use client";

interface ExamSidebarProps {
  subtestName: string;
  totalQuestions: number;
  currentIndex: number;
  answeredQuestions: Set<string>; // question IDs that have answers
  questionIds: string[];
  onQuestionClick: (index: number) => void;
  onFinishSubtest: () => void;
}

export default function ExamSidebar({
  subtestName,
  totalQuestions,
  currentIndex,
  answeredQuestions,
  questionIds,
  onQuestionClick,
  onFinishSubtest,
}: ExamSidebarProps) {
  return (
    <div className="w-full lg:w-[260px] flex-shrink-0 flex flex-col gap-4">
      {/* Subtest Name */}
      <div className="bg-[#002B66] text-white rounded-xl p-4 text-center">
        <p className="text-sm font-medium opacity-80">Subtest:</p>
        <h3 className="font-bold text-base">{subtestName}</h3>
      </div>

      {/* Question Grid */}
      <div className="border-2 border-[#004AAB]/20 rounded-xl p-4">
        <h4 className="font-bold text-sm text-gray-800 mb-3 text-center">Daftar Soal:</h4>
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: totalQuestions }, (_, i) => {
            const qId = questionIds[i];
            const isActive = i === currentIndex;
            const isAnswered = qId && answeredQuestions.has(qId);

            return (
              <button
                key={i}
                onClick={() => onQuestionClick(i)}
                className={`w-full aspect-square rounded-lg text-sm font-bold transition-all flex items-center justify-center ${
                  isActive
                    ? "bg-[#004AAB] text-white ring-2 ring-[#004AAB] ring-offset-2"
                    : isAnswered
                    ? "bg-[#3B9245] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish Subtest Button */}
      <button
        onClick={onFinishSubtest}
        className="w-full bg-[#004AAB] hover:bg-[#003B8A] text-white py-3 rounded-xl font-bold text-sm transition-colors"
      >
        Akhiri Subtest
      </button>
    </div>
  );
}

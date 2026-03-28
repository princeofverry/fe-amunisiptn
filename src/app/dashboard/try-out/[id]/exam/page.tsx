"use client";

import { useState, useEffect, use, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { X } from "lucide-react";
import ExamTimer from "@/components/molecules/exam/ExamTimer";
import ExamSidebar from "@/components/molecules/exam/ExamSidebar";
import QuestionView from "@/components/molecules/exam/QuestionView";
import DialogFinishSubtest from "@/components/molecules/dialog/DialogFinishSubtest";
import { useDataMode } from "@/components/providers/DataModeProvider";
import { useSubmitAnswer } from "@/http/tryout/submit-answer";
import { useFinishSubtest } from "@/http/tryout/finish-subtest";
import { useStartSubtest } from "@/http/tryout/start-subtest";
import { useGetExamQuestions } from "@/http/tryout/get-exam-questions";
import type { ExamQuestion } from "@/types/exam/exam";

// --- Mock subtests ---
const MOCK_SUBTESTS = [
  { id: "s1", name: "Penalaran Umum", category: "Tes Potensi Skolastik", duration: 30, questionCount: 30 },
  { id: "s2", name: "Pengetahuan & Pemahaman Umum", category: "Tes Potensi Skolastik", duration: 20, questionCount: 20 },
  { id: "s3", name: "Pemahaman Bacaan & Menulis", category: "Tes Potensi Skolastik", duration: 20, questionCount: 20 },
  { id: "s4", name: "Pengetahuan Kuantitatif", category: "Tes Potensi Skolastik", duration: 20, questionCount: 20 },
  { id: "s5", name: "Literasi Bahasa Indonesia", category: "Tes Literasi", duration: 30, questionCount: 30 },
  { id: "s6", name: "Literasi Bahasa Inggris", category: "Tes Literasi", duration: 25, questionCount: 20 },
  { id: "s7", name: "Penalaran Matematika", category: "Tes Literasi", duration: 30, questionCount: 20 },
];

function generateMockQuestions(subtestIndex: number, count: number): ExamQuestion[] {
  const subtest = MOCK_SUBTESTS[subtestIndex];
  return Array.from({ length: count }, (_, i) => ({
    id: `q-${subtestIndex}-${i + 1}`,
    question_text: `[${subtest?.name || 'Subtest'}] Soal nomor ${i + 1}: Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pilih jawaban yang paling tepat.`,
    question_image: null,
    question_image_url: null,
    order_no: i + 1,
    options: [
      { id: `o-${subtestIndex}-${i}-a`, option_key: "A", option_text: `Pilihan A` },
      { id: `o-${subtestIndex}-${i}-b`, option_key: "B", option_text: `Pilihan B` },
      { id: `o-${subtestIndex}-${i}-c`, option_key: "C", option_text: `Pilihan C` },
      { id: `o-${subtestIndex}-${i}-d`, option_key: "D", option_text: `Pilihan D` },
      { id: `o-${subtestIndex}-${i}-e`, option_key: "E", option_text: `Pilihan E` },
    ],
    my_answer: null,
  }));
}

function ExamContent({ tryoutId }: { tryoutId: string }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const token = (session?.user as any)?.access_token || "";
  const { mode } = useDataMode();

  // Read subtest index from query param
  const subtestParam = parseInt(searchParams.get("subtest") || "0", 10);

  // State
  const [currentSubtestIndex] = useState(subtestParam);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [showFinishDialog, setShowFinishDialog] = useState(false);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [timerSeconds, setTimerSeconds] = useState(0);

  // In dummy mode use mock subtests, in BE mode will use real subtests
  // For now, both use same subtests list (real BE subtests would come from tryout data)
  const subtests = MOCK_SUBTESTS;
  const currentSubtest = subtests[currentSubtestIndex];
  const totalSubtests = subtests.length;

  // --- Backend: Start subtest & fetch questions ---
  const startSubtestMutation = useStartSubtest({
    token,
    options: {
      onSuccess: (data) => {
        // Timer from BE
        setTimerSeconds(data.data.remaining_seconds);
      },
      onError: (error: any) => {
        console.error("Failed to start subtest:", error);
        // Fallback to mock duration
        setTimerSeconds((currentSubtest?.duration || 30) * 60);
      },
    },
  });

  // Backend: fetch exam questions
  const { data: examData, refetch: refetchExam } = useGetExamQuestions({
    tryoutId,
    subtestId: currentSubtest?.id || "",
    token,
    options: {
      enabled: false, // Manual trigger
    },
  });

  // --- INIT: Load questions based on mode ---
  useEffect(() => {
    setIsLoading(true);
    setCurrentQuestionIndex(0);
    setAnswers({});

    if (mode === "dummy") {
      // === DUMMY MODE ===
      const qs = generateMockQuestions(currentSubtestIndex, currentSubtest?.questionCount || 20);
      setQuestions(qs);
      setTimerSeconds((currentSubtest?.duration || 30) * 60);

      // Load saved answers for this subtest
      const saved = localStorage.getItem(`exam_answers_${tryoutId}_${currentSubtestIndex}`);
      if (saved) {
        try { setAnswers(JSON.parse(saved)); } catch { /* ignore */ }
      }
      setIsLoading(false);
    } else {
      // === BACKEND MODE ===
      // Step 1: Start the subtest session (to get timer)
      startSubtestMutation.mutate(
        { tryoutId, subtestId: currentSubtest?.id || "" },
        {
          onSuccess: () => {
            // Step 2: Fetch exam questions
            refetchExam().then((result) => {
              if (result.data?.data?.questions) {
                setQuestions(result.data.data.questions);
                // Pre-fill answers from BE (my_answer field)
                const preAnswers: Record<string, string | null> = {};
                result.data.data.questions.forEach((q) => {
                  if (q.my_answer) preAnswers[q.id] = q.my_answer;
                });
                setAnswers(preAnswers);

                // Use timer from BE data if available
                if (result.data.data.timer) {
                  setTimerSeconds(result.data.data.timer.remaining_seconds);
                }
              }
              setIsLoading(false);
            }).catch(() => {
              // Fallback to mock if API fails
              const qs = generateMockQuestions(currentSubtestIndex, currentSubtest?.questionCount || 20);
              setQuestions(qs);
              setTimerSeconds((currentSubtest?.duration || 30) * 60);
              setIsLoading(false);
            });
          },
          onError: () => {
            // Fallback: still try to fetch questions (maybe subtest was already started)
            refetchExam().then((result) => {
              if (result.data?.data?.questions) {
                setQuestions(result.data.data.questions);
                const preAnswers: Record<string, string | null> = {};
                result.data.data.questions.forEach((q) => {
                  if (q.my_answer) preAnswers[q.id] = q.my_answer;
                });
                setAnswers(preAnswers);
                if (result.data.data.timer) {
                  setTimerSeconds(result.data.data.timer.remaining_seconds);
                }
              } else {
                // Final fallback to mock
                const qs = generateMockQuestions(currentSubtestIndex, currentSubtest?.questionCount || 20);
                setQuestions(qs);
                setTimerSeconds((currentSubtest?.duration || 30) * 60);
              }
              setIsLoading(false);
            }).catch(() => {
              const qs = generateMockQuestions(currentSubtestIndex, currentSubtest?.questionCount || 20);
              setQuestions(qs);
              setTimerSeconds((currentSubtest?.duration || 30) * 60);
              setIsLoading(false);
            });
          },
        }
      );
    }
  }, [currentSubtestIndex, tryoutId, mode]);

  // Save answers to localStorage in dummy mode
  useEffect(() => {
    if (mode === "dummy" && Object.keys(answers).length > 0) {
      localStorage.setItem(`exam_answers_${tryoutId}_${currentSubtestIndex}`, JSON.stringify(answers));
    }
  }, [answers, mode, tryoutId, currentSubtestIndex]);

  // --- Mutations ---
  const submitAnswerMutation = useSubmitAnswer({
    token,
    options: { onError: (error: any) => console.error("Failed to submit answer:", error) },
  });

  const finishSubtestMutation = useFinishSubtest({
    token,
    options: { onSuccess: () => navigateAfterSubtest() },
  });

  // --- Derived state ---
  const currentQuestion = questions[currentQuestionIndex];
  const answeredQuestions = new Set(
    Object.entries(answers).filter(([_, v]) => v !== null).map(([k]) => k)
  );
  const unansweredCount = questions.length - answeredQuestions.size;

  // --- Handlers (IDENTICAL for both modes except API calls) ---
  const handleSelectAnswer = useCallback((answer: string | null) => {
    if (!currentQuestion) return;
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));

    // In backend mode, also submit to API
    if (mode === "backend" && currentSubtest) {
      submitAnswerMutation.mutate({
        tryoutId,
        subtestId: currentSubtest.id,
        questionId: currentQuestion.id,
        answer,
      });
    }
  }, [currentQuestion, mode, currentSubtest, tryoutId]);

  const navigateAfterSubtest = () => {
    const nextIndex = currentSubtestIndex + 1;
    if (nextIndex < totalSubtests) {
      router.push(`/dashboard/try-out/${tryoutId}/subtest-complete?current=${currentSubtestIndex}&next=${nextIndex}&total=${totalSubtests}`);
    } else {
      router.push(`/dashboard/try-out/${tryoutId}/tryout-complete`);
    }
  };

  const handleTimeUp = useCallback(() => {
    // Same for both modes: finish subtest, then navigate
    if (mode === "backend" && currentSubtest) {
      finishSubtestMutation.mutate({ tryoutId, subtestId: currentSubtest.id });
    } else {
      navigateAfterSubtest();
    }
  }, [mode, currentSubtest, tryoutId, currentSubtestIndex, totalSubtests]);

  const handleFinishSubtest = () => {
    setShowFinishDialog(true);
  };

  const confirmFinishSubtest = () => {
    setShowFinishDialog(false);
    // Same for both modes: finish subtest, then navigate
    if (mode === "backend" && currentSubtest) {
      finishSubtestMutation.mutate({ tryoutId, subtestId: currentSubtest.id });
    } else {
      navigateAfterSubtest();
    }
  };

  const handleExitExam = () => {
    if (confirm("Yakin ingin keluar? Progress kamu akan tersimpan.")) {
      router.push(`/dashboard/try-out/${tryoutId}`);
    }
  };

  // --- Render ---
  if (isLoading || !currentQuestion || !currentSubtest) {
    return (
      <div className="fixed inset-0 z-40 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004AAB] mx-auto mb-4"></div>
          <p className="text-gray-500 text-sm">Memuat soal subtest...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-40 bg-white flex flex-col">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-4 md:px-6 py-3 border-b border-gray-200 bg-white">
        <button onClick={handleExitExam} className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors">
          <X className="w-5 h-5" />
          <span className="font-bold text-sm hidden sm:inline">Judul Try Out</span>
        </button>
        <div className="text-center">
          <p className="text-xs text-gray-500">Nomor Soal</p>
          <p className="font-bold text-lg text-gray-900">{currentQuestionIndex + 1}</p>
        </div>
        <ExamTimer
          remainingSeconds={timerSeconds}
          onTimeUp={handleTimeUp}
        />
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Sidebar */}
        <div className="lg:border-r lg:border-gray-100 p-4 lg:overflow-y-auto bg-gray-50/50">
          <ExamSidebar
            subtestName={`${currentSubtest.category}:\n${currentSubtest.name}`}
            totalQuestions={questions.length}
            currentIndex={currentQuestionIndex}
            answeredQuestions={answeredQuestions}
            questionIds={questions.map((q) => q.id)}
            onQuestionClick={(i) => setCurrentQuestionIndex(i)}
            onFinishSubtest={handleFinishSubtest}
          />
        </div>

        {/* Question Area */}
        <QuestionView
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id] ?? currentQuestion.my_answer}
          onSelectAnswer={handleSelectAnswer}
          onPrev={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
          onNext={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
          hasPrev={currentQuestionIndex > 0}
          hasNext={currentQuestionIndex < questions.length - 1}
        />
      </div>

      {/* Finish Subtest Dialog */}
      <DialogFinishSubtest
        open={showFinishDialog}
        onOpenChange={setShowFinishDialog}
        unansweredCount={unansweredCount}
        onConfirm={confirmFinishSubtest}
      />
    </div>
  );
}

export default function ExamPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tryoutId } = use(params);

  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#004AAB]" /></div>}>
      <ExamContent tryoutId={tryoutId} />
    </Suspense>
  );
}

// Exam question types from BE
export interface ExamOption {
  id: string;
  option_key: string; // A, B, C, D, E
  option_text: string;
}

export interface ExamQuestion {
  id: string;
  question_text: string;
  question_image: string | null;
  question_image_url: string | null;
  order_no: number;
  options: ExamOption[];
  my_answer: string | null; // A, B, C, D, E or null
}

export interface ExamTimerData {
  started_at: string;
  end_time: string;
  remaining_seconds: number;
  status: "in_progress" | "finished" | "expired";
}

export interface ExamData {
  tryout: {
    id: string;
    title: string;
  };
  subtest: {
    id: string;
    name: string;
    duration_minutes: number;
  };
  timer: ExamTimerData;
  questions: ExamQuestion[];
}

// Result types
export interface TryoutResultData {
  tryout_id: string;
  tryout_title: string;
  status: string;
  started_at: string | null;
  finished_at: string | null;
  summary: {
    total_questions: number;
    answered: number;
    correct: number;
    wrong: number;
    unanswered: number;
  };
  irt_result: {
    is_ready: boolean;
    release_date: string | null;
    total_participants_calculated: number;
    raw_score: number;
    final_score: number;
  };
}

// Review types
export interface ReviewQuestion {
  question_id: string;
  subtest: {
    id: string;
    name: string;
  };
  question: {
    id: string;
    question_text: string;
    question_image: string | null;
    question_image_url: string | null;
    discussion: string | null;
    discussion_image: string | null;
    discussion_image_url: string | null;
    correct_answer: string;
    options: ExamOption[];
  };
  my_answer: string | null;
  is_correct: boolean | null;
}

export interface ReviewData {
  tryout_id: string;
  tryout_title: string;
  review: ReviewQuestion[];
}

// Session types
export interface TryoutSession {
  id: string;
  user_id: string;
  tryout_id: string;
  started_at: string;
  finished_at: string | null;
  status: "not_started" | "in_progress" | "finished";
}

export interface SubtestSession {
  id: string;
  tryout_session_id: string;
  tryout_subtest_id: string;
  started_at: string;
  finished_at: string | null;
  status: "in_progress" | "finished" | "expired";
}

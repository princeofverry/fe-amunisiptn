export interface QuestionBankOption {
  id: string;
  option_key: string;
  option_text: string;
}

export interface QuestionBank {
  id: string;
  subtest_id: string;
  question_text: string;
  question_image?: string | null;
  question_image_url?: string | null;
  discussion: string;
  discussion_image?: string | null;
  discussion_image_url?: string | null;
  correct_answer: string;
  difficulty: string;
  is_active: boolean;
  options: QuestionBankOption[];
  created_at: Date;
  updated_at: Date;
}

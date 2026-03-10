"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import { useGetDetailQuestionBank } from "@/http/question-bank/get-detail-question-bank";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface DashboardAdminQuestionBankDetailWrapperProps {
  id: string;
}

export default function DashboardAdminQuestionBankDetailWrapper({
  id,
}: DashboardAdminQuestionBankDetailWrapperProps) {
  const { data: session, status } = useSession();

  const { data, isPending } = useGetDetailQuestionBank({
    id,
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const question = data?.data;

  const difficultyLabel = {
    easy: "Mudah",
    medium: "Sedang",
    hard: "Sulit",
  };

  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  };

  if (isPending) {
    return (
      <section>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>

          <CardContent className="space-y-6">
            <Skeleton className="h-6 w-64" />

            <Skeleton className="h-24 w-full" />

            <Skeleton className="h-64 w-full" />

            <div className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>

            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </section>
    );
  }

  if (!question) {
    return <p>Soal tidak ditemukan</p>;
  }

  const sortedOptions = [...question.options].sort((a, b) =>
    a.option_key.localeCompare(b.option_key),
  );

  return (
    <section>
      <Card>
        <CardContent className="space-y-8">
          <div className="flex flex-wrap gap-3 items-center">
            <Badge variant="secondary">{question.subtest.name}</Badge>

            <Badge
              className={
                difficultyColor[
                  question.difficulty as keyof typeof difficultyColor
                ]
              }
            >
              {
                difficultyLabel[
                  question.difficulty as keyof typeof difficultyLabel
                ]
              }
            </Badge>

            <Badge variant={question.is_active ? "default" : "destructive"}>
              {question.is_active ? "Aktif" : "Nonaktif"}
            </Badge>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Soal</h3>

            <p className="leading-relaxed">{question.question_text}</p>

            {question.question_image_url && (
              <Image
                src={question.question_image_url}
                alt="Question"
                className="rounded-md border max-h-96 object-contain"
                width={600}
                height={400}
              />
            )}
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Pilihan Jawaban</h3>

            <div className="space-y-3">
              {sortedOptions.map((option) => {
                const isCorrect = option.option_key === question.correct_answer;

                return (
                  <div
                    key={option.id}
                    className={`p-4 rounded-lg border flex items-start gap-4 transition ${
                      isCorrect
                        ? "border-green-500 bg-green-50"
                        : "border-muted hover:bg-muted/30"
                    }`}
                  >
                    <div className="font-semibold">{option.option_key}.</div>

                    <div className="flex-1">{option.option_text}</div>

                    {isCorrect && (
                      <Badge className="bg-green-600">Jawaban Benar</Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Pembahasan</h3>

            <p className="leading-relaxed">{question.discussion}</p>

            {question.discussion_image_url && (
              <Image
                src={question.discussion_image_url}
                alt="Discussion"
                className="rounded-md border max-h-96 object-contain"
                width={600}
                height={400}
              />
            )}
          </div>

          <div className="text-sm text-muted-foreground border-t pt-4">
            Dibuat oleh <strong>{question.creator.name}</strong>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}

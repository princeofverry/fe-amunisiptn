"use client";

import AlertDialogDeleteQuestion from "@/components/atoms/alert-dialog/question/AlertDialogDeleteQuestion";
import { questionColumns } from "@/components/atoms/datacolumn/DataQuestion";
import { questionSubtestTryoutColumns } from "@/components/atoms/datacolumn/DataQuestionSubtestTryout";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteQuestion } from "@/http/questions/delete-question";
import { useGetAllQuestionBySubtest } from "@/http/questions/get-all-question-by-subtest";
import { Question } from "@/types/questions/question";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardAdminQuestionSubtestTryoutProps {
  tryoutId: string;
  subtestId: string;
}

export default function DashboardAdminQuestionSubtestTryoutWrapper({
  tryoutId,
  subtestId,
}: DashboardAdminQuestionSubtestTryoutProps) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [isDialogDeleteOpen, setIsDialogDeleteOpen] = useState(false);
  const [isSelectedDeleteQuestion, setIsSelectedDeleteQuestion] =
    useState<Question | null>(null);

  const deleteQuestionHandler = (data: Question) => {
    setIsSelectedDeleteQuestion(data);
    setIsDialogDeleteOpen(true);
  };

  const { data: question, isPending: isPendingQuestion } =
    useGetAllQuestionBySubtest({
      id: subtestId,
      token: session?.access_token as string,
      options: {
        enabled: status === "authenticated",
      },
    });

  const { mutate: deleteQuestion } = useDeleteQuestion({
    onError: (error) => {
      toast.error("Gagal menghapus soal!", {
        description:
          error.response?.data.message ||
          "Terjadi kesalahan saat menghapus soal.",
      });
    },
    onSuccess: () => {
      setIsSelectedDeleteQuestion(null);
      toast.success("Berhasil menghapus soal!");
      queryClient.invalidateQueries({
        queryKey: ["get-all-question-by-subtest", subtestId],
      });
    },
  });

  const handleDeleteQuestion = () => {
    if (isSelectedDeleteQuestion) {
      deleteQuestion({
        id: isSelectedDeleteQuestion.id,
        subtestId: subtestId,
        token: session?.access_token as string,
      });
    }
  };
  return (
    <section>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-6">
              <Input
                placeholder="Cari berdasarkan pertanyaan..."
                className="max-w-xs w-full"
              />
            </div>
            <DataTable
              columns={questionColumns({
                deleteQuestionHandler,
              })}
              data={question?.data ?? []}
              isLoading={isPendingQuestion}
            />
          </div>
        </CardContent>
      </Card>

      {isSelectedDeleteQuestion && (
        <AlertDialogDeleteQuestion
          open={isDialogDeleteOpen}
          setOpen={setIsDialogDeleteOpen}
          confirmDelete={handleDeleteQuestion}
        />
      )}
    </section>
  );
}

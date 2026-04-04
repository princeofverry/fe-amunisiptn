"use client";

import AlertDialogDeleteQuestion from "@/components/atoms/alert-dialog/question/AlertDialogDeleteQuestion";
import { questionColumns } from "@/components/atoms/datacolumn/DataQuestion";
import DashboardTitle from "@/components/atoms/typography/DashboardTitle";
import { DataTable } from "@/components/molecules/datatable/DataTable";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useDeleteQuestion } from "@/http/questions/delete-question";
import { useGetAllQuestionBySubtest } from "@/http/questions/get-all-question-by-subtest";
import { useGetDetailSubtest } from "@/http/subtest/get-detail-subtest";
import { Question } from "@/types/questions/question";
import { useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface DashboardadminSubtestDetailWrapperProps {
  id: string;
}

export default function DashboardadminSubtestDetailWrapper({
  id,
}: DashboardadminSubtestDetailWrapperProps) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const [isOpenDialogDelete, setIsOpenDialogDelete] = useState(false);
  const [isSelectedDeleteQuestion, setIsSelectedDeleteQuestion] =
    useState<Question | null>(null);

  const deleteQuestionHandler = (data: Question) => {
    setIsSelectedDeleteQuestion(data);
    setIsOpenDialogDelete(true);
  };

  const { data, isPending } = useGetDetailSubtest({
    id,
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const { data: question, isPending: isPendingQuestion } =
    useGetAllQuestionBySubtest({
      id,
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
        queryKey: ["get-all-question-by-subtest", id],
      });
    },
  });

  const handleDeleteQuestion = () => {
    if (isSelectedDeleteQuestion) {
      deleteQuestion({
        id: isSelectedDeleteQuestion.id,
        subtestId: id,
        token: session?.access_token as string,
      });
    }
  };

  return (
    <section className="space-y-6">
      <DashboardTitle title={data?.data.name} />
      <Card>
        <CardContent>
          <div className="grid md:grid-cols-3 grid-cols-1 gap-4">
            <div className="flex flex-col gap-2">
              <span>Judul Subtes</span>
              <h3 className="font-semibold">{data?.data.name}</h3>
            </div>
            <div className="flex flex-col gap-2">
              <span>Kategori</span>
              <h3 className="font-semibold">{data?.data.category}</h3>
            </div>
            <div className="flex flex-col gap-2">
              <span>Maksimal Pertanyaan</span>
              <h3 className="font-semibold">{data?.data.max_questions}</h3>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <div className="space-y-6">
            <div className="flex justify-between gap-4 items-center">
              <Input
                placeholder="Cari berdasarkan pertanyaan..."
                className="max-w-xs w-full"
              />
              <Button asChild size={"lg"}>
                <Link href={`/dashboard/admin/subtest/${id}/create`}>
                  <Plus /> Tambah Pertanyaan
                </Link>
              </Button>
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
          open={isOpenDialogDelete}
          setOpen={setIsOpenDialogDelete}
          confirmDelete={handleDeleteQuestion}
          isPending={isPending}
        />
      )}
    </section>
  );
}

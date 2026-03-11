import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { ErrorResponse } from "@/types/metadata/metadata";
import { SubtestByTryout } from "@/types/subtest/subtest";

interface CreateSubtestTryoutResponse {
  data: SubtestByTryout;
}

export const CreateSubtestTryoutHandler = async (
  id: string,
  body: TryoutType,
  token: string,
) => {
  const { data } = await api.post(`/admin/tryouts/${id}/subtests`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const useCreateSubtestTryout = (
  options?: UseMutationOptions<
    CreateSubtestTryoutResponse,
    AxiosError<ErrorResponse>,
    { id: string; body: TryoutType }
  >,
) => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, body }) =>
      CreateSubtestTryoutHandler(id, body, session?.access_token ?? ""),
    ...options,
  });
};

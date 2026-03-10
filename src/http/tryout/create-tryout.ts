import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { ErrorResponse } from "@/types/metadata/metadata";
import { Tryout } from "@/types/tryout/tryout";
import { TryoutType } from "@/validators/tryout/tryout-validator";

interface CreateTryoutResponse {
  data: Tryout;
}

export const CreateTryoutHandler = async (body: TryoutType, token: string) => {
  const { data } = await api.post("/admin/tryouts", body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const useCreateTryout = (
  options?: UseMutationOptions<
    CreateTryoutResponse,
    AxiosError<ErrorResponse>,
    TryoutType
  >,
) => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (body) =>
      CreateTryoutHandler(body, session?.access_token ?? ""),
    ...options,
  });
};

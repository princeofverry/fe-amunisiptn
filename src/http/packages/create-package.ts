import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { ErrorResponse } from "@/types/metadata/metadata";
import { Package } from "@/types/packages/package";
import { PackageFormInput } from "@/validators/packages/package-validator";

interface CreatePackageResponse {
  data: Package[];
}

export const CreatePackageHandler = async (
  body: PackageFormInput,
  token: string,
) => {
  const { data } = await api.post(`/admin/packages`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useCreatePackage = (
  options?: UseMutationOptions<
    CreatePackageResponse,
    AxiosError<ErrorResponse>,
    PackageFormInput
  >,
) => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: (body: PackageFormInput) =>
      CreatePackageHandler(body, session?.access_token ?? ""),
    ...options,
  });
};

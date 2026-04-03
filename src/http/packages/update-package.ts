import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useSession } from "next-auth/react";
import { ErrorResponse } from "@/types/metadata/metadata";
import { Package } from "@/types/packages/package";
import { PackageFormInput } from "@/validators/packages/package-validator";

interface UpdatePackageResponse {
  data: Package;
}

export const UpdatePackageHandler = async (
  id: string,
  body: PackageFormInput,
  token: string,
): Promise<UpdatePackageResponse> => {
  const { data } = await api.put(`/admin/packages/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useUpdatePackage = (
  options?: UseMutationOptions<
    UpdatePackageResponse,
    AxiosError<ErrorResponse>,
    { id: string; body: PackageFormInput }
  >,
) => {
  const { data: session } = useSession();

  return useMutation({
    mutationFn: ({ id, body }) =>
      UpdatePackageHandler(id, body, session?.access_token ?? ""),
    ...options,
  });
};

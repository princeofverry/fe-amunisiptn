import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { Kelas } from "@/types/kelas/kelas";

interface GetAllKelasAdminResponse {
  data: Kelas[];
}

export const GetAllKelasAdminHandler = async (
  token: string
): Promise<GetAllKelasAdminResponse> => {
  const { data } = await api.get<GetAllKelasAdminResponse>("/admin/kelas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
};

export const useGetAllKelasAdmin = ({
  token,
  options,
}: {
  token: string;
  options?: Partial<UseQueryOptions<GetAllKelasAdminResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-all-kelas-admin"],
    queryFn: () => GetAllKelasAdminHandler(token),
    enabled: !!token,
    ...options,
  });
};

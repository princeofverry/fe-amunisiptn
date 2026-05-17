import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { Kelas } from "@/types/kelas/kelas";

export interface GetAllKelasAdminResponse {
  data: Kelas[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export const GetAllKelasAdminHandler = async (
  token: string,
  page = 1,
  perPage = 15,
  search = ""
): Promise<GetAllKelasAdminResponse> => {
  const { data } = await api.get<GetAllKelasAdminResponse>("/admin/kelas", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, per_page: perPage, search: search || undefined },
  });
  return data;
};

export const useGetAllKelasAdmin = ({
  token,
  page = 1,
  perPage = 15,
  search = "",
  options,
}: {
  token: string;
  page?: number;
  perPage?: number;
  search?: string;
  options?: Partial<UseQueryOptions<GetAllKelasAdminResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-all-kelas-admin", page, perPage, search],
    queryFn: () => GetAllKelasAdminHandler(token, page, perPage, search),
    enabled: !!token,
    ...options,
  });
};

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { User } from "@/types/user/user";

export interface GetAllUsersResponse {
  data: User[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

export const GetAllUsersHandler = async (
  token: string,
  page = 1,
  search = ""
): Promise<GetAllUsersResponse> => {
  const { data } = await api.get<GetAllUsersResponse>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, search: search || undefined },
  });
  return data;
};

export const useGetAllUsers = ({
  token,
  page = 1,
  search = "",
  options,
}: {
  token: string;
  page?: number;
  search?: string;
  options?: Partial<UseQueryOptions<GetAllUsersResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-all-users", page, search],
    queryFn: () => GetAllUsersHandler(token, page, search),
    enabled: !!token,
    ...options,
  });
};

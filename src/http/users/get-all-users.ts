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
  search = "",
  perPage = 15
): Promise<GetAllUsersResponse> => {
  const { data } = await api.get<GetAllUsersResponse>("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
    params: { page, search: search || undefined, per_page: perPage },
  });
  return data;
};

export const useGetAllUsers = ({
  token,
  page = 1,
  search = "",
  perPage = 15,
  options,
}: {
  token: string;
  page?: number;
  search?: string;
  perPage?: number;
  options?: Partial<UseQueryOptions<GetAllUsersResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-all-users", page, search, perPage],
    queryFn: () => GetAllUsersHandler(token, page, search, perPage),
    enabled: !!token,
    ...options,
  });
};

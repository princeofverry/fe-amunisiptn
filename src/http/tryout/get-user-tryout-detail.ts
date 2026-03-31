import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { Tryout } from "@/types/tryout/tryout";

interface GetUserTryoutDetailResponse {
  data: Tryout;
}

export const GetUserTryoutDetailHandler = async (
  id: string,
  token: string,
): Promise<GetUserTryoutDetailResponse> => {
  const { data } = await api.get<GetUserTryoutDetailResponse>(
    `/tryouts/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return data;
};

export const useGetUserTryoutDetail = ({
  id,
  token,
  options,
}: {
  id: string;
  token: string;
  options?: Partial<UseQueryOptions<GetUserTryoutDetailResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-user-tryout-detail", id],
    queryFn: () => GetUserTryoutDetailHandler(id, token),
    enabled: !!token && !!id,
    ...options,
  });
};

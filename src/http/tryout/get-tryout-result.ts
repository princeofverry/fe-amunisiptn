import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { TryoutResultData } from "@/types/exam/exam";

interface GetTryoutResultResponse {
  message: string;
  data: TryoutResultData;
}

export const GetTryoutResultHandler = async (
  tryoutId: string,
  token: string
): Promise<GetTryoutResultResponse> => {
  const { data } = await api.get<GetTryoutResultResponse>(
    `/tryouts/${tryoutId}/result`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const useGetTryoutResult = ({
  tryoutId,
  token,
  options,
}: {
  tryoutId: string;
  token: string;
  options?: Partial<UseQueryOptions<GetTryoutResultResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-tryout-result", tryoutId],
    queryFn: () => GetTryoutResultHandler(tryoutId, token),
    enabled: !!tryoutId && !!token,
    ...options,
  });
};

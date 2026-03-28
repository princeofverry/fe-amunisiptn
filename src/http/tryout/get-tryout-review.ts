import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { ReviewData } from "@/types/exam/exam";

interface GetTryoutReviewResponse {
  data: ReviewData;
}

export const GetTryoutReviewHandler = async (
  tryoutId: string,
  token: string
): Promise<GetTryoutReviewResponse> => {
  const { data } = await api.get<GetTryoutReviewResponse>(
    `/tryouts/${tryoutId}/review`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return data;
};

export const useGetTryoutReview = ({
  tryoutId,
  token,
  options,
}: {
  tryoutId: string;
  token: string;
  options?: Partial<UseQueryOptions<GetTryoutReviewResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-tryout-review", tryoutId],
    queryFn: () => GetTryoutReviewHandler(tryoutId, token),
    enabled: !!tryoutId && !!token,
    ...options,
  });
};

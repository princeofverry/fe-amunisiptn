import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface TryoutHistoryData {
  id: number;
  tryoutName: string;
  dateTaken: string;
  score: number;
  status: "selesai" | "sedang dikerjakan";
}

const MOCK_TO_HISTORY: TryoutHistoryData[] = [
  { id: 1, tryoutName: "Mini TO SNBT Episode 01", dateTaken: "2026-04-02T10:00:00", score: 650, status: "selesai" },
  { id: 2, tryoutName: "Mini TO SNBT Episode 02", dateTaken: "2026-04-09T13:00:00", score: 710, status: "selesai" },
];

export interface GetHistoryTryoutResponse {
  data: TryoutHistoryData[];
}

export const GetHistoryTryoutHandler = async (token: string): Promise<GetHistoryTryoutResponse> => {
  // UNCOMMENT to use real API endpoint
  // const { data } = await api.get<GetHistoryTryoutResponse>("/my-tryouts", {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_TO_HISTORY }), 600));
};

export const useGetHistoryTryout = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetHistoryTryoutResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-history-tryout"],
    queryFn: () => GetHistoryTryoutHandler(token),
    ...options,
  });
};

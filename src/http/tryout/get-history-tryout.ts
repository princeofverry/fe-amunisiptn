import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { Tryout } from "@/types/tryout/tryout";

export interface TryoutHistoryData {
  id: string;
  tryoutName: string;
  dateTaken: string;
  score: number;
  status: "selesai" | "sedang dikerjakan";
}

function mapMyTryoutToHistory(tryout: Tryout): TryoutHistoryData {
  return {
    id: tryout.id,
    tryoutName: tryout.title,
    dateTaken: tryout.start_date ? String(tryout.start_date) : "",
    score: 0, // Score needs separate API call to /result
    status: "selesai",
  };
}

export interface GetHistoryTryoutResponse {
  data: TryoutHistoryData[];
}

export const GetHistoryTryoutHandler = async (token: string): Promise<GetHistoryTryoutResponse> => {
  const { data } = await api.get<{ data: Tryout[] }>("/my-tryouts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { data: data.data.map(mapMyTryoutToHistory) };
};

export const useGetHistoryTryout = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetHistoryTryoutResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-history-tryout"],
    queryFn: () => GetHistoryTryoutHandler(token),
    ...options,
  });
};

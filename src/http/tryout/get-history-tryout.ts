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
  hasAttempted: boolean;
  isFree: boolean;
}

function mapMyTryoutToHistory(tryout: Tryout): TryoutHistoryData {
  const isFinished = tryout.user_session_status === "finished";
  // "not_started" means enrolled but never opened; any other status means at least one attempt exists
  const hasAttempted = !!tryout.user_session_status && tryout.user_session_status !== "not_started";

  return {
    id: tryout.id,
    tryoutName: tryout.title,
    dateTaken: tryout.user_started_at
      ? String(tryout.user_started_at)
      : tryout.start_date
        ? String(tryout.start_date)
        : "",
    score: 0, // Score needs separate API call to /result
    status: isFinished ? "selesai" : "sedang dikerjakan",
    hasAttempted,
    isFree: tryout.is_free ?? false,
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
    queryKey: ["get-history-tryout", token],
    queryFn: () => GetHistoryTryoutHandler(token),
    enabled: !!token,
    ...options,
  });
};

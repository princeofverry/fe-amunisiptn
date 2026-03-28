import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useDataMode } from "@/components/providers/DataModeProvider";
import type { Tryout } from "@/types/tryout/tryout";

export interface TryoutHistoryData {
  id: string;
  tryoutName: string;
  dateTaken: string;
  score: number;
  status: "selesai" | "sedang dikerjakan";
}

const MOCK_TO_HISTORY: TryoutHistoryData[] = [
  { id: "1", tryoutName: "Mini TO SNBT Episode 01", dateTaken: "2026-04-02T10:00:00", score: 650, status: "selesai" },
  { id: "2", tryoutName: "Mini TO SNBT Episode 02", dateTaken: "2026-04-09T13:00:00", score: 710, status: "selesai" },
];

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

export const GetHistoryTryoutHandler = async (token: string, mode: string): Promise<GetHistoryTryoutResponse> => {
  if (mode === "backend") {
    const { data } = await api.get<{ data: Tryout[] }>("/my-tryouts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: data.data.map(mapMyTryoutToHistory) };
  }

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_TO_HISTORY }), 600));
};

export const useGetHistoryTryout = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetHistoryTryoutResponse, AxiosError>> }) => {
  const { mode } = useDataMode();
  return useQuery({
    queryKey: ["get-history-tryout", mode],
    queryFn: () => GetHistoryTryoutHandler(token, mode),
    ...options,
  });
};

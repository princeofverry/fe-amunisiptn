import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useDataMode } from "@/components/providers/DataModeProvider";
import type { Tryout } from "@/types/tryout/tryout";

export interface UserTryoutData {
  id: string;
  title: string;
  type: "Premium" | "Gratis";
  startDate: string;
  endDate: string;
  is_free?: boolean;
  description?: string;
  tryoutSubtests?: any[];
}

const MOCK_DATA: UserTryoutData[] = [
  { id: "1", title: "Mini TO SNBT Episode 01", type: "Gratis", startDate: "2026-04-01T00:00:00", endDate: "2026-04-07T23:59:59" },
  { id: "2", title: "Mini TO SNBT Episode 02", type: "Premium", startDate: "2026-04-08T00:00:00", endDate: "2026-04-14T23:59:59" },
  { id: "3", title: "Mini TO SNBT Episode 03", type: "Gratis", startDate: "2026-04-15T00:00:00", endDate: "2026-04-21T23:59:59" },
];

function mapTryoutBEtoFE(tryout: Tryout): UserTryoutData {
  return {
    id: tryout.id,
    title: tryout.title,
    type: tryout.is_free ? "Gratis" : "Premium",
    startDate: tryout.start_date ? String(tryout.start_date) : "",
    endDate: tryout.end_date ? String(tryout.end_date) : "",
    is_free: tryout.is_free,
    description: tryout.description,
    tryoutSubtests: tryout.tryout_subtests,
  };
}

export interface GetUserTryoutsResponse {
  data: UserTryoutData[];
}

export const GetUserTryoutsHandler = async (token: string, mode: string): Promise<GetUserTryoutsResponse> => {
  if (mode === "backend") {
    const { data } = await api.get<{ data: Tryout[] }>("/tryouts", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: data.data.map(mapTryoutBEtoFE) };
  }

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_DATA }), 500));
};

export const useGetUserTryouts = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetUserTryoutsResponse, AxiosError>> }) => {
  const { mode } = useDataMode();
  return useQuery({
    queryKey: ["get-user-tryouts", mode],
    queryFn: () => GetUserTryoutsHandler(token, mode),
    ...options,
  });
};

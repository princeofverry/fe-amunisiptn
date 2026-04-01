import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { Tryout } from "@/types/tryout/tryout";

export interface UserTryoutData {
  id: string;
  title: string;
  type: "Premium" | "Gratis";
  startDate: string;
  endDate: string;
  is_free?: boolean;
  description?: string;
  image_url?: string | null;
  tryoutSubtests?: any[];
}

function mapTryoutBEtoFE(tryout: Tryout): UserTryoutData {
  return {
    id: tryout.id,
    title: tryout.title,
    type: tryout.is_free ? "Gratis" : "Premium",
    startDate: tryout.start_date ? String(tryout.start_date) : "",
    endDate: tryout.end_date ? String(tryout.end_date) : "",
    is_free: tryout.is_free,
    description: tryout.description,
    image_url: tryout.image_url,
    tryoutSubtests: tryout.tryout_subtests,
  };
}

export interface GetUserTryoutsResponse {
  data: UserTryoutData[];
}

export const GetUserTryoutsHandler = async (token: string): Promise<GetUserTryoutsResponse> => {
  const { data } = await api.get<{ data: Tryout[] }>("/tryouts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { data: data.data.map(mapTryoutBEtoFE) };
};

export const useGetUserTryouts = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetUserTryoutsResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-user-tryouts"],
    queryFn: () => GetUserTryoutsHandler(token),
    enabled: !!token,
    ...options,
  });
};

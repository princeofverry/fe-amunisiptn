import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface UserTryoutData {
  id: number;
  title: string;
  type: "Premium" | "Gratis";
  startDate: string;
  endDate: string;
}

const MOCK_DATA: UserTryoutData[] = [
  { id: 1, title: "Mini TO SNBT Episode 01", type: "Gratis", startDate: "2026-04-01T00:00:00", endDate: "2026-04-07T23:59:59" },
  { id: 2, title: "Mini TO SNBT Episode 02", type: "Premium", startDate: "2026-04-08T00:00:00", endDate: "2026-04-14T23:59:59" },
  { id: 3, title: "Mini TO SNBT Episode 03", type: "Gratis", startDate: "2026-04-15T00:00:00", endDate: "2026-04-21T23:59:59" },
];

export interface GetUserTryoutsResponse {
  data: UserTryoutData[];
}

export const GetUserTryoutsHandler = async (token: string): Promise<GetUserTryoutsResponse> => {
  // UNCOMMENT to use real API endpoint
  // const { data } = await api.get<GetUserTryoutsResponse>("/tryouts", {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_DATA }), 500));
};

export const useGetUserTryouts = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetUserTryoutsResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-user-tryouts"],
    queryFn: () => GetUserTryoutsHandler(token),
    ...options,
  });
};

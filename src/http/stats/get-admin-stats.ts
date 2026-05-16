import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface AdminStats {
  total_users: number;
  total_tryouts: number;
  total_orders: number;
  total_revenue: number;
  monthly_revenue: { label: string; total: number }[];
  order_by_status: { status: string; count: number }[];
}

interface GetAdminStatsResponse {
  data: AdminStats;
}

export const GetAdminStatsHandler = async (token: string): Promise<GetAdminStatsResponse> => {
  const { data } = await api.get<GetAdminStatsResponse>("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const useGetAdminStats = ({
  token,
  options,
}: {
  token: string;
  options?: Partial<UseQueryOptions<GetAdminStatsResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-admin-stats"],
    queryFn: () => GetAdminStatsHandler(token),
    enabled: !!token,
    ...options,
  });
};

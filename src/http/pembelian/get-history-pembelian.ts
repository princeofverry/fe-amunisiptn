import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface TransactionData {
  id: string;
  orderDate: string;
  packageName: string;
  amount: number;
  status: "success" | "pending" | "failed";
}

const MOCK_TRANSACTIONS: TransactionData[] = [
  { id: "TRX-20260401", orderDate: "2026-04-01T10:00:00", packageName: "1 Tiket Try Out Premium", amount: 20000, status: "success" },
  { id: "TRX-20260315", orderDate: "2026-03-15T14:30:00", packageName: "3 Tiket Try Out Premium", amount: 59000, status: "success" },
  { id: "TRX-20260228", orderDate: "2026-02-28T09:15:00", packageName: "10 Tiket Try Out Premium", amount: 170000, status: "failed" },
];

export interface GetHistoryPembelianResponse {
  data: TransactionData[];
}

export const GetHistoryPembelianHandler = async (token: string): Promise<GetHistoryPembelianResponse> => {
  // UNCOMMENT to use real API endpoint
  // const { data } = await api.get<GetHistoryPembelianResponse>("/my-orders", {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_TRANSACTIONS }), 600));
};

export const useGetHistoryPembelian = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetHistoryPembelianResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-history-pembelian"],
    queryFn: () => GetHistoryPembelianHandler(token),
    ...options,
  });
};

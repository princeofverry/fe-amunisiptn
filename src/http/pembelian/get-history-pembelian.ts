import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useDataMode } from "@/components/providers/DataModeProvider";
import type { OrderBE } from "@/types/package/package";

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

function mapBEStatusToFE(status: string): "success" | "pending" | "failed" {
  if (status === "paid") return "success";
  if (status === "pending" || status === "waiting_approval") return "pending";
  return "failed"; // cancelled, rejected
}

function mapOrderBEtoFE(order: OrderBE): TransactionData {
  return {
    id: order.order_code,
    orderDate: order.created_at,
    packageName: order.items?.[0]?.package_name_snapshot || "Paket",
    amount: order.grand_total,
    status: mapBEStatusToFE(order.status),
  };
}

export interface GetHistoryPembelianResponse {
  data: TransactionData[];
}

export const GetHistoryPembelianHandler = async (token: string, mode: string): Promise<GetHistoryPembelianResponse> => {
  if (mode === "backend") {
    const { data } = await api.get<{ data: OrderBE[] }>("/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: data.data.map(mapOrderBEtoFE) };
  }

  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_TRANSACTIONS }), 600));
};

export const useGetHistoryPembelian = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetHistoryPembelianResponse, AxiosError>> }) => {
  const { mode } = useDataMode();
  return useQuery({
    queryKey: ["get-history-pembelian", mode],
    queryFn: () => GetHistoryPembelianHandler(token, mode),
    ...options,
  });
};

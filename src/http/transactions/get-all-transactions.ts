import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { Transaction } from "@/types/transactions/transaction";

interface GetAllTransactionResponse {
  data: Transaction[];
}

export const GetAllTransactionHandler = async (
  token: string,
): Promise<GetAllTransactionResponse> => {
  const { data } = await api.get<GetAllTransactionResponse>("/admin/orders", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useGetAllTransaction = ({
  token,
  options,
}: {
  token: string;
  options?: Partial<UseQueryOptions<GetAllTransactionResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-all-transactions"],
    queryFn: () => GetAllTransactionHandler(token),
    enabled: !!token,
    ...options,
  });
};

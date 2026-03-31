import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

interface RedeemResponse {
  message: string;
  data: {
    tryout_id: string;
    tryout_title: string;
  };
}

interface RedeemPayload {
  code: string;
}

export const RedeemAccessCodeHandler = async (
  payload: RedeemPayload,
  token: string
): Promise<RedeemResponse> => {
  const { data } = await api.post<RedeemResponse>("/access-codes/redeem", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return data;
};

export const useRedeemAccessCode = ({
  token,
  options,
}: {
  token: string;
  options?: Partial<UseMutationOptions<RedeemResponse, AxiosError, RedeemPayload>>;
}) => {
  return useMutation({
    mutationFn: (payload: RedeemPayload) => RedeemAccessCodeHandler(payload, token),
    ...options,
  });
};

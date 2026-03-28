import { useMutation, type UseMutationOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

interface EnrollResponse {
  message: string;
  ticket_balance_remaining?: number;
}

export const EnrollTryoutHandler = async (
  tryoutId: string,
  token: string,
  proofImage?: File
): Promise<EnrollResponse> => {
  if (proofImage) {
    // Free tryout — need to upload proof image
    const formData = new FormData();
    formData.append("proof_image", proofImage);
    
    const { data } = await api.post<EnrollResponse>(
      `/tryouts/${tryoutId}/enroll`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } else {
    // Premium tryout — just enroll with ticket
    const { data } = await api.post<EnrollResponse>(
      `/tryouts/${tryoutId}/enroll`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return data;
  }
};

export const useEnrollTryout = ({
  token,
  options,
}: {
  token: string;
  options?: Partial<UseMutationOptions<EnrollResponse, AxiosError, { tryoutId: string; proofImage?: File }>>;
}) => {
  return useMutation({
    mutationFn: ({ tryoutId, proofImage }: { tryoutId: string; proofImage?: File }) =>
      EnrollTryoutHandler(tryoutId, token, proofImage),
    ...options,
  });
};

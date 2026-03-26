import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { PackageData, MOCK_PACKAGES } from "./get-all-packages";

export interface GetDetailPackageResponse {
  data: PackageData;
}

export const GetDetailPackageHandler = async (id: number, token: string): Promise<GetDetailPackageResponse> => {
  // UNCOMMENT to use real API endpoint
  // const { data } = await api.get<GetDetailPackageResponse>(`/packages/${id}`, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;

  // Returning mock data for now
  const pkg = MOCK_PACKAGES.find(p => p.id === id) || MOCK_PACKAGES[0];
  return new Promise((resolve) => setTimeout(() => resolve({ data: pkg }), 500));
};

export const useGetDetailPackage = ({ id, token, options }: { id: number; token: string; options?: Partial<UseQueryOptions<GetDetailPackageResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-detail-package", id],
    queryFn: () => GetDetailPackageHandler(id, token),
    enabled: !!id,
    ...options,
  });
};

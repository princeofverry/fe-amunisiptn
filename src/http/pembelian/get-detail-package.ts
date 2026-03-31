import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { PackageData } from "./get-all-packages";
import type { PackageBE } from "@/types/package/package";

export interface GetDetailPackageResponse {
  data: PackageData;
}

function mapBEtoFE(pkg: PackageBE): PackageData {
  return {
    id: pkg.id,
    title: pkg.name,
    price: pkg.price,
    originalPrice: pkg.price,
    discount: "0%",
    description: pkg.description || "",
    ticketAmount: pkg.ticket_amount,
  };
}

export const GetDetailPackageHandler = async (id: string, token: string): Promise<GetDetailPackageResponse> => {
  const { data } = await api.get<{ data: PackageBE }>(`/packages/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { data: mapBEtoFE(data.data) };
};

export const useGetDetailPackage = ({ id, token, options }: { id: string; token: string; options?: Partial<UseQueryOptions<GetDetailPackageResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-detail-package", id],
    queryFn: () => GetDetailPackageHandler(id, token),
    enabled: !!id,
    ...options,
  });
};

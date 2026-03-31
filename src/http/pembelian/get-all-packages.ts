import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import type { PackageBE } from "@/types/package/package";

export interface PackageData {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
  ticketAmount?: number;
}

// Map BE response to FE interface
function mapBEtoFE(pkg: PackageBE): PackageData {
  return {
    id: pkg.id,
    title: pkg.name,
    price: pkg.price,
    originalPrice: pkg.price, // BE doesn't have discount info
    discount: "0%",
    description: pkg.description || "",
    ticketAmount: pkg.ticket_amount,
  };
}

export interface GetAllPackagesResponse {
  data: PackageData[];
}

export const GetAllPackagesHandler = async (token: string): Promise<GetAllPackagesResponse> => {
  const { data } = await api.get<{ data: PackageBE[] }>("/packages", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return { data: data.data.map(mapBEtoFE) };
};

export const useGetAllPackages = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetAllPackagesResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-all-packages"],
    queryFn: () => GetAllPackagesHandler(token),
    ...options,
  });
};

import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useDataMode } from "@/components/providers/DataModeProvider";
import { PackageData, MOCK_PACKAGES } from "./get-all-packages";
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

export const GetDetailPackageHandler = async (id: string, token: string, mode: string): Promise<GetDetailPackageResponse> => {
  if (mode === "backend") {
    const { data } = await api.get<{ data: PackageBE }>(`/packages/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: mapBEtoFE(data.data) };
  }

  // Dummy mode
  const pkg = MOCK_PACKAGES.find(p => p.id === String(id)) || MOCK_PACKAGES[0];
  return new Promise((resolve) => setTimeout(() => resolve({ data: pkg }), 500));
};

export const useGetDetailPackage = ({ id, token, options }: { id: string; token: string; options?: Partial<UseQueryOptions<GetDetailPackageResponse, AxiosError>> }) => {
  const { mode } = useDataMode();
  return useQuery({
    queryKey: ["get-detail-package", id, mode],
    queryFn: () => GetDetailPackageHandler(id, token, mode),
    enabled: !!id,
    ...options,
  });
};

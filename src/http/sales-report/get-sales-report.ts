import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface SalesReportRow {
  package_name: string;
  year: number;
  month: number;
  jumlah_peserta: number;
  total_fee: number;
}

export interface SalesReportSummary {
  total_peserta: number;
  total_fee: number;
}

export interface SalesReportResponse {
  data: SalesReportRow[];
  summary: SalesReportSummary;
}

interface GetSalesReportParams {
  token: string;
  year?: number;
  month?: number;
}

export const GetSalesReportHandler = async ({
  token,
  year,
  month,
}: GetSalesReportParams): Promise<SalesReportResponse> => {
  const params: Record<string, number> = {};
  if (year) params.year = year;
  if (month) params.month = month;

  const { data } = await api.get<SalesReportResponse>("/admin/sales-report", {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
  return data;
};

export const useGetSalesReport = ({
  token,
  year,
  month,
  options,
}: GetSalesReportParams & {
  options?: Partial<UseQueryOptions<SalesReportResponse, AxiosError>>;
}) => {
  return useQuery({
    queryKey: ["get-sales-report", year, month],
    queryFn: () => GetSalesReportHandler({ token, year, month }),
    enabled: !!token,
    ...options,
  });
};

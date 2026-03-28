import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";
import { useDataMode } from "@/components/providers/DataModeProvider";
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

export const MOCK_PACKAGES: PackageData[] = [
  {
    id: "1",
    title: "1 Tiket Try Out Premium",
    price: 20000,
    originalPrice: 25000,
    discount: "20%",
    description: "Nikmati pengalaman mengerjakan soal TPS dan TKA dengan standar SNBT terbaru. Paket ini mencakup 1 kali try out lengkap beserta pembahasan mendetail untuk membantu Anda memahami kelemahan dan kekuatan Anda.",
    ticketAmount: 1,
  },
  {
    id: "2",
    title: "3 Tiket Try Out Premium",
    price: 59000,
    originalPrice: 75000,
    discount: "21%",
    description: "Persiapan lebih mantap dengan 3 kali uji coba. Tingkatkan skor Anda secara bertahap dengan berlatih lebih banyak dan menyimak semua fitur evaluasi kami.",
    ticketAmount: 3,
  },
  {
    id: "3",
    title: "5 Tiket Try Out Premium",
    price: 98000,
    originalPrice: 125000,
    discount: "22%",
    description: "Paket ideal untuk pemanasan intensif. Dapatkan 5 tiket premium yang bisa diakses kapan saja sebelum ujian sesungguhnya tiba.",
    ticketAmount: 5,
  },
  {
    id: "4",
    title: "10 Tiket Try Out Premium",
    price: 170000,
    originalPrice: 250000,
    discount: "32%",
    description: "Fokus maksimal dengan 10 try out berkualitas. Anda akan terbiasa dengan pola soal yang beragam serta manajemen waktu ujian.",
    ticketAmount: 10,
  },
  {
    id: "5",
    title: "20 Tiket Try Out Premium",
    price: 340000,
    originalPrice: 500000,
    discount: "32%",
    description: "Amunisi penuh bagi yang ingin masuk PTN favorit. Latihan tak terbatas untuk menaklukan segala jenis soal dengan percaya diri.",
    ticketAmount: 20,
  },
];

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

export const GetAllPackagesHandler = async (token: string, mode: string): Promise<GetAllPackagesResponse> => {
  if (mode === "backend") {
    const { data } = await api.get<{ data: PackageBE[] }>("/packages", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: data.data.map(mapBEtoFE) };
  }

  // Dummy mode
  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_PACKAGES }), 500));
};

export const useGetAllPackages = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetAllPackagesResponse, AxiosError>> }) => {
  const { mode } = useDataMode();
  return useQuery({
    queryKey: ["get-all-packages", mode],
    queryFn: () => GetAllPackagesHandler(token, mode),
    ...options,
  });
};

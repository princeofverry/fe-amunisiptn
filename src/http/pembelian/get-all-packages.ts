import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { api } from "@/lib/axios";

export interface PackageData {
  id: number;
  title: string;
  price: number;
  originalPrice: number;
  discount: string;
  description: string;
}

export const MOCK_PACKAGES: PackageData[] = [
  {
    id: 1,
    title: "1 Tiket Try Out Premium",
    price: 20000,
    originalPrice: 25000,
    discount: "20%",
    description: "Nikmati pengalaman mengerjakan soal TPS dan TKA dengan standar SNBT terbaru. Paket ini mencakup 1 kali try out lengkap beserta pembahasan mendetail untuk membantu Anda memahami kelemahan dan kekuatan Anda.",
  },
  {
    id: 2,
    title: "3 Tiket Try Out Premium",
    price: 59000,
    originalPrice: 75000,
    discount: "21%",
    description: "Persiapan lebih mantap dengan 3 kali uji coba. Tingkatkan skor Anda secara bertahap dengan berlatih lebih banyak dan menyimak semua fitur evaluasi kami.",
  },
  {
    id: 3,
    title: "5 Tiket Try Out Premium",
    price: 98000,
    originalPrice: 125000,
    discount: "22%",
    description: "Paket ideal untuk pemanasan intensif. Dapatkan 5 tiket premium yang bisa diakses kapan saja sebelum ujian sesungguhnya tiba.",
  },
  {
    id: 4,
    title: "10 Tiket Try Out Premium",
    price: 170000,
    originalPrice: 250000,
    discount: "32%",
    description: "Fokus maksimal dengan 10 try out berkualitas. Anda akan terbiasa dengan pola soal yang beragam serta manajemen waktu ujian.",
  },
  {
    id: 5,
    title: "20 Tiket Try Out Premium",
    price: 340000,
    originalPrice: 500000,
    discount: "32%",
    description: "Amunisi penuh bagi yang ingin masuk PTN favorit. Latihan tak terbatas untuk menaklukan segala jenis soal dengan percaya diri.",
  },
];

export interface GetAllPackagesResponse {
  data: PackageData[];
}

export const GetAllPackagesHandler = async (token: string): Promise<GetAllPackagesResponse> => {
  // UNCOMMENT to use real API endpoint
  // const { data } = await api.get<GetAllPackagesResponse>("/packages", {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return data;

  // Returning mock data for now
  return new Promise((resolve) => setTimeout(() => resolve({ data: MOCK_PACKAGES }), 500));
};

export const useGetAllPackages = ({ token, options }: { token: string; options?: Partial<UseQueryOptions<GetAllPackagesResponse, AxiosError>> }) => {
  return useQuery({
    queryKey: ["get-all-packages"],
    queryFn: () => GetAllPackagesHandler(token),
    ...options,
  });
};

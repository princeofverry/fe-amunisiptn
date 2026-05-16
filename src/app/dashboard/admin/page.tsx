"use client";

import { useSession } from "next-auth/react";
import { useGetAdminStats } from "@/http/stats/get-admin-stats";
import { formatPrice } from "@/utils/format-price";
import { Users, BookOpen, ShoppingCart, Banknote } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const STATUS_COLORS: Record<string, string> = {
  pending: "#F59E0B",
  paid: "#3B82F6",
  approved: "#10B981",
  rejected: "#EF4444",
  cancelled: "#6B7280",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Menunggu",
  paid: "Sudah Bayar",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export default function DashboardAdminPage() {
  const { data: session } = useSession();
  const token = (session as any)?.access_token || "";

  const { data, isLoading } = useGetAdminStats({ token });
  const stats = data?.data;

  const statCards = [
    {
      label: "Total Pengguna",
      value: stats?.total_users ?? 0,
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total Try Out",
      value: stats?.total_tryouts ?? 0,
      icon: BookOpen,
      color: "bg-green-50 text-green-600",
    },
    {
      label: "Total Transaksi",
      value: stats?.total_orders ?? 0,
      icon: ShoppingCart,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Total Pendapatan",
      value: formatPrice(stats?.total_revenue ?? 0),
      icon: Banknote,
      color: "bg-purple-50 text-purple-600",
    },
  ];

  const pieData = (stats?.order_by_status ?? []).map((s) => ({
    name: STATUS_LABELS[s.status] ?? s.status,
    value: s.count,
    fill: STATUS_COLORS[s.status] ?? "#9CA3AF",
  }));

  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard Admin</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`p-3 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {isLoading ? "..." : card.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Bar Chart - Monthly Revenue */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Pendapatan per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Memuat data...
              </div>
            ) : (stats?.monthly_revenue?.length ?? 0) === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Belum ada data pendapatan.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <BarChart data={stats!.monthly_revenue}>
                  <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                  <YAxis
                    tickFormatter={(v) =>
                      new Intl.NumberFormat("id-ID", {
                        notation: "compact",
                        maximumFractionDigits: 1,
                      }).format(v)
                    }
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [formatPrice(Number(value)), "Pendapatan"]}
                  />
                  <Bar dataKey="total" fill="#004AAB" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Pie Chart - Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Status Transaksi</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Memuat data...
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Belum ada data transaksi.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={256}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({ name, percent }) =>
                      `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useGetSalesReport, type SalesReportRow } from "@/http/sales-report/get-sales-report";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";

const MONTH_NAMES = [
  "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const THIS_YEAR = new Date().getFullYear();
const YEAR_OPTIONS = [THIS_YEAR, THIS_YEAR - 1, THIS_YEAR - 2];

function formatRupiah(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(amount);
}

function buildChartData(rows: SalesReportRow[]) {
  const map = new Map<string, number>();
  for (const r of rows) {
    const key = `${MONTH_NAMES[r.month]} ${r.year}`;
    map.set(key, (map.get(key) ?? 0) + r.total_fee);
  }
  return Array.from(map.entries())
    .map(([label, total]) => ({ label, total }))
    .reverse();
}

export default function SalesReportPage() {
  const { data: session } = useSession();
  const token = session?.access_token || "";

  const [year, setYear]   = useState<number | undefined>(THIS_YEAR);
  const [month, setMonth] = useState<number | undefined>(undefined);

  const { data, isLoading } = useGetSalesReport({ token, year, month });

  const rows    = data?.data    ?? [];
  const summary = data?.summary ?? { total_peserta: 0, total_fee: 0 };
  const chartData = buildChartData(rows);

  return (
    <main className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Laporan Penjualan</h1>
          <p className="text-sm text-gray-500">Penjualan Try Out per paket per bulan</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Select
              value={year ? String(year) : "all"}
              onValueChange={(v) => setYear(v === "all" ? undefined : Number(v))}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tahun" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tahun</SelectItem>
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={month ? String(month) : "all"}
              onValueChange={(v) => setMonth(v === "all" ? undefined : Number(v))}
            >
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Bulan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Bulan</SelectItem>
                {MONTH_NAMES.slice(1).map((name, i) => (
                  <SelectItem key={i + 1} value={String(i + 1)}>{name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">Total Peserta</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">{summary.total_peserta.toLocaleString("id-ID")}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-sm text-gray-500">Total Pendapatan</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{formatRupiah(summary.total_fee)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tren Pendapatan per Bulan</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 16, left: 0, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `${(v / 1000).toFixed(0)}rb`} />
                <Tooltip formatter={(v) => typeof v === "number" ? formatRupiah(v) : v} labelStyle={{ fontWeight: 600 }} />
                <Bar dataKey="total" name="Pendapatan" fill="#004AAB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-10 text-center text-gray-400">Memuat data...</div>
          ) : rows.length === 0 ? (
            <div className="p-10 text-center text-gray-400">Tidak ada data penjualan.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-10">No</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Paket Try Out</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">Bulan</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 w-36">Jumlah Peserta</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600 w-40">Total Pendapatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rows.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-400">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{row.package_name}</td>
                      <td className="px-4 py-3 text-gray-600">{MONTH_NAMES[row.month]} {row.year}</td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.jumlah_peserta.toLocaleString("id-ID")}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">{formatRupiah(row.total_fee)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-3 font-bold text-gray-700">Grand Total</td>
                    <td className="px-4 py-3 text-right font-bold text-gray-900">{summary.total_peserta.toLocaleString("id-ID")}</td>
                    <td className="px-4 py-3 text-right font-bold text-green-600">{formatRupiah(summary.total_fee)}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}

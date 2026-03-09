"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Session } from "next-auth";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Settings2,
  Users,
  Book,
  FileText,
  File,
  MessageCircleMore,
  Info,
  Map,
  Box,
  Package,
  ClipboardClock,
  SquareArrowDown,
  SquareArrowUp,
  ClipboardList,
  ChartNoAxesCombined,
  ClipboardPen,
  Landmark,
  FingerprintPattern,
  FileBox,
  ListChecks,
  ShoppingCart,
  Receipt,
  PlusCircle,
  Banknote,
  BookCopy,
  BookOpen,
  BookKey,
  FileClock,
} from "lucide-react";
import { SidebarUser } from "./SidebarUser";
import { DASHBOARD_MENU } from "@/constants/dashboard-menu";

interface SidebarWrapperProps {
  session: Session;
}

export function SidebarWrapper({ session }: SidebarWrapperProps) {
  const pathname = usePathname();

  const role = session?.user.role as keyof typeof DASHBOARD_MENU;

  const menu = role ? DASHBOARD_MENU[role] : null;

  if (!menu) return null;

  const buttonClass = (href: string) =>
    `hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-900 ${
      pathname.startsWith(href)
        ? "bg-primary/10 text-primary dark:bg-slate-800"
        : ""
    }`;

  const buttonClassIncoming = (href: string) =>
    `hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-900 ${
      pathname.startsWith(href) && !pathname.startsWith(`${href}/status`)
        ? "bg-primary/10 text-primary dark:bg-slate-800"
        : ""
    }`;

  return (
    <Sidebar>
      {/* Header */}
      <SidebarHeader className="h-18 cursor-default justify-center bg-white dark:bg-slate-950">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="ml-2 flex items-center gap-x-3">
              <Link href="/dashboard" className="flex items-center gap-2">
                <Image
                  src={"/images/logo/amunisiptn-blue.png"}
                  alt="Amunisi PTN"
                  width={120}
                  height={25}
                />
              </Link>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-white dark:bg-slate-950">
        <SidebarGroup>
          <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-900 ${
                    pathname === menu.href
                      ? "bg-primary/10 text-primary dark:bg-slate-800"
                      : ""
                  }`}
                >
                  <Link href={menu.href}>
                    <LayoutDashboard />
                    <span>{menu.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {session?.user.role === "admin" && (
          <>
            <SidebarGroup>
              <SidebarGroupLabel>Manajemen Data</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/admin/users")}
                    >
                      <Link href="/dashboard/admin/users">
                        <Users />
                        <span>Pengguna</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/admin/packages")}
                    >
                      <Link href="/dashboard/admin/packages">
                        <BookCopy />
                        <span>Paket</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/admin/try-out")}
                    >
                      <Link href="/dashboard/admin/try-out">
                        <BookOpen />
                        <span>Try Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/admin/question-bank")}
                    >
                      <Link href="/dashboard/admin/question-bank">
                        <BookKey />
                        <span>Bank Soal</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/admin/transactions")}
                    >
                      <Link href="/dashboard/admin/transactions">
                        <FileClock />
                        <span>Riwayat Transaksi</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {/* user roles groups */}
        {session?.user.role === "user" && (
          <>
            {/* Konten */}
            <SidebarGroup>
              <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className={buttonClass("/dashboard/try-out")}
                    >
                      <Link href="/dashboard/try-out">
                        <BookOpen />
                        <span>Try Out</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        <SidebarGroup>
          <SidebarGroupLabel>Pengaturan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className={`hover:bg-primary/10 hover:text-primary dark:hover:bg-slate-900 ${
                    pathname === "/dashboard/settings"
                      ? "bg-primary/10 text-primary dark:bg-slate-800"
                      : ""
                  }`}
                >
                  <Link href="/dashboard/settings">
                    <Settings2 />
                    <span>Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="bg-white">
        <SidebarUser session={session} />
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bell, Search, LogOut, Settings, Home, User, Ticket } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { useTickets } from "@/hooks/useTickets";

interface DashboardTopBarProps {
  userName?: string;
}

export default function DashboardTopBar({ userName }: DashboardTopBarProps) {
  const name = userName || "Amunisian";
  const { ticketCount } = useTickets();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 bg-white border-b border-gray-100 px-4 md:px-6 py-3">
      {/* Left: Mobile Sidebar Trigger */}
      <div className="flex items-center gap-3">
        <SidebarTrigger className="md:hidden" />
      </div>

      {/* Right side wrapper covering Search + Notification + Profile */}
      <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
        
        {/* Search Bar */}
        <div className="w-full max-w-md hidden sm:block relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Mau belajar apa hari ini?"
            className="w-full pl-10 pr-4 py-2 text-sm bg-[#EDF5FF] border-none rounded-full text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            readOnly
          />
        </div>

        {/* Ticket Badge */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EDF5FF] hover:bg-blue-100 transition-colors flex-shrink-0 cursor-pointer">
          <Ticket className="h-5 w-5 text-gray-700" />
          <span className="font-bold text-gray-800 text-sm">{ticketCount}</span>
        </button>

        {/* Notification Bell */}
        <button className="relative p-2 rounded-full bg-[#EDF5FF] hover:bg-blue-100 transition-colors flex-shrink-0 text-gray-600">
          <Bell className="h-5 w-5" />
        </button>

        {/* Separator */}
        <div className="hidden md:block w-px h-8 bg-gray-200" />

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <div className="flex items-center gap-2 hover:bg-gray-50 p-1 pr-2 rounded-full transition-colors cursor-pointer border border-transparent hover:border-gray-100">
              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarFallback className="bg-primary/10 text-primary">
                  <User className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:flex flex-col items-start pr-1">
                <span className="text-[11px] text-[#013476] font-medium leading-tight">
                  Halo!
                </span>
                <span className="text-sm font-bold text-[#013476] leading-tight">
                  {name}
                </span>
              </div>
            </div>
          </DropdownMenuTrigger>
          
          <DropdownMenuContent
            className="w-56"
            align="end"
            sideOffset={8}
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  Pengguna Amunisi
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/dashboard">
                <DropdownMenuItem className="cursor-pointer">
                  <Home className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/settings">
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Pengaturan Akun</span>
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
}

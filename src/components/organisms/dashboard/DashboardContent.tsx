"use client";

import HeroBanner from "@/components/molecules/dashboard/HeroBanner";
import InfoCardCarousel from "@/components/molecules/dashboard/InfoCardCarousel";
import LiveClassSection from "@/components/molecules/dashboard/LiveClassSection";
import { useSession } from "next-auth/react";

export default function DashboardContent() {
  const { data: session } = useSession();

  return (
    <section className="flex flex-col gap-6">
      <HeroBanner userName={session?.user?.name ?? "Amunisian"} />
      <InfoCardCarousel />
      <LiveClassSection />
    </section>
  );
}

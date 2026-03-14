"use client";

import HeroBanner from "@/components/molecules/dashboard/HeroBanner";
import InfoCardCarousel from "@/components/molecules/dashboard/InfoCardCarousel";
import LiveClassSection from "@/components/molecules/dashboard/LiveClassSection";
import DialogCompleteProfile from "@/components/molecules/dialog/DialogCompleteProfile";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function DashboardContent() {
  const { data: session } = useSession();
  const [showProfileComplete, setShowProfileComplete] = useState(false);

  useEffect(() => {
    // Show popup if user lacks a phone number or school origin, which they usually do right after registering
    if (session?.user && (!session.user.phone_number || !session.user.school_origin)) {
      setShowProfileComplete(true);
    }
  }, [session]);

  return (
    <>
      <section className="flex flex-col gap-6">
        <HeroBanner userName={session?.user?.name ?? "Amunisian"} />
        <InfoCardCarousel />
        <LiveClassSection />
      </section>

      {/* Conditionally rendered popup for new users without full profiles */}
      <DialogCompleteProfile 
        open={showProfileComplete} 
        onOpenChange={setShowProfileComplete} 
      />
    </>
  );
}

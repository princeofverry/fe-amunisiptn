import DashboardTitle from "@/components/atoms/typography/DashboardTitle";
import DashboardAdminCreatePackageWrapper from "@/components/organisms/dashboard/admin/packages/DashboardAdminCreatePackageWrapper";

export default function DashboardAdminCreatePackagePage() {
  return (
    <main>
      <DashboardTitle title="Tambah Paket" />
      <DashboardAdminCreatePackageWrapper />
    </main>
  );
}

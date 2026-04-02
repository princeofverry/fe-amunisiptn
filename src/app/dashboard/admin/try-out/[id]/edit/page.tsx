import DashboardTitle from "@/components/atoms/typography/DashboardTitle";
import DashboardAdminUpdateTryoutWrapper from "@/components/organisms/dashboard/admin/tryout/DashboardAdminUpdateTryoutWrapper";

interface DashboardAdminTryOutEditPageProps {
  params: Promise<{ id: string }>;
}

export default async function DashboardAdminTryOutEditPage({
  params,
}: DashboardAdminTryOutEditPageProps) {
  const { id } = await params;

  return (
    <main>
      <DashboardTitle title="Ubah Tryout" />
      <DashboardAdminUpdateTryoutWrapper id={id} />
    </main>
  );
}

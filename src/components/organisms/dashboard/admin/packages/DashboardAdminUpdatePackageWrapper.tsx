import FormUpdatePackage from "@/components/molecules/form/packages/FormUpdatePackage";

interface DashboardAdminUpdatePackageWrapperProps {
  packageId: string;
}

export default function DashboardAdminUpdatePackageWrapper({
  packageId,
}: DashboardAdminUpdatePackageWrapperProps) {
  return (
    <section>
      <FormUpdatePackage packageId={packageId} />
    </section>
  );
}

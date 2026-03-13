import DashboardTitle from "@/components/atoms/typography/DashboardTitle";
import FormCreateQuestion from "@/components/molecules/form/questions/FormCreateQuestion";

interface DashboardAdminCreateQuestionWrapperProps {
  id: string;
}

export default function DashboardAdminCreateQuestionWrapper({
  id,
}: DashboardAdminCreateQuestionWrapperProps) {
  return (
    <section>
      <DashboardTitle title="Tambah Soal ke Subtes" />
      <FormCreateQuestion id={id} />
    </section>
  );
}

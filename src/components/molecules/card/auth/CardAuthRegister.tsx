import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import FormAuthRegister from "../../form/auth/FormAuthRegister";

export default function CardAuthRegister() {
  return (
    <div className="space-y-6 w-full max-w-md h-full mx-auto">
      <div className="flex items-center justify-center">
        <Image
          src={"/images/logo/amunisiptn-blue.png"}
          alt="Amunisiptn Logo"
          width={200}
          height={100}
        />
      </div>
      <Card className="p-4 border-0 shadow-none" size="sm">
        <CardContent className="space-y-6 p-4 border-0 shadow-none">
          <div>
            <h3 className="text-2xl font-bold">Daftar</h3>
          </div>
          <div className="space-y-6">
            <FormAuthRegister />
          </div>

          <div className="text-center">
            <span className="text-sm text-muted-foreground">
              Sudah punya akun?{" "}
            </span>
            <Link
              href="/login"
              className="text-sm text-primary font-medium underline"
            >
              Masuk
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

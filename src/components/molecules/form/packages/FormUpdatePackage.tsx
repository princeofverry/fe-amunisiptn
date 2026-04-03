// components/packages/FormUpdatePackage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useMemo } from "react";
import { useGetDetailPackage } from "@/http/packages/get-detail-package";
import {
  PackageFormInput,
  packageSchema,
} from "@/validators/packages/package-validator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CURRENCIES } from "@/constants/currency";
import { useSession } from "next-auth/react";
import { useUpdatePackage } from "@/http/packages/update-package";

interface FormUpdatePackageProps {
  packageId: string;
}

export default function FormUpdatePackage({
  packageId,
}: FormUpdatePackageProps) {
  const { data: session } = useSession();

  const { data: detailData, isPending: isLoadingDetail } = useGetDetailPackage({
    id: packageId,
    token: session?.access_token as string,
  });

  const defaultData = useMemo(() => detailData?.data, [detailData]);

  const form = useForm<PackageFormInput>({
    resolver: zodResolver(packageSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "IDR",
      ticket_amount: 1,
      is_active: true,
    },
  });

  useEffect(() => {
    if (!defaultData) return;

    form.reset({
      name: defaultData.name ?? "",
      slug: defaultData.slug ?? "",
      description: defaultData.description ?? "",
      price: defaultData.price ?? 0,
      currency: defaultData.currency ?? "IDR",
      ticket_amount: defaultData.ticket_amount ?? 1,
      is_active: defaultData.is_active ?? true,
    });
  }, [defaultData, form]);

  const nameValue = form.watch("name");
  useEffect(() => {
    if (!form.formState.dirtyFields.slug) {
      const generatedSlug = nameValue
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");

      form.setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [nameValue, form]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: updatePackageHandler, isPending } = useUpdatePackage({
    onError: (error: any) => {
      const message = error.response?.data?.message ?? "Terjadi kesalahan.";
      toast.error("Gagal memperbarui package!", { description: message });
    },
    onSuccess: () => {
      toast.success("Berhasil memperbarui package!");
      queryClient.invalidateQueries({ queryKey: ["get-all-packages"] });
      queryClient.invalidateQueries({
        queryKey: ["get-detail-package", packageId],
      });
      router.push("/dashboard/admin/packages");
    },
  });

  const onSubmit = (body: PackageFormInput) => {
    updatePackageHandler({ id: packageId, body });
  };

  if (isLoadingDetail) {
    return (
      <Card>
        <CardContent className="space-y-6 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex justify-end">
            <Skeleton className="h-11 w-36 rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="grid md:grid-cols-2 gap-6">
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Nama Package <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} placeholder="Masukkan nama package" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="slug"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Slug <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input {...field} placeholder="otomatis-dari-nama" />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <div className="md:col-span-2">
              <Controller
                control={form.control}
                name="description"
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Deskripsi</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Masukkan deskripsi package"
                    />
                    {fieldState.error && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="price"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Harga <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    min={0}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Masukkan harga"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="currency"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Mata Uang <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih mata uang" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          <span className="flex items-center gap-2">
                            <span>{currency.flag}</span>
                            <span>{currency.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="ticket_amount"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Jumlah Tiket <span className="text-red-500">*</span>
                  </FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                    placeholder="Masukkan jumlah tiket"
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="is_active"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status</FieldLabel>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Aktif" : "Nonaktif"}
                    </span>
                  </div>
                </Field>
              )}
            />
          </FieldGroup>

          <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isPending}>
              {isPending ? "Menyimpan..." : "Simpan Perubahan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

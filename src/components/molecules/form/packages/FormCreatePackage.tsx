// components/packages/FormCreatePackage.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
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
import { useEffect } from "react";
import { useCreatePackage } from "@/http/packages/create-package";
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

export default function FormCreatePackage() {
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

  const nameValue = form.watch("name");
  useEffect(() => {
    const generatedSlug = nameValue
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    form.setValue("slug", generatedSlug, { shouldValidate: true });
  }, [nameValue, form]);

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createPackageHandler, isPending } = useCreatePackage({
    onError: (error: any) => {
      const message = error.response?.data?.message ?? "Terjadi kesalahan.";
      toast.error("Gagal menambahkan package!", { description: message });
    },
    onSuccess: () => {
      toast.success("Berhasil menambahkan package!");
      queryClient.invalidateQueries({ queryKey: ["get-all-packages"] });
      router.push("/dashboard/admin/packages");
    },
  });

  const onSubmit = (body: PackageFormInput) => {
    createPackageHandler(body);
  };

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
              {isPending ? "Loading..." : "Tambahkan"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

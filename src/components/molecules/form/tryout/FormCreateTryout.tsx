"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { tryoutSchema, TryoutType } from "@/validators/tryout/tryout-validator";

import { useCreateTryout } from "@/http/tryout/create-tryout";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function FormCreateTryout() {
  const form = useForm<TryoutType>({
    resolver: zodResolver(tryoutSchema),
    defaultValues: {
      title: "",
      description: "",
      is_published: false,
    },
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createItemHandler, isPending } = useCreateTryout({
    onError: (error: any) => {
      const message = error.response?.data.meta.message ?? "Terjadi kesalahan.";

      toast.error("Gagal menambahkan tryout!", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Berhasil menambahkan tryout!");

      queryClient.invalidateQueries({
        queryKey: ["get-all-tryouts"],
      });

      router.push("/dashboard/admin/try-out");
    },
  });

  const onSubmit = (body: TryoutType) => {
    createItemHandler(body);
  };

  return (
    <Card>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="title"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Judul Tryout <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input {...field} placeholder="Masukkan judul tryout" />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="description"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Deskripsi <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input {...field} placeholder="Masukkan deskripsi tryout" />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Status Publikasi</FieldLabel>

                  <div className="flex items-center gap-3">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />

                    <span className="text-sm text-muted-foreground">
                      {field.value ? "Dipublikasikan" : "Draft"}
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

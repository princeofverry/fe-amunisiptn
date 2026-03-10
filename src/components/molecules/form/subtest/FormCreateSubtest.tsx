"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  subtestSchema,
  SubtestType,
} from "@/validators/subtest/subtest-validator";
import { useCreateSubtest } from "@/http/subtest/create-subtest";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

export default function FormCreateSubtest() {
  const form = useForm<SubtestType>({
    resolver: zodResolver(subtestSchema),
    defaultValues: {
      name: "",
      category: "",
    },
    mode: "onChange",
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createItemHandler, isPending } = useCreateSubtest({
    onError: (error: any) => {
      const message = error.response?.data.meta.message ?? "Terjadi kesalahan.";

      toast.error("Gagal menambahkan subtes!", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Berhasil menambahkan subtes!");

      queryClient.invalidateQueries({
        queryKey: ["get-all-subtests"],
      });

      router.push("/dashboard/admin/subtest");
    },
  });

  const onSubmit = (body: SubtestType) => {
    createItemHandler(body);
  };

  return (
    <Card>
      <CardContent>
        <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller
              control={form.control}
              name="name"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Nama Subtes <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Input
                    {...field}
                    id="name"
                    placeholder="Masukkan nama subtes"
                  />

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={form.control}
              name="category"
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>
                    Kategori <span className="text-red-500">*</span>
                  </FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="TPS">TPS</SelectItem>
                      <SelectItem value="Literasi">Literasi</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
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

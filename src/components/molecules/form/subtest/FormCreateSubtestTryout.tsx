"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import { Controller, useForm } from "react-hook-form";

import { toast } from "sonner";

import {
  subtestTryoutSchema,
  SubtestTryoutType,
} from "@/validators/subtest/subtest-tryout-validator";

import { useSession } from "next-auth/react";
import { useGetAllSubtest } from "@/http/subtest/get-all-subtest";

import { useState } from "react";
import { useCreateSubtestTryout } from "@/http/subtest/create-subtest-tryout";
import { set } from "zod";

interface FormCreateSubtestTryoutProps {
  tryoutId: string;
  setOpen: (open: boolean) => void;
}

export default function FormCreateSubtestTryout({
  tryoutId,
  setOpen,
}: FormCreateSubtestTryoutProps) {
  const { data: session, status } = useSession();

  const [openSubtest, setOpenSubtest] = useState(false);

  const { data } = useGetAllSubtest({
    token: session?.access_token as string,
    options: {
      enabled: status === "authenticated",
    },
  });

  const form = useForm<SubtestTryoutType>({
    resolver: zodResolver(subtestTryoutSchema),
    mode: "onChange",
    defaultValues: {
      subtest_id: "",
      duration_minutes: 30,
      order_no: 1,
      is_active: true,
    },
  });

  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: createHandler, isPending } = useCreateSubtestTryout({
    onError: (error: any) => {
      const message = error.response?.data?.message ?? "Terjadi kesalahan.";

      toast.error("Gagal menambahkan subtest ke tryout!", {
        description: message,
      });
    },
    onSuccess: () => {
      toast.success("Subtest berhasil ditambahkan ke tryout!");

      queryClient.invalidateQueries({
        queryKey: ["get-subtest-by-tryout"],
      });

      setOpen(false);
    },
  });

  const onSubmit = (body: SubtestTryoutType) => {
    createHandler({ id: tryoutId, body });
  };

  return (
    <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
      <FieldGroup>
        <Controller
          control={form.control}
          name="subtest_id"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Subtest <span className="text-red-500">*</span>
              </FieldLabel>

              <Popover open={openSubtest} onOpenChange={setOpenSubtest}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {field.value
                      ? data?.data?.find((item) => item.id === field.value)
                          ?.name
                      : "Pilih subtest"}

                    <ChevronsUpDown className="opacity-50" />
                  </Button>
                </PopoverTrigger>

                <PopoverContent className="p-0">
                  <Command>
                    <CommandInput placeholder="Cari subtest..." />
                    <CommandEmpty>Subtest tidak ditemukan</CommandEmpty>

                    <CommandGroup>
                      {data?.data?.map((subtest) => (
                        <CommandItem
                          key={subtest.id}
                          value={subtest.name}
                          onSelect={() => {
                            field.onChange(subtest.id);
                            setOpenSubtest(false);
                          }}
                        >
                          {subtest.name}

                          <Check
                            className={cn(
                              "ml-auto",
                              field.value === subtest.id
                                ? "opacity-100"
                                : "opacity-0",
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="duration_minutes"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Durasi (Menit) <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                placeholder="Contoh: 30"
              />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={form.control}
          name="order_no"
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>
                Urutan Subtest <span className="text-red-500">*</span>
              </FieldLabel>

              <Input
                type="number"
                value={field.value}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                placeholder="Contoh: 1"
              />

              {fieldState.error && <FieldError errors={[fieldState.error]} />}
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
                  {field.value ? "Aktif" : "Tidak Aktif"}
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
  );
}

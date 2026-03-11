import z from "zod";

export const subtestTryoutSchema = z.object({
  subtest_id: z.string().min(1, "Subtest wajib dipilih"),

  duration_minutes: z.number().min(1, "Durasi minimal 1 menit"),

  order_no: z.number().min(1, "Urutan minimal 1"),

  is_active: z.boolean(),
});

export type SubtestTryoutType = z.infer<typeof subtestTryoutSchema>;

import z from "zod";

export const subtestSchema = z.object({
  name: z.string().min(1, "Nama subtes wajib diisi"),
  category: z.string().min(1, "Kategori subtes wajib diisi"),
});

export type SubtestType = z.infer<typeof subtestSchema>;

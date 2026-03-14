import z from "zod";

export const tryoutSchema = z.object({
  title: z
    .string()
    .min(1, "Judul tryout wajib diisi")
    .max(150, "Judul tryout maksimal 150 karakter"),

  description: z
    .string()
    .min(1, "Deskripsi tryout wajib diisi")
    .max(500, "Deskripsi maksimal 500 karakter"),

  is_published: z.boolean(),

  start_date: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "start_date harus format tanggal yang valid (ISO string).",
    }),

  end_date: z
    .string()
    .optional()
    .nullable()
    .refine((v) => !v || !Number.isNaN(Date.parse(v)), {
      message: "end_date harus format tanggal yang valid (ISO string).",
    }),

  image: z.instanceof(File).optional().nullable(),

  category: z
    .string()
    .max(100, "Kategori maksimal 100 karakter")
    .optional()
    .nullable(),
});

export type TryoutType = z.infer<typeof tryoutSchema>;

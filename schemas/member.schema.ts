import { z } from "zod";

export const MemberSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),

  phone: z
    .string()
    .min(10, "Nomor terlalu pendek")
    .max(15, "Nomor terlalu panjang")
    .regex(/^\d+$/, "Nomor HP harus berupa angka"),

  email: z
    .string()
    .email("Format email tidak valid")
    .max(100)
    .optional()
    .or(z.literal("")),

  branchIds: z.array(z.string().uuid()).min(1, "Pilih minimal satu cabang"),

  activeSince: z.string().datetime("Tanggal mulai tidak valid"),

  activeUntil: z.string().datetime("Tanggal selesai tidak valid"),
});

export type AddMemberForm = z.infer<typeof MemberSchema>;

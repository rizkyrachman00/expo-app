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
});

export type AddMemberForm = z.infer<typeof MemberSchema>;

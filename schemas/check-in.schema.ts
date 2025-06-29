import { z } from "zod";

// Payload
export const CheckInPayloadSchema = z.discriminatedUnion("type", [
  // MEMBER
  z.object({
    type: z.literal("member"),
    memberId: z
      .string({ required_error: "ID member wajib diisi" })
      .uuid("ID member tidak valid"),
    branchId: z
      .string({ required_error: "Cabang wajib diisi" })
      .uuid("ID cabang tidak valid"),
  }),

  // GUEST
  z.object({
    type: z.literal("guest"),
    guestName: z
      .string({ required_error: "Nama tamu wajib diisi" })
      .min(1, "Nama tamu tidak boleh kosong"),
    guestPhone: z
      .string({ required_error: "Nomor HP tamu wajib diisi" })
      .min(1, "Nomor HP tamu tidak boleh kosong")
      .regex(
        /^08[0-9]{8,11}$/,
        "Nomor HP tidak valid (gunakan format 08xxxxxxxxxx)"
      ),
    branchId: z
      .string({ required_error: "Cabang wajib diisi" })
      .uuid("ID cabang tidak valid"),
  }),
]);

// Response
export const CheckInResponseSchema = z.object({
  message: z.string(),
  visitLogId: z.string().uuid(),
});

// Infer types
export type CheckInPayload = z.infer<typeof CheckInPayloadSchema>;
export type CheckInResponse = z.infer<typeof CheckInResponseSchema>;

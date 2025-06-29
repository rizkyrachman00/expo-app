import {
    CheckInPayload,
    CheckInPayloadSchema,
    CheckInResponse,
    CheckInResponseSchema,
} from "@/schemas/check-in.schema";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Fungsi untuk check-in (member atau guest)
export const checkIn = async (
  payload: CheckInPayload,
  token: string | null
): Promise<CheckInResponse> => {
  if (!token) throw new Error("Token tidak tersedia");

  // Validasi payload
  const parsed = CheckInPayloadSchema.safeParse(payload);
  if (!parsed.success) {
    const firstError =
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
      "Payload tidak valid";
    throw new Error(firstError);
  }

  const response = await fetch(`${API_BASE_URL}/check-in`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsed.data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal melakukan check-in");
  }

  return CheckInResponseSchema.parse(json);
};

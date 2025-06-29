import {
  AddSubscriptionPayload,
  AddSubscriptionPayloadSchema,
  ExtendSubscriptionPayload,
  ExtendSubscriptionPayloadSchema,
  MemberWithSubscriptions,
  MemberWithSubscriptionsListResponseSchema,
} from "@/schemas/subscription.schema";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Get All Subscriptions
export const getSubscriptions = async (
  token: string | null
): Promise<MemberWithSubscriptions[]> => {
  if (!token) throw new Error("Token tidak tersedia");

  const response = await fetch(`${API_BASE_URL}/subscriptions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return MemberWithSubscriptionsListResponseSchema.parse(json);
};

// Extend Subscription
export const extendSubscription = async (
  payload: ExtendSubscriptionPayload,
  token: string | null
): Promise<void> => {
  if (!token) {
    throw new Error("Token tidak tersedia");
  }

  // Validasi payload dengan Zod
  const parsed = ExtendSubscriptionPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
      "Payload tidak valid";
    throw new Error(firstError);
  }

  const response = await fetch(`${API_BASE_URL}/subscription/extend`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsed.data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal memperpanjang subscription");
  }
};

// Create New Subscription
export const createSubscription = async (
  payload: AddSubscriptionPayload,
  token: string | null
): Promise<void> => {
  if (!token) throw new Error("Token tidak tersedia");

  const parsed = AddSubscriptionPayloadSchema.safeParse(payload);

  if (!parsed.success) {
    const firstError =
      Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
      "Payload tidak valid";
    throw new Error(firstError);
  }

  const response = await fetch(`${API_BASE_URL}/subscription`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(parsed.data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.message || "Gagal menambahkan member baru.");
  }
};

// DELETE /subscription/:id (soft delete)
export const deleteSubscription = async (
  id: string,
  token: string | null
): Promise<void> => {
  if (!token) throw new Error("Token tidak tersedia");

  const res = await fetch(`${API_BASE_URL}/subscription/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const json = await res.json();
  if (!res.ok) {
    throw new Error(json?.message || "Gagal nonaktifkan subscription");
  }
};

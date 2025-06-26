import { MemberWithSubscriptions, MemberWithSubscriptionsListResponseSchema } from "@/schemas/subscription.schema";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getSubscriptions = async (token: string | null): Promise<MemberWithSubscriptions[]> => {
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

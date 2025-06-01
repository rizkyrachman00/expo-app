import { ADMIN_EMAILS } from "@/constants/data/admin";

export const isAdmin = (email?: string | null): boolean => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

import { Branch, BranchSchema } from "@/schemas/subscription.schema";
import { z } from "zod";

const BranchListResponseSchema = z.array(BranchSchema);

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

export const getBranches = async (): Promise<Branch[]> => {
  const response = await fetch(`${API_BASE_URL}/branches`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = await response.json();
  return BranchListResponseSchema.parse(json);
};

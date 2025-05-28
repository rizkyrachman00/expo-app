import { type BranchIdentifier } from "@/types/location";
import { useQuery } from "@tanstack/react-query";

export const useVisitorCount = (branchIdentifier: BranchIdentifier) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  return useQuery({
    queryKey: ["visitor-count", branchIdentifier],
    queryFn: async () => {
      const res = await fetch(
        `${API_BASE_URL}/check-situasi?branch_identifier=${branchIdentifier}`
      );
      if (!res.ok) {
        throw new Error("Failed to fetch visitor count");
      }
      const json = await res.json();
      if (!json.success) {
        throw new Error("API responded with failure");
      }
      return json.data as number;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

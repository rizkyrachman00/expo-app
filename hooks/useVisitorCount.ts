import { type BranchIdentifier } from "@/types/location";
import { useQuery } from "@tanstack/react-query";

type CheckSituasiItem = {
  branch: {
    id: string;
    identifier: string;
    name: string;
  };
  visitorCount: number;
};

export const useVisitorCount = (branchIdentifier: BranchIdentifier) => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  return useQuery({
    queryKey: ["visitor-count", branchIdentifier],
    queryFn: async () => {
      const res = await fetch(`${API_BASE_URL}/check-situasi`);

      if (!res.ok) {
        throw new Error("Failed to fetch visitor count");
      }

      const json: CheckSituasiItem[] = await res.json();

      const item = json.find(
        (entry) => entry.branch.identifier === branchIdentifier
      );

      if (!item) {
        throw new Error(`Branch ${branchIdentifier} not found in response`);
      }

      return item.visitorCount;
    },
    staleTime: 0,
    refetchOnWindowFocus: true,
  });
};

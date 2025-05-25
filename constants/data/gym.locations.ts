import { type Location } from "@/types/location";

export const GymLocations = {
  piyungan: {
    branchIdentifier: "blackbox_1",
    name: "Piyungan",
  },
  jogja_kota: {
    branchIdentifier: "blackbox_2",
    name: "Jogja Kota",
  },
} satisfies Record<string, Location>;

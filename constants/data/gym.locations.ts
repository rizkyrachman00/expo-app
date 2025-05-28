import { type Location } from "@/types/location";

export const GymLocations = {
  piyungan: {
    branchIdentifier: "blackbox_1",
    name: "Piyungan",
    capacity: 20,
  },
  jogja_kota: {
    branchIdentifier: "blackbox_2",
    name: "Jogja Kota",
    capacity: 25,
  },
} satisfies Record<string, Location>;

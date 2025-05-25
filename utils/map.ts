import { Linking } from "react-native";
import { type BranchIdentifier } from "@/types/location";

const MAPS: Record<BranchIdentifier, string> = {
  blackbox_1: "https://maps.app.goo.gl/VAF7wXSv6mKSETkKA",
  blackbox_2: "https://maps.app.goo.gl/aonA7ZSeEcrmoC8P7",
};

export const openMapLink = async (branchIdentifier: BranchIdentifier) => {
  const url = MAPS[branchIdentifier];
  const supported = await Linking.canOpenURL(url);

  if (supported) {
    await Linking.openURL(url);
  } else {
    console.warn("Tidak bisa membuka URL:", url);
  }
};

import { type Trainer } from "@/types/trainer";
import { trainerImages } from "../trainer-images";
import { GymLocations } from "./gym.locations";

export const GymPartners: Trainer[] = [
  {
    name: "Dafa Pratama",
    profilePicture: trainerImages.dafaImage,
    gender: "male",
    certifications: ["LP2O LANKOR"],
    wa: "6285728037932",
    instagram: "dfaprtama",
    tiktok: "@dafapup",
    locations: [GymLocations.piyungan, GymLocations.jogja_kota],
    slug: "dafa-pratama",
  },
  {
    name: "Ghifari",
    profilePicture: trainerImages.ghifariImage,
    gender: "male",
    certifications: [],
    wa: "6287725812314",
    instagram: "gippyfar_",
    tiktok: "@ghipororo21",
    locations: [GymLocations.piyungan],
    slug: "ghifari",
  },
  {
    name: "Wahyu Nur",
    profilePicture: trainerImages.wahyuImage,
    gender: "male",
    certifications: [],
    wa: "628886566512",
    instagram: "whyuunrc",
    tiktok: "@yuuuuuuuzl",
    locations: [GymLocations.piyungan, GymLocations.jogja_kota],
    slug: "wahyu",
  },
  {
    name: "Kevin",
    profilePicture: trainerImages.kevinImage,
    gender: "male",
    certifications: [],
    wa: "6285760422967",
    instagram: "muhammad_kefiin",
    locations: [GymLocations.jogja_kota],
    slug: "kevin",
  },
  {
    name: "Muhammad Rafi",
    profilePicture: trainerImages.rafiImage,
    gender: "male",
    certifications: [],
    wa: "628895815351",
    instagram: "rafi",
    locations: [GymLocations.piyungan, GymLocations.jogja_kota],
    slug: "muhammad-rafi",
  },
];

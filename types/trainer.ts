import { Location } from "./location";

export type Trainer = {
  profilePicture?: any;
  certifications?: string[];
  locations: Location[];
  gender: "male" | "female";
  name: string;
  wa?: string;
  instagram?: string;
  tiktok?: string;
  slug: string;
};

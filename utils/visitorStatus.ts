export const MAX_PERCENTAGE_SEPI = 30;
export const MAX_PERCENTAGE_NORMAL = 80;

export const getStatusFromPercentage = (
  percentage: number
): "sepi" | "normal" | "ramai" => {
  if (percentage <= MAX_PERCENTAGE_SEPI) return "sepi";
  if (percentage <= MAX_PERCENTAGE_NORMAL) return "normal";
  return "ramai";
};

export const getColorsFromStatus = (
  status: "sepi" | "normal" | "ramai"
): [string, string] => {
  switch (status) {
    case "sepi":
      return ["#84cc16", "#4ade80"];
    case "normal":
      return ["#38bdf8", "#e879f9"];
    case "ramai":
    default:
      return ["#e879f9", "#dc2626"];
  }
};

export type VisitorStatus = "sepi" | "normal" | "ramai";

export function getTitle(status: VisitorStatus): string {
  switch (status) {
    case "sepi":
      return "Sepi";
    case "normal":
      return "Normal";
    case "ramai":
      return "Ramai";
    default:
      return "Tidak diketahui";
  }
}

export const getBranchLabel = (identifier: string, name: string): string => {
  switch (identifier) {
    case "blackbox_1":
      return "PIYUNGAN";
    case "blackbox_2":
      return "JOGJA KOTA";
    default:
      return name;
  }
};

export const getGradientColors = (
  identifier: string | null
): [string, string] => {
  switch (identifier) {
    case "blackbox_1":
      return ["#70e000", "#f48c06"];
    case "blackbox_2":
      return ["#01497c", "#ffafcc"];
    default:
      return ["#03045e", "#52b788"];
  }
};

import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

type Props = {
  label: string;
  colors: [string, string];
};

export const StatusIndicator = ({ label, colors }: Props) => {
  return (
    <View className="flex flex-row gap-2 items-center">
      <LinearGradient
        colors={colors}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="h-4 w-4"
        style={{ borderRadius: 10 }}
      />
      <Text className="text-sm text-white">{label}</Text>
    </View>
  );
};

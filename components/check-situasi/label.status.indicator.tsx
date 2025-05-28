import { LinearGradient } from "expo-linear-gradient";
import { Text, View } from "react-native";

export const LabelStatusIndicator = () => {
  return (
    <View className="flex flex-row justify-start gap-4 w-full bg-gray-900 rounded-lg p-4 mt-5">
      <View className="flex flex-row gap-2 items-center">
        <LinearGradient
          colors={["#84cc16", "#4ade80"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-4 w-4"
          style={{ borderRadius: 10 }}
        />
        <Text className="text-sm text-white">Sepi</Text>
      </View>

      <View className="flex flex-row gap-2 items-center">
        <LinearGradient
          colors={["#38bdf8", "#e879f9"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-4 w-4"
          style={{ borderRadius: 10 }}
        />
        <Text className="text-sm text-white">Normal</Text>
      </View>

      <View className="flex flex-row gap-2 items-center">
        <LinearGradient
          colors={["#e879f9", "#dc2626"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="h-4 w-4"
          style={{ borderRadius: 10 }}
        />
        <Text className="text-sm text-white">Ramai</Text>
      </View>
    </View>
  );
};

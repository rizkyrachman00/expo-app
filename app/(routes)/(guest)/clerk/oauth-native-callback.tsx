import { ActivityIndicator, Text, View } from "react-native";

export default function ClerkCallback() {
  return (
    <View className="flex-1 justify-center items-center bg-primary">
      <ActivityIndicator size="large" color="#fff" />
      <Text className="mt-4 text-white text-base">Logging you in...</Text>
    </View>
  );
}

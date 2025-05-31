import { View, Text } from "react-native";
import React from "react";

const CheckInScreen = () => {
  return (
    <View className="flex-1 justify-center items-center bg-white px-6">
      <Text className="text-xl font-semibold text-gray-800">Check In</Text>
      <Text className="text-sm text-gray-500 mt-2">
        Welcome! You're authenticated.
      </Text>
    </View>
  );
};

export default CheckInScreen;

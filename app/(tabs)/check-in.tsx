import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import React from "react";
import { Text, View, ActivityIndicator } from "react-native";

const CheckIn = () => {
  const { isAuthenticated, isLoaded } = useProtectedRoute();

  if (!isLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-base">Restricted Area. Please login.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-base">CheckIn</Text>
    </View>
  );
};

export default CheckIn;

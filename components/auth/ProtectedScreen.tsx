import React from "react";
import { View, ActivityIndicator } from "react-native";
import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { useAuth } from "@clerk/clerk-expo";
import RestrictedArea from "./RestrictedArea";

export default function ProtectedScreen({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, isLoaded: routeLoaded } = useProtectedRoute();
  const { isLoaded: authLoaded } = useAuth();

  const isReady = routeLoaded && authLoaded;

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <RestrictedArea />;
  }

  return <>{children}</>;
}

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { isAdmin } from "@/utils/roleCheck";
import { useAuth, useUser } from "@clerk/clerk-expo";
import React from "react";
import { ActivityIndicator, View } from "react-native";
import RestrictedArea from "./RestrictedArea";

type ProtectedScreenProps = {
  children: React.ReactNode;
  requireAdmin?: boolean;
};

export default function ProtectedScreen({
  children,
  requireAdmin = false,
}: ProtectedScreenProps) {
  const { isAuthenticated, isLoaded: routeLoaded } = useProtectedRoute();
  const { isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const isReady = routeLoaded && authLoaded && userLoaded;

  if (!isReady) {
    return (
      <View className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#ffffff" />
      </View>
    );
  }

  // if user is not authenticated
  if (!isAuthenticated) {
    return <RestrictedArea reason="unauthenticated" />;
  }

  // if user is not an admin
  if (requireAdmin) {
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!isAdmin(email)) {
      return <RestrictedArea reason="unauthorized" />;
    }
  }

  return <>{children}</>;
}

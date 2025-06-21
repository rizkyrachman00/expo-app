import ProtectedScreen from "@/components/auth/ProtectedScreen";
import { Slot } from "expo-router";
import React from "react";

export default function AdminLayout() {
  return (
    <ProtectedScreen requireAdmin>
      <Slot />
    </ProtectedScreen>
  );
}

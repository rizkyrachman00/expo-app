import React, { useCallback } from "react";
import { useUser, useAuth, useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { LoggedInView } from "@/components/auth/LoggedInView";
import { LoggedOutView } from "@/components/auth/LoggedOutView";
import { ScrollView, View } from "react-native";

const DrawerContent = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const { startSSOFlow } = useSSO();

  useWarmUpBrowser();

  const onLoginGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl: AuthSession.makeRedirectUri(),
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  }, [startSSOFlow]);

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      keyboardShouldPersistTaps="handled"
      className="bg-black px-6 pt-12 pb-10"
    >
      {!user ? (
        <LoggedOutView onLogin={onLoginGoogle} />
      ) : (
        <LoggedInView user={user} onLogout={signOut} />
      )}
    </ScrollView>
  );
};

export default DrawerContent;

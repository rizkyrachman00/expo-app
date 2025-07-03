import { LoggedInView } from "@/components/auth/LoggedInView";
import { LoggedOutView } from "@/components/auth/LoggedOutView";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { useAuth, useSSO, useUser } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { ScrollView } from "react-native";

const DrawerContent = () => {
  const router = useRouter();
  const { user } = useUser();
  const { signOut } = useAuth();
  const { startSSOFlow } = useSSO();

  useWarmUpBrowser();

  const onLoginGoogle = useCallback(async () => {
    try {
      const redirectUrl = AuthSession.makeRedirectUri({
        scheme: "blackboxcamp",
        native: "blackboxcamp://clerk/oauth-native-callback",
      });

      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: "oauth_google",
        redirectUrl,
      });

      if (createdSessionId) {
        await setActive?.({ session: createdSessionId });
        router.push("/");
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

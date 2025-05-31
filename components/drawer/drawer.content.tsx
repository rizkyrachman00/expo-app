import React, { useCallback } from "react";
import { useUser, useAuth, useSSO } from "@clerk/clerk-expo";
import * as AuthSession from "expo-auth-session";
import { useWarmUpBrowser } from "@/hooks/useWarmUpBrowser";
import { LoggedInView } from "@/components/auth/LoggedInView";
import { LoggedOutView } from "@/components/auth/LoggedOutView";

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

  if (!user) {
    return <LoggedOutView onLogin={onLoginGoogle} />;
  }

  return <LoggedInView user={user} onLogout={signOut} />;
};

export default DrawerContent;

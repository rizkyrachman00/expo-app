import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import React, { useEffect, useCallback } from "react";
import { Image, Pressable, Text, View } from "react-native";

import { useUser, useAuth, useSSO } from "@clerk/clerk-expo";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";

const useWarmUpBrowser = () => {
  useEffect(() => {
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

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
    return (
      <View className="flex-1 px-6 py-10 items-center justify-center bg-primary relative">
        <Image
          source={images.loginIllustration}
          resizeMode="contain"
          className="absolute opacity-25 w-80 h-80 top-[10%] left-[15%]"
        />

        <Text className="text-3xl font-bold mb-4 text-white z-10">
          Selamat Datang 👋
        </Text>

        <Text className="text-center text-gray-400 mb-8 text-base z-10">
          Masuk untuk mulai menggunakan aplikasi
        </Text>

        <Pressable
          onPress={onLoginGoogle}
          className="w-full flex-row items-center justify-center p-3 rounded-xl bg-white/10 border border-white/20 z-10"
        >
          <Image source={icons.google} className="w-5 h-5 mr-2" />
          <Text className="text-base text-white font-medium">
            Masuk dengan Google
          </Text>
        </Pressable>

        <Text className="mt-6 text-sm text-gray-500 z-10">
          Belum punya akun?{" "}
          <Text
            className="text-blue-400 underline"
            onPress={() => console.log("Navigate to Sign Up")}
          >
            Daftar di sini
          </Text>
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 px-6 py-10 items-center justify-center bg-primary">
      <Text className="text-white text-xl mb-4">
        Halo, {user.fullName || user.username || "User"}!
      </Text>
      <Text className="text-white mb-2">
        Email: {user.primaryEmailAddress?.emailAddress}
      </Text>
      <Pressable
        onPress={() => signOut()}
        className="mt-4 p-3 bg-red-600 rounded-xl w-full items-center"
      >
        <Text className="text-white font-bold">Logout</Text>
      </Pressable>
    </View>
  );
};

export default DrawerContent;

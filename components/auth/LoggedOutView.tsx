import { View, Text, Image, Pressable } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

export const LoggedOutView = ({ onLogin }: { onLogin: () => void }) => (
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
      onPress={onLogin}
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

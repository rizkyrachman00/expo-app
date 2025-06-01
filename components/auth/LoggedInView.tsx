import { UserResource } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { isAdmin } from "@/utils/roleCheck";

export const LoggedInView = ({
  user,
  onLogout,
}: {
  user: UserResource;
  onLogout: () => void;
}) => {
  const router = useRouter();

  const email = user.primaryEmailAddress?.emailAddress;
  const admin = isAdmin(email);

  return (
    <View>
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: user.imageUrl }}
          className="w-20 h-20 rounded-full border border-white/10"
        />
        <View className="gap-y-1 max-w-[80%]">
          <Text className="text-white text-lg opacity-70">Halo, 👋</Text>
          <Text
            className="text-white text-2xl font-bold leading-tight"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.fullName || user.username || "User"}
          </Text>
          <Text
            className="text-white/50 text-sm italic mt-1"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <View className="mt-12">
        <View className="flex-row flex-wrap gap-x-4 gap-y-4">
          <View className="w-[48%] rounded-2xl overflow-hidden shadow-md shadow-black/30 border border-white/10">
            <Pressable
              onPress={() => router.push("/(routes)/personal-trainer")}
              android_ripple={{ color: "#FCA311", borderless: false }}
              className="flex-row items-center bg-neutral-900 px-5 py-4"
            >
              <Ionicons name="barbell-outline" size={20} color="#FCA311" />
              <Text
                className="text-white text-base ml-3 font-rubik-medium"
                numberOfLines={1}
              >
                Trainer
              </Text>
            </Pressable>
          </View>

          {admin && (
            <View className="w-[48%] rounded-2xl overflow-hidden shadow-md shadow-black/30 border border-white/10">
              <Pressable
                onPress={() => console.log("Navigate to Admin Dashboard")}
                android_ripple={{ color: "#FCA311", borderless: false }}
                className="flex-row items-center bg-neutral-900 px-5 py-4"
              >
                <Ionicons name="settings-outline" size={20} color="#FCA311" />
                <Text
                  className="text-white text-base ml-3 font-rubik-medium"
                  numberOfLines={1}
                >
                  Admin
                </Text>
              </Pressable>
            </View>
          )}
        </View>

        <View className="mt-6 rounded-2xl overflow-hidden shadow-md shadow-black/30">
          <Pressable
            onPress={onLogout}
            android_ripple={{ color: "#ff7f7f", borderless: false }}
            className="relative flex-row items-center justify-center bg-red-600 px-5 py-4"
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color="#fff"
              className="absolute left-5"
            />
            <Text className="text-white text-base font-rubik-medium text-center">
              Keluar
            </Text>
          </Pressable>
        </View>
      </View>

      <View className="items-center mt-10 opacity-30">
        <Text className="text-white text-xs">Versi 1.0.0</Text>
      </View>
    </View>
  );
};

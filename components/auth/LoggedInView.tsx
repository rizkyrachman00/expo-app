import { UserResource } from "@clerk/types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

export const LoggedInView = ({
  user,
  onLogout,
}: {
  user: UserResource;
  onLogout: () => void;
}) => {
  const router = useRouter();

  return (
    <View>
      <View className="flex-row items-center gap-4">
        <Image
          source={{ uri: user.imageUrl }}
          className="w-20 h-20 rounded-full border border-white/10"
        />
        <View className="gap-y-1">
          <Text className="text-white text-lg opacity-70">Halo, 👋</Text>
          <Text className="text-white text-2xl font-bold leading-tight">
            {user.fullName || user.username || "User"}
          </Text>
          <Text className="text-white/50 text-sm italic mt-1" numberOfLines={1}>
            {user.primaryEmailAddress?.emailAddress}
          </Text>
        </View>
      </View>

      <View className="gap-5 mt-12">
        <View className="rounded-2xl overflow-hidden shadow-md shadow-black/30 border border-white/10">
          <Pressable
            onPress={() => router.push("/(routes)/personal-trainer")}
            android_ripple={{ color: "#FCA311", borderless: false }}
            className="flex-row items-center bg-neutral-900 px-5 py-4"
          >
            <Ionicons name="barbell-outline" size={20} color="#FCA311" />
            <Text className="text-white text-base ml-3 font-rubik-medium">
              BlackBox Camp • Trainer
            </Text>
          </Pressable>
        </View>

        <View className="rounded-2xl overflow-hidden shadow-md shadow-black/30">
          <Pressable
            onPress={onLogout}
            android_ripple={{ color: "#ff7f7f", borderless: false }}
            className="flex-row items-center bg-red-600 px-5 py-4"
          >
            <Ionicons name="log-out-outline" size={20} color="#fff" />
            <Text className="text-white text-base ml-3 font-rubik-medium">
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

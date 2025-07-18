import { UserResource } from "@clerk/types";
import {
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import { isAdmin } from "@/utils/roleCheck";

const MenuItem = ({
  icon,
  label,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
}) => (
  <View className="w-[48%] rounded-2xl overflow-hidden shadow-md shadow-black/30 border border-white/10">
    <Pressable
      onPress={onPress}
      android_ripple={{ color: "#FCA311", borderless: false }}
      className="flex-row items-center bg-neutral-900 px-5 py-4"
    >
      {icon}
      <Text
        className="text-white text-base ml-3 font-rubik-medium"
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  </View>
);

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
        <View className="flex-row flex-wrap gap-4 justify-between">
          <MenuItem
            label="Trainer"
            icon={<Ionicons name="barbell-outline" size={20} color="#FCA311" />}
            onPress={() => router.push("/personal-trainer")}
          />

          {admin && (
            <>
              <MenuItem
                label="QR Check-In"
                icon={
                  <Ionicons name="qr-code-outline" size={20} color="#FCA311" />
                }
                onPress={() => router.push("/checkin-admin/branch.qr")}
              />
              <MenuItem
                label="Check-In Data"
                icon={
                  <MaterialCommunityIcons
                    name="history"
                    size={20}
                    color="#FCA311"
                  />
                }
                onPress={() => router.push("/checkin-admin/visit.logs")}
              />
              <MenuItem
                label="Members"
                icon={<MaterialIcons name="groups" size={20} color="#FCA311" />}
                onPress={() => router.push("/members")}
              />
            </>
          )}
        </View>

        {admin && (
          <View className="mt-6 rounded-2xl overflow-hidden bg-yellow-500 shadow-lg shadow-black/50">
            <Pressable
              onPress={() => router.push("/checkin-admin")}
              android_ripple={{ color: "#ffdd00", borderless: false }}
              className="rounded-2xl"
            >
              <View className="flex-row items-center justify-center px-6 py-4 gap-3">
                <MaterialCommunityIcons
                  name="qrcode-scan"
                  size={22}
                  color="black"
                />
                <Text className="text-black text-base font-rubik-bold">
                  Scan QR Member
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        <View className="my-6 h-px bg-white/20" />

        <View className="mt-4 rounded-2xl overflow-hidden shadow-md shadow-black/30">
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

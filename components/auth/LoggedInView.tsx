import { View, Text, Pressable } from "react-native";
import { UserResource } from "@clerk/types";

export const LoggedInView = ({
  user,
  onLogout,
}: {
  user: UserResource;
  onLogout: () => void;
}) => (
  <View className="flex-1 px-6 py-10 items-center justify-center bg-primary">
    <Text className="text-white text-xl mb-4">
      Halo, {user.fullName || user.username || "User"}!
    </Text>
    <Text className="text-white mb-2">
      Email: {user.primaryEmailAddress?.emailAddress}
    </Text>
    <Pressable
      onPress={onLogout}
      className="mt-4 p-3 bg-red-600 rounded-xl w-full items-center"
    >
      <Text className="text-white font-bold">Logout</Text>
    </Pressable>
  </View>
);

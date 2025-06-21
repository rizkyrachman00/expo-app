import { images } from "@/constants/images";
import React from "react";
import { Image, Text, View } from "react-native";

type RestrictedAreaProps = {
  reason?: "unauthenticated" | "unauthorized";
};

const messages = {
  // unauthenticated: "Restricted Area",
  unauthenticated: {
    title: "Restricted Area",
    description: "Please log in to access this feature.",
  },

  // unauthorized: "Access Denied",
  unauthorized: {
    title: "Access Denied",
    description: "You do not have permission to view this content.",
  },
};

const RestrictedArea = ({ reason = "unauthenticated" }: RestrictedAreaProps) => {

   const { title, description } = messages[reason];

  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Image
        source={images.restricted}
        resizeMode="contain"
        className="absolute w-[500px] h-[500px] opacity-20"
      />

      <View className="bg-white/10 px-4 py-3 rounded-xl z-10">
        <Text className="text-white text-center text-lg font-rubik-bold">
          {title}
        </Text>
        <Text className="text-white text-center text-sm mt-1 opacity-80">
           {description}
        </Text>
      </View>
    </View>
  );
};

export default RestrictedArea;

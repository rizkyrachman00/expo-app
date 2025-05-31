import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants/images";

const RestrictedArea = () => {
  return (
    <View className="flex-1 justify-center items-center bg-black px-6">
      <Image
        source={images.restricted}
        resizeMode="contain"
        className="absolute w-[500px] h-[500px] opacity-20"
      />

      <View className="bg-white/10 px-4 py-3 rounded-xl z-10">
        <Text className="text-white text-center text-lg font-rubik-bold">
          Restricted Area
        </Text>
        <Text className="text-white text-center text-sm mt-1 opacity-80">
          Please log in to access this feature.
        </Text>
      </View>
    </View>
  );
};

export default RestrictedArea;

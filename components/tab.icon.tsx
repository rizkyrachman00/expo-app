import { images } from "@/constants/images";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";

interface TabIconProps {
  focused: boolean;
  icon: any;
  title?: string;
}

const TabIcon = ({ focused, icon, title }: TabIconProps) => {
  if (focused) {
    if (!title) {
      return (
        <View className="mt-4 items-center justify-center">
          <LinearGradient
            colors={["#38bdf8", "#e879f9"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="w-10 h-10 justify-center items-center"
            style={{ borderRadius: 20 }}
          >
            <Image source={icon} className="w-5 h-5" tintColor="white" />
          </LinearGradient>
        </View>
      );
    }

    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[110px] min-h-[60px] mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} className="size-5" tintColor="#151312" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#FCA311" className="size-5" />
    </View>
  );
};

export default TabIcon;

import React from "react";
import { View, TouchableOpacity, Text } from "react-native";

const TabsMenu = [
  {
    key: "personal-trainer",
    title: "Personal Trainer",
  },
  {
    key: "teman-gym",
    title: "Teman Gym",
  },
];

interface TabsBarProps {
  activeTab: string;
  onTabPress: (key: string) => void;
}

export default function TabsBar({ activeTab, onTabPress }: TabsBarProps) {
  return (
    <View className="flex-row justify-around">
      {TabsMenu.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            className="flex-1 items-center"
            key={tab.key}
            onPress={() => onTabPress(tab.key)}
          >
            <Text
              className={`text-base font-rubik-semibold ${
                isActive ? "text-accent" : "text-white"
              }`}
            >
              {tab.title}
            </Text>
            <View
              className={`h-1 mt-2 rounded-full ${
                isActive ? "w-1/2 bg-white" : "w-0 bg-transparent"
              } transition-all duration-300 ease-in-out`}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

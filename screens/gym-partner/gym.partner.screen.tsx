import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import TabsBar from "@/components/trainer/tabs.bar";
import TabsContent from "@/components/trainer/tabs.content";
import { View } from "react-native";

const GymPartnerScreen = () => {
  const [activeTab, setActiveTab] = useState("teman-gym");

  return (
    <SafeAreaView className="bg-primary h-full px-4 pt-4">
      <TabsBar activeTab={activeTab} onTabPress={setActiveTab} />

      <View className="flex-1 mt-6">
        <TabsContent activeTab={activeTab} />
      </View>
    </SafeAreaView>
  );
};

export default GymPartnerScreen;

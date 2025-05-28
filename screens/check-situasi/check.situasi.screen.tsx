import { VisitorCounter } from "@/components/check-situasi/visitor.counter";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GymLocations } from "@/constants/data/gym.locations";
import { LabelStatusIndicator } from "@/components/check-situasi/label.status.indicator";

const CheckSituasiScreen = () => {
  return (
    <SafeAreaView className="bg-primary h-full p-4 gap-4">
      <View className="flex flex-row gap-4 rounded-md">
        <Entypo
          name="info-with-circle"
          size={20}
          color="white"
          className="mt-1"
        />
        <Text className="text-white font-rubik text-sm flex-1">
          Data hanya bersifat sebagai{" "}
          <Text className="font-rubik-bold">referensi</Text>, diambil dari
          jumlah customer check in dalam 2 jam terakhir.
        </Text>
      </View>

      {/* Label Situasi Pengunjung */}
      <LabelStatusIndicator />

      <VisitorCounter
        location={GymLocations.piyungan}
        onPressCheckJamSepi={(branch) => {
          console.log("Navigasi ke jam sepi untuk:", branch);
        }}
      />

      <VisitorCounter
        location={GymLocations.jogja_kota}
        onPressCheckJamSepi={(branch) => {
          console.log("Navigasi ke jam sepi untuk:", branch);
        }}
      />
    </SafeAreaView>
  );
};

export default CheckSituasiScreen;

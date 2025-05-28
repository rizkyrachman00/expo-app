import { VisitorCounter } from "@/components/check-situasi/visitor.counter";
import Entypo from "@expo/vector-icons/Entypo";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { GymLocations } from "@/constants/data/gym.locations";

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
      <View className="flex flex-row justify-start gap-4 w-full bg-gray-900 rounded-lg p-4 mt-5">
        <View className="flex flex-row gap-2 items-center">
          <LinearGradient
            colors={["#84cc16", "#4ade80"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="h-4 w-4"
            style={{ borderRadius: 10 }}
          />
          <Text className="text-sm text-white">Sepi</Text>
        </View>

        <View className="flex flex-row gap-2 items-center">
          <LinearGradient
            colors={["#38bdf8", "#e879f9"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="h-4 w-4"
            style={{ borderRadius: 10 }}
          />
          <Text className="text-sm text-white">Normal</Text>
        </View>

        <View className="flex flex-row gap-2 items-center">
          <LinearGradient
            colors={["#e879f9", "#dc2626"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="h-4 w-4"
            style={{ borderRadius: 10 }}
          />
          <Text className="text-sm text-white">Ramai</Text>
        </View>
      </View>

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

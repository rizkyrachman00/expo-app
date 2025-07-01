import { getBranches } from "@/api/branches";
import { Branch } from "@/schemas/subscription.schema";
import { useMemberStore } from "@/stores/member.store";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Alert, Text, View } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import QRCode from "react-native-qrcode-svg";
import { SafeAreaView } from "react-native-safe-area-context";

const BranchQrScreen = () => {
  const { branches, setBranches, selectedBranchId, setSelectedBranchId } =
    useMemberStore();

  const [loading, setLoading] = useState(false);

  // Reset cabang setiap kali screen difokuskan
  useFocusEffect(
    useCallback(() => {
      setSelectedBranchId(null);
    }, [])
  );

  // Fetch cabang jika belum ada
  useEffect(() => {
    const loadBranches = async () => {
      if (branches.length > 0) return;

      try {
        setLoading(true);
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        Alert.alert("Gagal", "Gagal memuat daftar cabang.");
      } finally {
        setLoading(false);
      }
    };

    loadBranches();
  }, []);

  const selectedBranch: Branch | undefined = branches.find(
    (b) => b.id === selectedBranchId
  );

  const qrPayload = selectedBranchId
    ? JSON.stringify({ type: "guest", branchId: selectedBranchId })
    : null;

  return (
    <SafeAreaView className="flex-1 bg-primary px-4 pt-6">
      {/* Header */}
      <View className="flex-row items-center gap-3 mb-6">
        <View className="bg-yellow-500 p-3 rounded-full">
          <Ionicons name="qr-code-outline" size={20} color="black" />
        </View>
        <View>
          <Text className="text-white text-2xl font-bold">QR Check-In</Text>
          <Text className="text-white/60 text-sm">
            Tampilkan QR untuk scan tamu Gym
          </Text>
        </View>
      </View>

      {/* Picker */}
      <View className="bg-white/10 rounded-xl px-4 py-3">
        <RNPickerSelect
          onValueChange={setSelectedBranchId}
          items={branches.map((b) => ({
            label: b.name,
            value: b.id,
          }))}
          placeholder={{ label: "Pilih Cabang...", value: null }}
          value={selectedBranchId}
          useNativeAndroidPickerStyle={false}
          style={{
            inputIOS: { color: "white", fontSize: 16 },
            inputAndroid: { color: "white", fontSize: 16 },
            placeholder: { color: "#aaa" },
          }}
        />
      </View>

      {/* QR Card */}
      <View className="flex-1 justify-center items-center">
        {loading ? (
          <ActivityIndicator size="large" color="white" />
        ) : selectedBranchId ? (
          <View className="bg-white px-6 py-8 rounded-2xl shadow-lg shadow-black/50 items-center w-full max-w-[320px]">
            {/* Nama Cabang */}
            <Text className="text-black text-2xl font-rubik-medium mb-6 text-center">
              {selectedBranch?.name}
            </Text>

            {/* QR */}
            <QRCode value={qrPayload!} size={220} />
            <Text className="text-black/70 mt-4 text-center text-sm">
              Tamu dapat scan QR ini untuk check-in ke cabang
            </Text>
          </View>
        ) : (
          <Text className="text-white/50 text-base text-center">
            Pilih cabang terlebih dahulu
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default BranchQrScreen;

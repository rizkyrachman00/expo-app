import { useAuth } from "@clerk/clerk-expo";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { checkIn } from "@/api/check-in";
import { CheckInPayloadSchema } from "@/schemas/check-in.schema";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckinAdminScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");

  const { getToken } = useAuth({ template: "user_email_role" });
  const router = useRouter();

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white text-lg">Memuat izin kamera...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-black px-6">
        <Text className="text-white text-center text-lg mb-4">
          Akses kamera diperlukan untuk memindai QR code
        </Text>
        <TouchableOpacity
          className="bg-indigo-600 px-6 py-3 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-white font-semibold">Izinkan Kamera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleScan = async ({ data }: { data: string }) => {
    if (scanned || loading) return;
    setScanned(true);
    setLoading(true);

    try {
      const parsed = CheckInPayloadSchema.parse(JSON.parse(data));
      const token = await getToken();
      await checkIn(parsed, token);

      Alert.alert("Berhasil", "Check-in berhasil dilakukan");
      router.back();
    } catch (err: any) {
      Alert.alert("Gagal", "QR tidak valid");
    } finally {
      setLoading(false);
      setTimeout(() => setScanned(false), 3000);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {loading ? (
        // Tampilkan loading fullscreen tanpa CameraView
        <View className="flex-1 justify-center items-center bg-black">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4 text-base">
            Memproses check-in...
          </Text>
        </View>
      ) : (
        <View className="flex-1">
          <CameraView
            style={{ flex: 1 }}
            facing={facing}
            onBarcodeScanned={handleScan}
            barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
          >
            {/* QR Frame */}
            <View className="flex-1 justify-center items-center">
              <View className="w-64 h-64 border-4 border-white rounded-xl" />
            </View>

            {/* Flip Button */}
            <View className="absolute bottom-8 w-full items-center">
              <TouchableOpacity
                onPress={toggleCameraFacing}
                className="bg-gray-900 px-6 py-3 rounded-full"
              >
                <Text className="text-white text-base font-semibold">
                  Flip Kamera
                </Text>
              </TouchableOpacity>
            </View>
          </CameraView>
        </View>
      )}
    </SafeAreaView>
  );
};

export default CheckinAdminScreen;

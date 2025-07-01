import { GuestQrSchema } from "@/schemas/check-in.schema";
import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckInScreen = () => {
  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<"back" | "front">("back");
  const [cameraActive, setCameraActive] = useState(true);
  const [cameraKey, setCameraKey] = useState(0);

  const hasHandledScan = useRef(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setCameraActive(true);
      setLoading(false);
      hasHandledScan.current = false;
      setCameraKey((prev) => prev + 1);
      return () => setCameraActive(false);
    }, [])
  );

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
    if (hasHandledScan.current || loading) return;

    hasHandledScan.current = true;
    setLoading(true);
    setCameraActive(false);

    try {
      const parsed = GuestQrSchema.parse(JSON.parse(data));

      if (parsed.type !== "guest") {
        throw new Error("QR bukan untuk tamu");
      }

      setTimeout(() => {
        router.push({
          pathname: "/check-in/guest",
          params: { branchId: parsed.branchId },
        });
      }, 500);
    } catch (err: any) {
      Alert.alert("Gagal", "QR tidak valid atau bukan untuk tamu", [
        {
          text: "OK",
          onPress: () => {
            hasHandledScan.current = false;
            setCameraActive(true);
          },
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <SafeAreaView className="flex-1 bg-black">
      {loading && !cameraActive ? (
        <View className="flex-1 justify-center items-center bg-black">
          <ActivityIndicator size="large" color="#fff" />
          <Text className="text-white mt-4 text-base">
            Mengalihkan ke form tamu...
          </Text>
        </View>
      ) : cameraActive ? (
        <View className="flex-1 gap-y-8">
          {/* Header */}
          <View className="px-4 py-8 bg-black">
            <View className="flex-row items-center gap-3 mb-2">
              <Ionicons name="qr-code-outline" size={24} color="#facc15" />
              <Text className="text-yellow-400 text-2xl font-rubik-medium">
                Scan QR Tamu
              </Text>
            </View>
            <Text className="text-white/60 text-sm">
              Arahkan kamera ke QR code untuk check-in tamu
            </Text>
          </View>

          {/* Camera */}
          <View className="items-center justify-center">
            <View style={{ width: "100%", aspectRatio: 3 / 4 }}>
              <CameraView
                key={cameraKey}
                style={{ flex: 1 }}
                facing={facing}
                onBarcodeScanned={handleScan}
                barcodeScannerSettings={{ barcodeTypes: ["qr"] }}
              >
                {/* Scan area frame */}
                <View className="flex-1 justify-center items-center">
                  <View className="w-64 h-64 border-4 border-white rounded-xl" />
                </View>

                {/* Flip button */}
                <View className="absolute bottom-12 w-full items-center">
                  <TouchableOpacity
                    onPress={toggleCameraFacing}
                    className="bg-white/20 px-6 py-3 rounded-full"
                  >
                    <Text className="text-white font-semibold">
                      Flip Kamera
                    </Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            </View>
          </View>
        </View>
      ) : (
        <View className="flex-1 bg-black" />
      )}
    </SafeAreaView>
  );
};

export default CheckInScreen;

import { getBranches } from "@/api/branches";
import { checkIn } from "@/api/check-in";
import {
  CheckInPayloadSchema,
  CheckInResponseSchema,
} from "@/schemas/check-in.schema";
import { Branch } from "@/schemas/subscription.schema";
import { useVisitLogStore } from "@/stores/visit.logs.store";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";

const CheckInGuestScreen = () => {
  const { getToken } = useAuth();
  const router = useRouter();
  const { branchId: routeBranchId } = useLocalSearchParams();

  const isBranchParam = typeof routeBranchId === "string";
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string | null>(
    isBranchParam ? routeBranchId : null
  );
  const [loading, setLoading] = useState(false);

  // Fetch branch list
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        Alert.alert("Gagal", "Gagal memuat data cabang.");
      }
    };
    loadBranches();
  }, []);

  const handleSubmit = async () => {
    const payload = {
      type: "guest",
      guestName: guestName.trim(),
      guestPhone: guestPhone.trim(),
      branchId,
    };

    const parsed = CheckInPayloadSchema.safeParse(payload);
    if (!parsed.success) {
      const msg =
        Object.values(parsed.error.flatten().fieldErrors)[0]?.[0] ||
        "Semua kolom wajib diisi.";
      Alert.alert("Validasi Gagal", msg);
      return;
    }

    try {
      setLoading(true);
      const token = await getToken({ template: "user_email_role" });
      const response = await checkIn(parsed.data, token);
      const parsedResponse = CheckInResponseSchema.safeParse(response);

      if (!parsedResponse.success) {
        throw new Error("Respons tidak valid dari server.");
      }

      useVisitLogStore.getState().setShouldRefetch(true);

      Alert.alert("Berhasil", parsedResponse.data.message, [
        { text: "OK", onPress: () => router.replace("/") },
      ]);
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Check-in tamu gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-4 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center gap-4 mb-3">
          <FontAwesome6 name="check-to-slot" size={24} color="#FCA311" />
          <Text className="text-yellow-400 text-3xl font-rubik-bold">
            Check-in Tamu
          </Text>
        </View>

        <View className="h-0.5 bg-white/20 mb-6 rounded-full" />

        {/* Nama Tamu */}
        <View className="mb-5">
          <View className="flex-row items-center mb-2">
            <Feather name="user" size={18} color="#fff" />
            <Text className="text-white font-rubik-medium ml-2">
              Nama Lengkap
            </Text>
          </View>
          <TextInput
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#ccc"
            className="bg-white/10 rounded-xl px-4 py-3 text-white italic"
          />
        </View>

        {/* Nomor HP */}
        <View className="mb-5">
          <View className="flex-row items-center mb-2">
            <Feather name="phone" size={18} color="#fff" />
            <Text className="text-white font-rubik-medium ml-2">
              Nomor HP (WhatsApp)
            </Text>
          </View>
          <TextInput
            value={guestPhone}
            onChangeText={setGuestPhone}
            placeholder="08xxxxxxxxxx"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            className="bg-white/10 rounded-xl px-4 py-3 text-white italic"
          />
        </View>

        {/* Pilih Cabang */}
        <View className="mb-6">
          <View className="flex-row items-center mb-2">
            <Feather name="map-pin" size={18} color="#fff" />
            <Text className="text-white font-rubik-medium ml-2">Cabang</Text>
          </View>
          <View
            className={`bg-white/10 rounded-xl px-4 ${
              isBranchParam ? "opacity-60" : ""
            }`}
          >
            <RNPickerSelect
              onValueChange={(value) => setBranchId(value)}
              items={branches.map((b) => ({
                label: b.name,
                value: b.id,
              }))}
              value={branchId}
              style={{
                inputIOS: { color: "white", paddingVertical: 12 },
                inputAndroid: { color: "white" },
                placeholder: { color: "#ccc" },
              }}
              placeholder={{ label: "Pilih cabang...", value: null }}
              useNativeAndroidPickerStyle={false}
              disabled={isBranchParam}
            />
          </View>
        </View>

        {/* Button */}
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          android_ripple={{ color: "#003f88" }}
          className="bg-blue-600 rounded-xl py-4 flex-row justify-center items-center gap-2 shadow-md"
          style={({ pressed }) => ({
            opacity: pressed || loading ? 0.8 : 1,
          })}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <>
              <Feather name="log-in" size={18} color="white" />
              <Text className="text-white font-rubik-medium text-base">
                Check In
              </Text>
            </>
          )}
        </Pressable>

        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckInGuestScreen;

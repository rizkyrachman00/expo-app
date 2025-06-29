import { getBranches } from "@/api/branches";
import { checkIn } from "@/api/check-in";
import {
  CheckInPayloadSchema,
  CheckInResponseSchema,
} from "@/schemas/check-in.schema";
import { Branch } from "@/schemas/subscription.schema";
import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [branches, setBranches] = useState<Branch[]>([]);
  const [branchId, setBranchId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // get branches
  useEffect(() => {
    const loadBranches = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        Alert.alert("Gagal", "Gagal memuat cabang.");
      }
    };
    loadBranches();
  }, []);

  // handle submit
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

      Alert.alert("Sukses", parsedResponse.data.message);
      router.back();
    } catch (error: any) {
      Alert.alert("Gagal", error.message || "Check-in tamu gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary px-4 pt-6">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className="text-white text-2xl font-rubik-bold mb-6">
          Check-in Tamu
        </Text>

        <View className="mb-4">
          <Text className="text-white font-rubik-medium mb-1">Nama Tamu</Text>
          <TextInput
            value={guestName}
            onChangeText={setGuestName}
            placeholder="Masukkan nama lengkap"
            placeholderTextColor="#ccc"
            className="bg-white/10 rounded-xl px-4 py-3 text-white italic"
          />
        </View>

        <View className="mb-4">
          <Text className="text-white font-rubik-medium mb-1">
            Nomor HP Tamu
          </Text>
          <TextInput
            value={guestPhone}
            onChangeText={setGuestPhone}
            placeholder="08xxxxxxxxxx"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            className="bg-white/10 rounded-xl px-4 py-3 text-white italic"
          />
        </View>

        <View className="mb-6">
          <Text className="text-white font-rubik-medium mb-1">
            Pilih Cabang
          </Text>
          <View className="bg-white/10 rounded-xl px-4">
            <RNPickerSelect
              onValueChange={(value) => setBranchId(value)}
              items={branches.map((b) => ({
                label: b.name,
                value: b.id,
              }))}
              style={{
                inputIOS: { color: "white", paddingVertical: 12 },
                inputAndroid: { color: "white" },
                placeholder: { color: "#ccc" },
              }}
              placeholder={{ label: "Pilih cabang...", value: null }}
              value={branchId}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </View>

        <View className="rounded-xl overflow-hidden">
          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            android_ripple={{ color: "#003f88" }}
            className="bg-blue-500 py-4 flex-row justify-center items-center gap-2"
            style={({ pressed }) => [
              {
                opacity: pressed || loading ? 0.8 : 1,
              },
            ]}
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckInGuestScreen;

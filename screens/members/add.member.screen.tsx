import { AddMemberForm, MemberSchema } from "@/schemas/member.schema";

import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const AddMemberScreen = () => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

  const [form, setForm] = useState<AddMemberForm>({
    name: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { getToken } = useAuth();

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm({ ...form, [field]: value });
  };

  const handleSubmit = async () => {
    const result = MemberSchema.safeParse(form);

    if (!result.success) {
      const firstError = Object.values(
        result.error.flatten().fieldErrors
      )[0]?.[0];
      Alert.alert("Validasi Gagal", firstError || "Periksa kembali data Anda.");
      return;
    }

    const payload = {
      ...result.data,
      email: form.email?.trim() === "" ? null : form.email,
    };

    try {
      setLoading(true);
      const token = await getToken({ template: "user_email_role" });

      const res = await fetch(`${API_BASE_URL}/member`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menambahkan anggota.");
      }

      Alert.alert("Sukses", "Anggota berhasil ditambahkan.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full px-4 pt-6">
      <Text className="text-white text-2xl font-rubik-bold mb-6">Tambah Anggota</Text>

      <View className="gap-4">
        {/* Name */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-bold mb-1">Nama</Text>
          <TextInput
            placeholder="Masukkan nama"
            placeholderTextColor="#ccc"
            className="text-white"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>

        {/* Phone */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-bold mb-1">Nomor HP</Text>
          <TextInput
            placeholder="08xxxxxxxxxx"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            className="text-white"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />
        </View>

        {/* Email */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-bold mb-1">Email (Opsional)</Text>
          <TextInput
            placeholder="nama@email.com"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            className="text-white"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>
      </View>

      {/* Submit button */}
      <View className="mt-8">
        <LinearGradient
          colors={["#38bdf8", "#e879f9"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="w-3/4 mx-auto py-3 items-center"
          style={{ borderRadius: 12 }}
        >
          <Pressable
            onPress={handleSubmit}
            className="py-3 items-center rounded-full"
            android_ripple={{ color: "#ffffff20", borderless: true }}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-rubik-bold">
                Tambah Anggota
              </Text>
            )}
          </Pressable>
        </LinearGradient>
      </View>
    </SafeAreaView>
  );
};

export default AddMemberScreen;

import { MemberSchema, type AddMemberForm } from "@/schemas/member.schema";
import { useAuth } from "@clerk/clerk-expo";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import RNPickerSelect from "react-native-picker-select";
import { SafeAreaView } from "react-native-safe-area-context";

const AddMemberScreen = () => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
  const { getToken } = useAuth();
  const router = useRouter();

  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState<{
    startDate: string | null;
    endDate: string | null;
    markedDates: Record<string, any>;
  }>({
    startDate: null,
    endDate: null,
    markedDates: {},
  });

  const [branches, setBranches] = useState<
    { id: AddMemberForm["branchIds"][number]; name: string }[]
  >([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [form, setForm] = useState<
    Omit<AddMemberForm, "branchIds"> & { branchId: string }
  >({
    name: "",
    phone: "",
    email: "",
    branchId: "",
    activeSince: "",
    activeUntil: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (
    field: keyof typeof form,
    value: string | Date | null
  ) => {
    setForm({ ...form, [field]: value });
  };

  const fetchBranches = async () => {
    try {
      setLoadingBranches(true);
      const res = await fetch(`${API_BASE_URL}/branches`);
      const data = await res.json();
      setBranches(data);
    } catch {
      Alert.alert("Error", "Gagal memuat cabang.");
    } finally {
      setLoadingBranches(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const generateMarkedDates = (start: string, end: string) => {
    const dates: Record<string, any> = {};

    let current = new Date(start);
    const endDate = new Date(end);

    while (current <= endDate) {
      const dateStr = current.toISOString().split("T")[0];
      dates[dateStr] = {
        color: "#60a5fa",
        textColor: "white",
      };
      current.setDate(current.getDate() + 1);
    }

    dates[start] = {
      ...dates[start],
      startingDay: true,
    };

    dates[end] = {
      ...dates[end],
      endingDay: true,
    };

    return dates;
  };

  const onDayPress = (day: { dateString: string }) => {
    const { dateString } = day;

    if (!range.startDate || (range.startDate && range.endDate)) {
      // Mulai baru
      setRange({
        startDate: dateString,
        endDate: null,
        markedDates: {
          [dateString]: {
            startingDay: true,
            color: "#60a5fa",
            textColor: "white",
          },
        },
      });
    } else {
      // Akhiri range
      const start = new Date(range.startDate);
      const end = new Date(dateString);

      if (start > end) {
        // Jika user pilih akhir lebih awal, tukar
        setRange({
          startDate: dateString,
          endDate: range.startDate,
          markedDates: generateMarkedDates(dateString, range.startDate),
        });
      } else {
        setRange({
          startDate: range.startDate,
          endDate: dateString,
          markedDates: generateMarkedDates(range.startDate, dateString),
        });
      }
    }
  };

  const handleSubmit = async () => {
    const payload: AddMemberForm = {
      ...form,
      branchIds: [form.branchId],
      email: form.email?.trim() === "" ? undefined : form.email,
      activeSince: range.startDate
        ? new Date(range.startDate).toISOString()
        : "",
      activeUntil: range.endDate ? new Date(range.endDate).toISOString() : "",
    };

    const result = MemberSchema.safeParse(payload);

    if (!result.success) {
      const firstError = Object.values(
        result.error.flatten().fieldErrors
      )[0]?.[0];
      Alert.alert("Validasi Gagal", firstError || "Periksa kembali data Anda.");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken({ template: "user_email_role" });

      const res = await fetch(`${API_BASE_URL}/subscription`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          member: {
            name: form.name,
            phone: form.phone,
            email: payload.email,
          },
          branchIds: payload.branchIds,
          activeSince: payload.activeSince,
          activeUntil: payload.activeUntil,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Gagal menambahkan member baru.");
      }

      Alert.alert("Sukses", "Member berhasil ditambahkan.");
      router.back();
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full px-4 pt-6">
      <Text className="text-white text-2xl font-rubik-bold mb-6">
        Tambah Anggota
      </Text>

      <View className="gap-4">
        {/* Name */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">Nama</Text>
          <TextInput
            placeholder="Masukkan nama"
            placeholderTextColor="#ccc"
            className="text-white bg-white/10 rounded-2xl p-4 italic"
            value={form.name}
            onChangeText={(text) => handleChange("name", text)}
          />
        </View>

        {/* Phone */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">Nomor HP</Text>
          <TextInput
            placeholder="08xxxxxxxxxx"
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            className="text-white bg-white/10 rounded-2xl p-4 italic"
            value={form.phone}
            onChangeText={(text) => handleChange("phone", text)}
          />
        </View>

        {/* Email */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">
            Email (Opsional)
          </Text>
          <TextInput
            placeholder="nama@email.com"
            placeholderTextColor="#ccc"
            keyboardType="email-address"
            autoCapitalize="none"
            className="text-white bg-white/10 rounded-2xl p-4 italic"
            value={form.email}
            onChangeText={(text) => handleChange("email", text)}
          />
        </View>

        {/* Branch Picker (single select) */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">Cabang</Text>

          {loadingBranches ? (
            <Skeleton height={50} width={"100%"} colorMode="dark" radius={12} />
          ) : (
            <View className="bg-white/10 rounded-2xl p-2">
              <RNPickerSelect
                placeholder={{
                  label: "Pilih cabang",
                  value: "",
                  color: "#ccc",
                }}
                onValueChange={(value) => handleChange("branchId", value)}
                items={branches.map((b) => ({ label: b.name, value: b.id }))}
                value={form.branchId}
                useNativeAndroidPickerStyle={false}
                style={{
                  inputIOS: {
                    color: "white",
                    fontStyle: "italic",
                  },
                  inputAndroid: {
                    color: "white",
                    fontStyle: "italic",
                  },
                  placeholder: {
                    color: "#ccc",
                    fontStyle: "italic",
                  },
                }}
              />
            </View>
          )}
        </View>

        {/* Rentang Tanggal Input (Simulasi) */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">
            Rentang Tanggal
          </Text>
          <Pressable
            onPress={() => setShowCalendar(true)}
            className="bg-white/10 rounded-2xl p-4"
          >
            <Text className="text-white italic">
              {range.startDate && range.endDate
                ? `${new Date(
                    range.startDate
                  ).toLocaleDateString()} - ${new Date(
                    range.endDate
                  ).toLocaleDateString()}`
                : "Pilih rentang tanggal"}
            </Text>
          </Pressable>
        </View>

        {/* Modal untuk Calendar */}
        <Modal
          isVisible={showCalendar}
          onBackdropPress={() => setShowCalendar(false)}
          onBackButtonPress={() => setShowCalendar(false)} // Android back button
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <View className="bg-white rounded-xl p-4 w-[90%] max-h-[80%]">
            <Text className="text-black font-rubik-medium text-xl mb-4">
              Pilih Rentang Tanggal
            </Text>

            <Calendar
              markingType="period"
              markedDates={range.markedDates}
              onDayPress={onDayPress}
            />

            <Pressable
              onPress={() => setShowCalendar(false)}
              className="mt-4 bg-blue-500 py-3 px-6 rounded-full items-center"
            >
              <Text className="text-white font-rubik-medium">OK</Text>
            </Pressable>
          </View>
        </Modal>
      </View>

      {/* Submit Button */}
      <LinearGradient
        colors={["#38bdf8", "#e879f9"]}
        start={{ x: 0, y: 0.5 }}
        end={{ x: 1, y: 0.5 }}
        className="mt-8 w-3/4 mx-auto rounded-2xl overflow-hidden"
      >
        <Pressable
          onPress={handleSubmit}
          disabled={loading}
          className="py-3 px-6 flex-row items-center justify-center gap-3"
          android_ripple={{ color: "#003f88", borderless: false }}
        >
          {({ pressed }) => (
            <View
              className={`${
                pressed ? "opacity-80" : "opacity-100"
              } flex-row items-center gap-3`}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <>
                  <Feather name="user-plus" size={20} color="white" />
                  <Text className="text-white text-lg leading-none font-rubik-medium">
                    Create Member
                  </Text>
                </>
              )}
            </View>
          )}
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default AddMemberScreen;

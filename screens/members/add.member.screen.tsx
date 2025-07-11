import { getBranches } from "@/api/branches";
import { createSubscription } from "@/api/subscriptions";
import { type AddMemberForm } from "@/schemas/member.schema";
import {
  AddSubscriptionPayload,
  AddSubscriptionPayloadSchema,
} from "@/schemas/subscription.schema";
import { useMemberStore } from "@/stores/member.store";
import {
  formatDate,
  formatIndoDate,
  generateMarkedDates,
  getOneMonthLater,
  getToday,
} from "@/utils/dateHelpers";
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
import { SafeAreaView } from "react-native-safe-area-context";

const AddMemberScreen = () => {
  const { getToken } = useAuth();
  const router = useRouter();

  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState<{
    startDate: string | null;
    endDate: string | null;
    markedDates: Record<string, any>;
  }>(() => {
    const start = formatDate(getToday());
    const end = formatDate(getOneMonthLater());
    return {
      startDate: start,
      endDate: end,
      markedDates: generateMarkedDates(start, end),
    };
  });

  const [branches, setBranches] = useState<
    { id: AddMemberForm["branchIds"][number]; name: string }[]
  >([]);
  const [loadingBranches, setLoadingBranches] = useState(true);

  const [form, setForm] = useState<
    Omit<AddMemberForm, "branchIds"> & { branchIds: string[] }
  >({
    name: "",
    phone: "",
    email: "",
    branchIds: [],
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

  useEffect(() => {
    const loadBranches = async () => {
      try {
        setLoadingBranches(true);
        const data = await getBranches();
        setBranches(data);
      } catch (error) {
        Alert.alert("Error", "Gagal memuat cabang.");
      } finally {
        setLoadingBranches(false);
      }
    };

    loadBranches();
  }, []);

  const onDayPress = (day: { dateString: string }) => {
    const { dateString } = day;

    if (!range.startDate || (range.startDate && range.endDate)) {
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
      const start = new Date(range.startDate);
      const end = new Date(dateString);

      if (start > end) {
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

  // Handle form submission
  const handleSubmit = async () => {
    const payload: AddSubscriptionPayload = {
      member: {
        name: form.name,
        phone: form.phone,
        email: form.email?.trim() === "" ? undefined : form.email,
      },
      branchIds: form.branchIds,
      activeSince: range.startDate
        ? new Date(range.startDate).toISOString()
        : "",
      activeUntil: range.endDate ? new Date(range.endDate).toISOString() : "",
    };

    const result = AddSubscriptionPayloadSchema.safeParse(payload);

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

      await createSubscription(payload, token);

      useMemberStore.getState().setShouldRefetch(true);

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

        {/* Multi-Select Branch */}
        <View className="bg-white/10 rounded-xl px-4 py-3">
          <Text className="text-white font-rubik-medium mb-1">
            Pilih Cabang
          </Text>
          {loadingBranches ? (
            <View className="gap-2">
              <Skeleton
                height={40}
                width={"100%"}
                radius={10}
                colorMode="dark"
              />
              <Skeleton
                height={40}
                width={"100%"}
                radius={10}
                colorMode="dark"
              />
            </View>
          ) : (
            branches.map((branch) => {
              const isSelected = form.branchIds.includes(branch.id);
              return (
                <Pressable
                  key={branch.id}
                  onPress={() =>
                    setForm((prev) => ({
                      ...prev,
                      branchIds: isSelected
                        ? prev.branchIds.filter((id) => id !== branch.id)
                        : [...prev.branchIds, branch.id],
                    }))
                  }
                  className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-2 ${
                    isSelected ? "bg-blue-500/30" : "bg-white/10"
                  }`}
                >
                  <Text className="text-white">{branch.name}</Text>
                  {isSelected && (
                    <Feather name="check" size={18} color="white" />
                  )}
                </Pressable>
              );
            })
          )}
        </View>

        {/* Rentang Tanggal Input */}
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
                ? `${formatIndoDate(range.startDate)} - ${formatIndoDate(
                    range.endDate
                  )}`
                : "Pilih rentang tanggal"}
            </Text>
          </Pressable>
        </View>

        {/* Modal Calendar */}
        <Modal
          isVisible={showCalendar}
          onBackdropPress={() => setShowCalendar(false)}
          onBackButtonPress={() => setShowCalendar(false)}
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

      {/* Submit */}
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

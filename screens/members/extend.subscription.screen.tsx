import { Branch } from "@/schemas/subscription.schema";
import { useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, Pressable, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBranches } from "@/api/branches";
import { extendSubscription } from "@/api/subscriptions";
import { useMemberStore } from "@/stores/member.store";
import {
  formatDate,
  formatIndoDate,
  generateMarkedDates,
  getOneMonthLater,
  getToday,
} from "@/utils/dateHelpers";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

const ExtendSubscriptionScreen = () => {
  const { id, cardId } = useLocalSearchParams<{ id: string; cardId: string }>();
  const { getToken } = useAuth();
  const router = useRouter();

  const [branches, setBranches] = useState<Branch[]>([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [selectedBranches, setSelectedBranches] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [range, setRange] = useState<{
    startDate: string;
    endDate: string | null;
    markedDates: Record<string, any>;
  }>({
    startDate: formatDate(getToday()),
    endDate: formatDate(getOneMonthLater()),
    markedDates: generateMarkedDates(
      formatDate(getToday()),
      formatDate(getOneMonthLater())
    ),
  });

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await getBranches();
        setBranches(data);
      } catch {
        Alert.alert("Error", "Gagal mengambil cabang");
      } finally {
        setLoadingBranches(false);
      }
    };
    fetch();
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

  const handleSubmit = async () => {
    // Validasi input
    if (!cardId || !/^[0-9a-fA-F\-]{36}$/.test(cardId)) {
      Alert.alert("Error", "ID kartu member tidak valid");
      return;
    }

    if (selectedBranches.length === 0) {
      Alert.alert("Error", "Minimal pilih satu cabang");
      return;
    }

    if (!range.startDate || !range.endDate) {
      Alert.alert("Error", "Rentang tanggal belum lengkap");
      return;
    }

    try {
      setLoading(true);
      const token = await getToken({ template: "user_email_role" });

      const payload = {
        membershipCardId: cardId,
        activeSince: new Date(range.startDate).toISOString(),
        activeUntil: new Date(range.endDate).toISOString(),
        branches: selectedBranches,
      };

      await extendSubscription(payload, token);

      Alert.alert("Sukses", "Subscription berhasil diperpanjang");

      useMemberStore.getState().setShouldRefetch(true);

      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full px-4 pt-6">
      <Text className="text-white text-2xl font-rubik-bold mb-6">
        Perpanjang Subscription
      </Text>

      {/* select branch */}
      <View className="bg-white/10 rounded-xl px-4 py-4 mb-4">
        <View className="flex-row items-center mb-2">
          <MaterialCommunityIcons
            name="office-building"
            size={18}
            color="#fff"
          />
          <Text className="ml-2 text-white font-rubik-medium text-base">
            Pilih Cabang
          </Text>
        </View>

        {loadingBranches ? (
          <View className="gap-y-2">
            <Skeleton height={40} width="100%" radius={10} colorMode="dark" />
            <Skeleton height={40} width="100%" radius={10} colorMode="dark" />
          </View>
        ) : (
          branches.map((branch) => {
            const isSelected = selectedBranches.includes(branch.id);
            return (
              <Pressable
                key={branch.id}
                onPress={() => {
                  setSelectedBranches((prev) =>
                    isSelected
                      ? prev.filter((id) => id !== branch.id)
                      : [...prev, branch.id]
                  );
                }}
                className={`flex-row items-center justify-between px-4 py-3 rounded-xl mb-2 ${
                  isSelected ? "bg-blue-500/30" : "bg-white/10"
                }`}
              >
                <Text className="text-white">{branch.name}</Text>
                {isSelected && <Feather name="check" size={18} color="white" />}
              </Pressable>
            );
          })
        )}
      </View>

      {/* Rentang Tanggal */}
      <View className="bg-white/10 rounded-xl px-4 py-4">
        <View className="flex-row items-center mb-5">
          <Entypo name="calendar" size={18} color="#fff" />
          <Text className="ml-2 text-white font-rubik-medium text-base">
            Rentang Tanggal
          </Text>
        </View>

        <Pressable
          onPress={() => setShowCalendar(true)}
          className="flex-row items-center bg-white/5 rounded-lg px-4 py-3"
        >
          <Text className="ml-3 text-white italic font-rubik">
            {range.startDate && range.endDate
              ? `${formatIndoDate(range.startDate)} - ${formatIndoDate(
                  range.endDate
                )}`
              : "Pilih rentang tanggal"}
          </Text>
        </Pressable>
      </View>

      {/* Calendar Modal */}
      <Modal
        isVisible={showCalendar}
        onBackdropPress={() => setShowCalendar(false)}
      >
        <View className="bg-white p-4 rounded-xl">
          <Calendar
            markingType="period"
            markedDates={range.markedDates}
            onDayPress={onDayPress}
          />
          <Pressable
            onPress={() => setShowCalendar(false)}
            className="mt-4 bg-blue-500 py-2 rounded-full items-center"
          >
            <Text className="text-white font-rubik-bold">OK</Text>
          </Pressable>
        </View>
      </Modal>

      <LinearGradient
        colors={["#ff7b00", "#2ec4b6"]}
        className="mt-8 rounded-2xl overflow-hidden self-center px-8"
      >
        <Pressable onPress={handleSubmit} disabled={loading}>
          {({ pressed }) => (
            <View
              className={`h-12 min-w-[220px] flex-row items-center justify-center ${
                pressed ? "opacity-85 scale-95" : "opacity-100 scale-100"
              }`}
            >
              {loading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="#fff" />
                </View>
              ) : (
                <View className="flex-row items-center gap-2">
                  <Feather name="check-circle" size={18} color="white" />
                  <Text className="text-white font-rubik-medium text-md">
                    Perpanjang Subscription
                  </Text>
                </View>
              )}
            </View>
          )}
        </Pressable>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ExtendSubscriptionScreen;

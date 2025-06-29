import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { checkIn } from "@/api/check-in";
import { getSubscriptions } from "@/api/subscriptions";
import { useMemberStore } from "@/stores/member.store";
import { getBranchLabel } from "@/utils/branch.helper";
import { formatIndoDate } from "@/utils/dateHelpers";
import { useAuth } from "@clerk/clerk-expo";

const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { members, shouldRefetch, setShouldRefetch, setMembers } =
    useMemberStore();
  const router = useRouter();
  const { getToken } = useAuth();

  const member = useMemo(() => {
    return members.find((m) => m.member.id === id);
  }, [id, members]);

  // state untuk loading check-in
  const [isLoading, setIsLoading] = useState(false);

  // refetch data member jika ada perubahan
  useEffect(() => {
    const refetchData = async () => {
      try {
        const token = await getToken({ template: "user_email_role" });
        const updatedMembers = await getSubscriptions(token);
        setMembers(updatedMembers);
      } catch (err) {
        console.error("Gagal refetch data:", err);
      } finally {
        setShouldRefetch(false);
      }
    };

    if (shouldRefetch) {
      refetchData();
    }
  }, [shouldRefetch]);

  // handle check-in member
  const handleCheckIn = async () => {
    if (!member) {
      Alert.alert("Error", "Data member tidak ditemukan.");
      return;
    }

    const memberId = member.member.id;
    const subscription = member.subscriptions?.[0];
    const branchId = subscription?.branches?.[0]?.id;

    if (!subscription?.membershipCard?.id || !branchId) {
      Alert.alert(
        "Tidak dapat check-in",
        "Member belum memiliki kartu atau tidak memiliki akses ke cabang terkait."
      );
      return;
    }

    try {
      setIsLoading(true);
      const token = await getToken({ template: "user_email_role" });

      const res = await checkIn({ type: "member", memberId, branchId }, token);

      Alert.alert("Sukses", res.message);
    } catch (error: any) {
      if (error.message.includes("tidak memiliki izin")) {
        Alert.alert(
          "Tidak Memiliki Izin",
          "Member tidak memiliki akses ke cabang ini. Lanjutkan check-in sebagai tamu.",
          [
            {
              text: "Isi Form Tamu",
              onPress: () => router.push("/check-in/guest"),
            },
            { text: "Batal", style: "cancel" },
          ]
        );
      } else {
        Alert.alert("Gagal", error.message || "Terjadi kesalahan.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!member) {
    return (
      <SafeAreaView className="bg-primary flex-1 items-center justify-center">
        <Text className="text-white">Member tidak ditemukan.</Text>
      </SafeAreaView>
    );
  }

  const { name, phone, email } = member.member;

  return (
    <SafeAreaView className="bg-primary flex-1">
      <ScrollView className="px-4 pt-6">
        {/* Avatar dan Nama */}
        <View className="items-center mb-6">
          <Image
            source={{
              uri: `https://ui-avatars.com/api/?name=${name}`,
            }}
            className="w-24 h-24 rounded-full bg-white/20"
          />
          <Text className="mt-4 text-white font-rubik-bold text-xl">
            {name}
          </Text>
        </View>

        {/* buttons actions Check In, Extend Subscription */}
        <View className="flex-row justify-center gap-4 mb-7 mx-10">
          {/* Check In */}
          <View className="flex-1 overflow-hidden rounded-xl">
            <Pressable
              disabled={isLoading}
              onPress={handleCheckIn}
              android_ripple={{ color: "#003f88" }}
            >
              {({ pressed }) => (
                <View
                  className={`flex-row items-center justify-center gap-2 px-4 py-3 bg-blue-500 rounded-xl ${
                    pressed || isLoading ? "opacity-80" : "opacity-100"
                  }`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" size="small" />
                  ) : (
                    <>
                      <Feather name="log-in" size={18} color="white" />
                      <Text className="text-white font-rubik">Check In</Text>
                    </>
                  )}
                </View>
              )}
            </Pressable>
          </View>

          {/* Extend Subscription */}
          <View className="flex-1 overflow-hidden rounded-xl">
            <Pressable
              onPress={() => {
                const memberId = member.member.id;
                const cardId = member.subscriptions?.[0]?.membershipCard?.id;

                if (!cardId) {
                  Alert.alert(
                    "Data tidak valid",
                    "Member belum memiliki kartu."
                  );
                  return;
                }

                router.push(
                  `/members/extendSubscription?id=${memberId}&cardId=${cardId}`
                );
              }}
              android_ripple={{ color: "#0d6833" }}
            >
              {({ pressed }) => (
                <View
                  className={`flex-row items-center justify-center gap-2 px-4 py-3 bg-green-500 ${
                    pressed ? "opacity-80" : "opacity-100"
                  }`}
                >
                  <MaterialCommunityIcons
                    name="calendar-plus"
                    size={18}
                    color="white"
                  />
                  <Text className="text-white font-rubik">Perpanjang</Text>
                </View>
              )}
            </Pressable>
          </View>
        </View>

        <Text className="text-white font-rubik-bold text-lg mb-2">
          Informasi Kontak
        </Text>

        {/* Kontak */}
        <View className="bg-white/10 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center mb-3">
            <AntDesign name="phone" size={16} color="white" />
            <Text className="ml-2 text-white font-rubik">{phone || "-"}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="email" size={16} color="white" />
            <Text className="ml-2 text-white font-rubik">{email || "-"}</Text>
          </View>
        </View>

        {/* Riwayat Subscription */}
        <Text className="text-white font-rubik-bold text-lg mb-2">
          Riwayat Subscription
        </Text>

        {member.subscriptions.length === 0 ? (
          <Text className="text-white/70">Belum ada data subscription.</Text>
        ) : (
          <FlatList
            scrollEnabled={false}
            data={member.subscriptions}
            keyExtractor={(_, index) => index.toString()}
            renderItem={({ item }) => {
              const isActive =
                new Date(item.subscription.activeUntil) > new Date();

              return (
                <View className="mb-4 bg-white/10 rounded-2xl px-4 py-5 shadow-md shadow-black/20">
                  {/* Cabang dan Status */}
                  <View className="flex-row justify-between items-center mb-3">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name="location-on"
                        size={16}
                        color="#fff"
                      />
                      <Text className="text-white font-rubik-bold text-base">
                        {item.branches
                          .map((b) => getBranchLabel(b.identifier, b.name))
                          .join(", ")}
                      </Text>
                    </View>

                    <View
                      className={`flex-row items-center gap-1 px-3 py-1 rounded-full ${
                        isActive ? "bg-green-600" : "bg-red-500"
                      }`}
                    >
                      <MaterialIcons
                        name={isActive ? "check-circle" : "cancel"}
                        size={14}
                        color="#fff"
                      />
                      <Text className="text-white text-xs font-rubik">
                        {isActive ? "Aktif" : "Nonaktif"}
                      </Text>
                    </View>
                  </View>

                  {/* Tanggal Aktif */}
                  <View className="flex-row items-center gap-2">
                    <MaterialIcons
                      name="calendar-month"
                      size={16}
                      color="#ccc"
                    />
                    <Text className="text-white/70 text-sm">
                      {formatIndoDate(item.subscription.activeSince)} –{" "}
                      {formatIndoDate(item.subscription.activeUntil)}
                    </Text>
                  </View>
                </View>
              );
            }}
          />
        )}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  );
};

export default MemberDetailScreen;

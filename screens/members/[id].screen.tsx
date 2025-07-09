import {
  AntDesign,
  Feather,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
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
import { deleteSubscription, getSubscriptions } from "@/api/subscriptions";
import { useMemberStore } from "@/stores/member.store";
import { getBranchLabel } from "@/utils/branch.helper";
import { formatIndoDate } from "@/utils/dateHelpers";
import { useAuth } from "@clerk/clerk-expo";

import MembershipCard from "@/components/member/membership.card";
import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";

const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    members,
    shouldRefetch,
    setShouldRefetch,
    setMembers,
    selectedBranchId,
    setSelectedBranchId,
  } = useMemberStore();

  const router = useRouter();
  const navigation = useNavigation();
  const { getToken } = useAuth();

  // state untuk bottom sheet revoke subscription
  const [selectedSubscriptionId, setSelectedSubscriptionId] = useState<
    string | null
  >(null);
  const [isRevoking, setIsRevoking] = useState(false);
  const revokeSheetRef = useRef<BottomSheet>(null);

  // fungsi untuk revoke subscription
  const handleRevokeSubscription = async () => {
    if (!selectedSubscriptionId) return;

    try {
      setIsRevoking(true);
      const token = await getToken({ template: "user_email_role" });
      await deleteSubscription(selectedSubscriptionId, token);

      // Refetch setelah sukses
      const updated = await getSubscriptions(token);
      setMembers(updated);

      Alert.alert("Sukses", "Subscription berhasil dinonaktifkan.");
      revokeSheetRef.current?.close();
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Terjadi kesalahan saat revoke.");
    } finally {
      setIsRevoking(false);
      setSelectedSubscriptionId(null);
    }
  };

  const member = useMemo(() => {
    return members.find((m) => m.member.id === id);
  }, [id, members]);

  // state untuk loading check-in
  const [isLoading, setIsLoading] = useState(false);

  // state untuk bottom sheet select branch
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [availableBranches, setAvailableBranches] = useState<
    { name: string; identifier: string }[]
  >([]);

  // reset selected branch ID saat keluar dari screen
  useEffect(() => {
    const unsubscribe = navigation.addListener("beforeRemove", () => {
      // Reset selected branch ID saat keluar dari detail
      setSelectedBranchId(null);
    });

    return unsubscribe;
  }, [navigation]);

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

    if (!selectedBranchId) {
      const branches = member.subscriptions.flatMap((sub) =>
        sub.branches.map((b) => ({
          identifier: b.identifier,
          name: b.name,
        }))
      );

      const uniqueBranches = Array.from(
        new Map(branches.map((b) => [b.identifier, b])).values()
      );

      setAvailableBranches(uniqueBranches);

      if (uniqueBranches.length === 0) {
        Alert.alert(
          "Tidak Ada Akses",
          "Member ini tidak memiliki akses ke cabang manapun."
        );
        return;
      }

      bottomSheetRef.current?.snapToIndex(1);

      return;
    }

    const matchedSubscription = member.subscriptions.find((sub) => {
      const isStillValid =
        new Date(sub.subscription.activeUntil) > new Date() &&
        sub.subscription.deletedAt == null;

      const hasAccessToBranch = sub.branches.some(
        (b) => b.identifier === selectedBranchId
      );

      return isStillValid && hasAccessToBranch;
    });

    console.log("Selected:", selectedBranchId);
    console.log(
      "Subscription branch identifiers:",
      matchedSubscription?.branches.map((b) => b.identifier)
    );

    if (!matchedSubscription) {
      const selectedBranch = availableBranches.find(
        (b) => b.identifier === selectedBranchId
      );

      const branchLabel = getBranchLabel(
        selectedBranch?.identifier ?? "",
        selectedBranch?.name ?? "-"
      );

      Alert.alert(
        "Akses Ditolak",
        `Member tidak memiliki akses ke cabang "${branchLabel}".`
      );
      return;
    }

    const matchedBranch = matchedSubscription.branches.find(
      (b) => b.identifier === selectedBranchId
    );

    if (!matchedBranch || !matchedSubscription.membershipCard?.id) {
      Alert.alert(
        "Tidak dapat check-in",
        "Data kartu atau cabang tidak valid."
      );
      return;
    }

    const branchId = matchedBranch.id;
    const subscriptionId = matchedSubscription.subscription.id;

    try {
      setIsLoading(true);
      const token = await getToken({ template: "user_email_role" });

      const res = await checkIn(
        { type: "member", memberId, branchId, subscriptionId },
        token
      );

      // Jika tidak ada cabang untuk ditampilkan, tutup drawer sepenuhnya
      if (availableBranches.length === 0) {
        bottomSheetRef.current?.close();
      } else {
        bottomSheetRef.current?.snapToIndex(0);
      }

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
        <View className="bg-white/10 rounded-2xl p-4 mb-4">
          <View className="flex-row items-center mb-3">
            <AntDesign name="phone" size={16} color="white" />
            <Text className="ml-2 text-white font-rubik">{phone || "-"}</Text>
          </View>
          <View className="flex-row items-center">
            <MaterialIcons name="email" size={16} color="white" />
            <Text className="ml-2 text-white font-rubik">{email || "-"}</Text>
          </View>
        </View>

        {/* Kartu Member */}
        <Text className="text-white font-rubik-bold text-lg mb-2">
          Kartu Member
        </Text>
        <MembershipCard member={member} />

        {/* Riwayat Subscription */}
        <Text className="text-white font-rubik-bold text-lg mb-2 mt-4">
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
                new Date(item.subscription.activeUntil) > new Date() &&
                item.subscription.deletedAt === null;

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

                  {/* Tanggal Aktif + Tombol Revoke */}
                  <View className="flex-row justify-between items-center mt-1">
                    {/* Tanggal */}
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons
                        name="calendar-month"
                        size={16}
                        color="#ccc"
                      />
                      <Text className="text-white/70 text-sm font-rubik">
                        {formatIndoDate(item.subscription.activeSince)} –{" "}
                        {formatIndoDate(item.subscription.activeUntil)}
                      </Text>
                    </View>

                    {/* Tombol Revoke hanya jika aktif */}
                    {isActive && (
                      <Pressable
                        onPress={() => {
                          setSelectedSubscriptionId(item.subscription.id);
                          revokeSheetRef.current?.snapToIndex(0);
                        }}
                        className="rounded-xl overflow-hidden"
                      >
                        {({ pressed }) => (
                          <View
                            className={`px-3 py-1 ${
                              pressed ? "bg-red-700" : "bg-red-600"
                            } rounded-xl`}
                          >
                            <Text className="text-white text-sm font-rubik">
                              Revoke Subscription
                            </Text>
                          </View>
                        )}
                      </Pressable>
                    )}
                  </View>
                </View>
              );
            }}
          />
        )}

        <View className="h-10" />
      </ScrollView>

      {/* Drawer Branch Selection */}
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["10%", "20%", "40%", "70%"]}
        index={-1}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: "#ffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View className="p-4 flex-1 bg-primary">
          <Text className="text-white font-rubik-bold text-base mb-4 text-center">
            Pilih Cabang Akses
          </Text>

          <BottomSheetFlatList
            data={availableBranches}
            keyExtractor={(item) => item.identifier}
            ItemSeparatorComponent={() => <View className="h-px bg-white/10" />}
            ListFooterComponent={
              selectedBranchId ? (
                <View className="mt-9 mx-4 mb-6 overflow-hidden rounded-xl">
                  <Pressable
                    disabled={isLoading}
                    onPress={handleCheckIn}
                    android_ripple={{ color: "#065f46" }}
                  >
                    {({ pressed }) => (
                      <View
                        className={`flex-row items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-600 ${
                          pressed || isLoading ? "opacity-80" : "opacity-100"
                        }`}
                      >
                        {isLoading ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <Text className="text-white text-center font-semibold">
                            Lanjutkan Check-In
                          </Text>
                        )}
                      </View>
                    )}
                  </Pressable>
                </View>
              ) : null
            }
            renderItem={({ item }) => {
              const isSelected = selectedBranchId === item.identifier;

              return (
                <Pressable
                  onPress={() => {
                    setSelectedBranchId(item.identifier);
                  }}
                  android_ripple={{ color: "#334155" }}
                  className="flex-row items-center justify-between px-4 py-3"
                >
                  <View className="flex-row items-center gap-3">
                    <Feather name="map-pin" size={18} color="white" />
                    <Text className="text-white font-rubik text-base">
                      {item.name}
                    </Text>
                  </View>

                  {isSelected && (
                    <Feather name="check" size={18} color="#10b981" />
                  )}
                </Pressable>
              );
            }}
          />
        </View>
      </BottomSheet>

      {/* Drawer Konfirmasi Revoke Subscription */}
      <BottomSheet
        ref={revokeSheetRef}
        snapPoints={["20%", "40%"]}
        index={-1}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backgroundStyle={{
          backgroundColor: "#ffff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
        }}
      >
        <View className="flex-1 bg-primary p-6 items-center justify-center">
          {/* Ikon Warning */}
          <View className="bg-red-100 p-4 rounded-full mb-4">
            <MaterialIcons name="warning" size={36} color="#dc2626" />
          </View>

          {/* Judul */}
          <Text className="text-center text-lg font-rubik-bold text-red-600 mb-2">
            Yakin ingin menonaktifkan subscription ini?
          </Text>

          {/* Deskripsi */}
          <Text className="text-center text-white font-rubik mb-6">
            Aksi ini tidak bisa dibatalkan. Member tidak akan bisa check-in di
            cabang terkait.
          </Text>

          {/* Tombol Aksi */}
          <View className="flex-row gap-3 w-full">
            {/* Batal */}
            <Pressable
              onPress={() => revokeSheetRef.current?.close()}
              className="flex-1 rounded-xl border border-gray-300 py-3 justify-center items-center"
            >
              <Text className="text-gray-600 font-rubik">Batal</Text>
            </Pressable>

            {/* Ya, Nonaktifkan */}
            <Pressable
              onPress={handleRevokeSubscription}
              disabled={isRevoking}
              className="flex-1 rounded-xl bg-red-600 py-3 justify-center items-center"
              android_ripple={{ color: "#7f1d1d" }}
            >
              {isRevoking ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text className="text-white font-rubik">Ya, Nonaktifkan</Text>
              )}
            </Pressable>
          </View>
        </View>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default MemberDetailScreen;

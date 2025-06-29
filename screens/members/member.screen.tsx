import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import Carousel from "react-native-reanimated-carousel";
import { SafeAreaView } from "react-native-safe-area-context";

import { getBranches } from "@/api/branches";
import { getSubscriptions } from "@/api/subscriptions";
import { carouselImages } from "@/constants/data/carousel.image";
import { useMemberStore } from "@/stores/member.store";
import { getBranchLabel, getGradientColors } from "@/utils/branch.helper";
import { useAuth } from "@clerk/clerk-expo";
import { router, useFocusEffect } from "expo-router";
import { Skeleton } from "moti/skeleton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MemberScreen = () => {
  const { getToken } = useAuth();
  const {
    members,
    setMembers,
    branches,
    setBranches,
    shouldRefetch,
    setShouldRefetch,
    selectedBranchId,
    setSelectedBranchId,
  } = useMemberStore();

  const [loading, setLoading] = useState(members.length === 0);
  const [searchQuery, setSearchQuery] = useState("");

  // reset selected branch saat masuk ke screen
  useFocusEffect(
    useCallback(() => {
      setSelectedBranchId(null);
    }, [])
  );

  // fetch members data
  useEffect(() => {
    const fetchMembers = async () => {
      setLoading(true);
      try {
        const token = await getToken({ template: "user_email_role" });
        if (!token) throw new Error("Token tidak tersedia");
        const data = await getSubscriptions(token);
        setMembers(data);
      } catch (err) {
        console.error("Gagal ambil data member:", err);
      } finally {
        setLoading(false);
        setShouldRefetch(false); // selesai fetch ulang
      }
    };

    if (members.length === 0 || shouldRefetch) {
      fetchMembers();
    }
  }, [shouldRefetch]);

  // fetch branches
  useEffect(() => {
    const fetchBranches = async () => {
      if (branches.length > 0) return;
      try {
        const data = await getBranches();
        setBranches(data);
      } catch (err) {
        console.error("Gagal ambil data cabang:", err);
      }
    };

    fetchBranches();
  }, []);

  // handle filter members by branch
  const filteredMembersByBranch = useMemo(() => {
    if (!selectedBranchId) return members;

    return members.filter((member) =>
      member.subscriptions.some((subscription) =>
        subscription.branches.some(
          (branch) => branch.identifier === selectedBranchId
        )
      )
    );
  }, [members, selectedBranchId]);

  // handle search
  const searchedMembers = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return filteredMembersByBranch;

    return filteredMembersByBranch.filter((m) => {
      const nameMatch = m.member.name.toLowerCase().includes(query);
      const phoneMatch = m.member.phone?.toLowerCase().includes(query);
      return nameMatch || phoneMatch;
    });
  }, [searchQuery, filteredMembersByBranch]);

  // handle add member button
  const onPressAdd = () => {
    router.push("/members/addMember");
  };

  // members count last 7 days
  const newMembersCount = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const filtered = filteredMembersByBranch.filter((m) => {
      const createdAt = m.member.createdAt
        ? new Date(m.member.createdAt)
        : null;
      return createdAt && createdAt >= sevenDaysAgo;
    });

    return filtered.length;
  }, [filteredMembersByBranch]);

  return (
    <SafeAreaView className="bg-primary h-full">
      {loading ? (
        <FlatList
          className="px-2"
          data={Array.from({ length: 6 })}
          keyExtractor={(_, i) => i.toString()}
          ListHeaderComponent={
            <>
              <View className="my-6 flex-row justify-between items-center">
                {/* Skeleton Title */}
                <View className="ms-5 w-[140px] h-[28px]">
                  <Skeleton
                    height={28}
                    width={140}
                    colorMode="dark"
                    radius={6}
                    style={{ borderRadius: 6 }}
                  />
                </View>

                {/* Picker Cabang Skeleton */}
                <View
                  className="w-1/2"
                  style={{
                    height: 38,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.1)",
                    overflow: "hidden",
                    paddingHorizontal: 8,
                    justifyContent: "center",
                  }}
                >
                  <Skeleton
                    height={20}
                    width="100%"
                    colorMode="dark"
                    radius={6}
                    style={{ borderRadius: 6 }}
                  />
                </View>
              </View>

              {/* Carousel Skeleton */}
              <View className="w-full" style={{ height: 240 }}>
                <View
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Skeleton
                    height={240}
                    width="100%"
                    colorMode="dark"
                    radius={20}
                  />
                </View>
              </View>

              {/* Member Badges Skeleton */}
              <View className="mt-4 flex-row gap-2 w-3/4">
                <View className="flex-1 bg-white/10 rounded-full px-4 py-2">
                  <Skeleton
                    height={20}
                    width="80%"
                    colorMode="dark"
                    radius={20}
                  />
                </View>
                <View className="flex-1 bg-white/10 rounded-full px-4 py-2">
                  <Skeleton
                    height={20}
                    width="90%"
                    colorMode="dark"
                    radius={9999}
                  />
                </View>
              </View>

              {/* Search Box Skeleton */}
              <View className="my-10 mx-6">
                <Skeleton
                  height={55}
                  width="100%"
                  colorMode="dark"
                  radius={10}
                />
              </View>
            </>
          }
          renderItem={({ index }) => (
            <View
              className={`flex-row items-center gap-4 px-4 py-6 ${
                index % 2 === 0 ? "bg-white/5" : "bg-white/10"
              }`}
              style={{
                borderRadius: 12,
                marginHorizontal: 4,
                marginVertical: 4,
              }}
            >
              {/* Avatar Skeleton */}
              <Skeleton
                width={48}
                height={48}
                radius="round"
                colorMode="dark"
              />

              {/* Text Info Skeleton */}
              <View className="flex-1 gap-2">
                <Skeleton height={14} width="50%" colorMode="dark" radius={6} />
                <Skeleton height={12} width="30%" colorMode="dark" radius={6} />
              </View>
            </View>
          )}
          ListFooterComponent={<View className="h-10" />}
        />
      ) : (
        <FlatList
          className="px-2"
          data={searchedMembers}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <>
              <View className="my-6 flex-row justify-between items-center">
                {/* Title Screen */}
                <Text className="ms-5 text-white font-rubik-bold text-2xl">
                  Daftar Member
                </Text>

                {/* Picker Cabang */}
                <LinearGradient
                  colors={getGradientColors(selectedBranchId)}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  className="w-1/2"
                  style={{
                    borderRadius: 10,
                    height: 38,
                    justifyContent: "center",
                    paddingHorizontal: 8,
                  }}
                >
                  <RNPickerSelect
                    onValueChange={(value) => {
                      console.log("Cabang:", value);
                      setSelectedBranchId(value);
                    }}
                    items={branches.map((branch) => ({
                      label: getBranchLabel(branch.identifier, branch.name),
                      value: branch.identifier,
                    }))}
                    placeholder={{ label: "SEMUA", value: null }}
                    style={{
                      inputIOS: { color: "white", fontSize: 14 },
                      inputAndroid: { color: "white", fontSize: 14 },
                      placeholder: { color: "#eee" },
                    }}
                  />
                </LinearGradient>
              </View>

              {/* Header Carousel */}
              <View className="relative w-full" style={{ height: 240 }}>
                <View
                  style={{
                    borderRadius: 10,
                    overflow: "hidden",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Carousel
                    width={SCREEN_WIDTH}
                    height={240}
                    autoPlay
                    loop
                    data={carouselImages}
                    scrollAnimationDuration={5000}
                    renderItem={({ item }) => (
                      <Image
                        source={item}
                        resizeMode="cover"
                        className="w-full h-full"
                      />
                    )}
                  />

                  {/* Orange gradient overlay */}
                  <LinearGradient
                    colors={["rgba(252,163,17,0.4)", "transparent"]}
                    start={{ x: 0.5, y: 1 }}
                    end={{ x: 0.5, y: 0 }}
                    style={{
                      position: "absolute",
                      left: 0,
                      right: 0,
                      bottom: 0,
                      height: 120,
                    }}
                  />
                </View>

                {/* Floating Add Button */}
                <LinearGradient
                  colors={["#38bdf8", "#e879f9"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  className="absolute w-16 h-16 justify-center items-center z-20"
                  style={{
                    bottom: -28,
                    right: 15,
                    borderRadius: 100,
                    elevation: 8,
                    shadowColor: "#38bdf8",
                    shadowOffset: { width: 0, height: 6 },
                    shadowOpacity: 0.3,
                    shadowRadius: 6,
                    overflow: "hidden",
                  }}
                >
                  <Pressable
                    onPress={onPressAdd}
                    className="w-14 h-14 rounded-full justify-center items-center"
                    android_ripple={{ color: "#38bdf8", borderless: true }}
                  >
                    <AntDesign name="adduser" size={24} color="white" />
                  </Pressable>
                </LinearGradient>
              </View>

              {/* Member Badges - New Members & Total */}
              <View className="mt-4 flex-row gap-2">
                {/* New Members Badge */}
                <View className="bg-[#70e000] rounded-full px-4 py-2 flex-row items-center gap-2">
                  <AntDesign name="notification" size={14} color="#fff" />
                  <Text className="text-white font-rubik-bold text-sm">
                    {newMembersCount} Member Baru
                  </Text>
                </View>

                {/* Total Members Badge */}
                <View className="bg-white/10 rounded-full px-4 py-2 flex-row items-center gap-2">
                  <AntDesign name="team" size={14} color="#fff" />
                  <Text className="text-white font-rubik text-sm">
                    Total: {filteredMembersByBranch.length} Anggota
                  </Text>
                </View>
              </View>

              {/* Search box */}
              <View className="my-10 mx-6">
                <View className="flex-row items-center bg-white/50 rounded-lg p-2">
                  <AntDesign
                    name="search1"
                    size={18}
                    color="#ccc"
                    className="mr-2 ml-4"
                  />
                  <TextInput
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholder="Cari member..."
                    placeholderTextColor="#ccc"
                    className="flex-1 text-white"
                  />
                </View>
              </View>
            </>
          }
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => router.push(`/members/${item.member.id}`)}
              className={`flex-row items-center gap-4 px-4 py-6 ${
                index % 2 === 0 ? "bg-white/5" : "bg-white/10"
              }`}
              style={{
                borderRadius: 12,
                marginHorizontal: 4,
                marginVertical: 4,
              }}
            >
              {/* Avatar */}
              <Image
                source={{
                  uri: `https://ui-avatars.com/api/?name=${item.member.name}`,
                }}
                className="w-12 h-12 rounded-full bg-white/20"
              />
              {/* Info */}
              <View className="flex-1">
                {/* Nama */}
                <View className="flex-row items-center gap-2">
                  <AntDesign name="user" size={16} color="#fff" />
                  <Text className="text-white text-base font-rubik-bold">
                    {item.member.name}
                  </Text>
                </View>

                {/* Phone */}
                <View className="flex-row items-center gap-2 mt-1">
                  <AntDesign name="phone" size={14} color="#ccc" />
                  <Text className="text-white/80 text-sm font-rubik">
                    {item.member.phone}
                  </Text>
                </View>
              </View>

              {/* Icon navigasi */}
              <AntDesign name="right" size={16} color="#999" />
            </Pressable>
          )}
          ListFooterComponent={<View className="h-10" />}
          ListEmptyComponent={
            !loading &&
            searchQuery.trim() !== "" &&
            searchedMembers.length === 0 ? (
              <View className="py-8 items-center">
                <Text className="text-white text-base font-rubik">
                  Tidak ada hasil ditemukan.
                </Text>
              </View>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
};

export default MemberScreen;

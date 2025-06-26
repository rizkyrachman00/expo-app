import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";
import { FlatList, Image, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { useMemberStore } from "@/stores/member.store";
import { getBranchLabel } from "@/utils/branch.helper";
import { formatIndoDate } from "@/utils/dateHelpers";

const MemberDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { members } = useMemberStore();

  const member = useMemo(() => {
    return members.find((m) => m.member.id === id);
  }, [id, members]);

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

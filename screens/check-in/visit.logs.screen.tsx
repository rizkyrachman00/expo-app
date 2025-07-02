import { useVisitLogStore } from "@/stores/visit.logs.store";
import { formatDate, formatIndoDate } from "@/utils/dateHelpers";
import { useAuth } from "@clerk/clerk-expo";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";
import React, { useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Modal from "react-native-modal";
import { SafeAreaView } from "react-native-safe-area-context";

const VisitLogsScreen = () => {
  const { getToken } = useAuth();
  const [showCalendar, setShowCalendar] = useState(false);

  const {
    logs,
    loading,
    selectedDate,
    fetched,
    setSelectedDate,
    fetchLogs,
    filterByDate,
    shouldRefetch,
  } = useVisitLogStore();

  const filteredData = useMemo(
    () => filterByDate(selectedDate),
    [logs, selectedDate]
  );

  useEffect(() => {
    const fetchIfNeeded = async () => {
      const token = await getToken({ template: "user_email_role" });
      if (!token) return;

      if (!fetched || shouldRefetch) {
        await fetchLogs(token);
      }
    };

    fetchIfNeeded();
  }, [fetched, shouldRefetch]);

  const handleSelectDate = (dateString: string) => {
    setSelectedDate(dateString);
    setShowCalendar(false);
  };

  const handlePreviousDate = () => {
    const prevDate = new Date(selectedDate);
    prevDate.setDate(prevDate.getDate() - 1);
    setSelectedDate(formatDate(prevDate));
  };

  const handleNextDate = () => {
    const nextDate = new Date(selectedDate);
    nextDate.setDate(nextDate.getDate() + 1);
    setSelectedDate(formatDate(nextDate));
  };

  return (
    <SafeAreaView className="bg-primary flex-1">
      <View className="p-4">
        {/* Title */}
        <View className="flex-row items-center gap-2 mb-3">
          <MaterialCommunityIcons name="history" size={24} color="white" />
          <Text className="text-white text-2xl font-rubik-bold">
            Riwayat Check-In
          </Text>
        </View>

        {/* Date Navigation */}
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            onPress={handlePreviousDate}
            className="bg-white/10 p-3 rounded-full"
          >
            <Feather name="chevron-left" size={20} color="white" />
          </TouchableOpacity>

          <Pressable
            onPress={() => setShowCalendar(true)}
            className="bg-blue-500 px-4 py-2 rounded-full"
          >
            <Text className="text-white font-rubik-medium">
              {formatIndoDate(selectedDate)}
            </Text>
          </Pressable>

          <TouchableOpacity
            onPress={handleNextDate}
            className="bg-white/10 p-3 rounded-full"
          >
            <Feather name="chevron-right" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Loading Skeleton */}
      {loading ? (
        <FlatList
          data={Array.from({ length: 8 })}
          keyExtractor={(_, i) => i.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
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
              <Skeleton
                width={48}
                height={48}
                radius="round"
                colorMode="dark"
              />
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
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
          renderItem={({ item }) => (
            <View className="bg-white/10 p-4 rounded-xl mb-3 flex-row gap-3 items-center">
              <View className="bg-blue-500/80 p-3 rounded-full">
                <Ionicons name="people" size={24} color="black" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-rubik-medium text-base">
                  {item.user?.name || "Tanpa Nama"} ({item.type})
                </Text>
                <Text className="text-white text-sm">
                  Cabang: {item.branch?.name || "Tanpa Cabang"}
                </Text>
                <Text className="text-white text-xs italic">
                  {new Date(item.checkinAt).toLocaleTimeString("id-ID")}
                </Text>
              </View>
            </View>
          )}
          ListEmptyComponent={() => (
            <Text className="text-white italic text-center mt-4">
              Tidak ada data check-in.
            </Text>
          )}
        />
      )}

      {/* Calendar Modal */}
      <Modal
        isVisible={showCalendar}
        onBackdropPress={() => setShowCalendar(false)}
        onBackButtonPress={() => setShowCalendar(false)}
        style={{ justifyContent: "center", alignItems: "center" }}
      >
        <View className="bg-white p-4 rounded-xl w-[90%]">
          <Text className="font-rubik-medium text-xl mb-2 text-black">
            Pilih Tanggal
          </Text>
          <Calendar
            onDayPress={(day) => handleSelectDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: "#60a5fa",
                selectedTextColor: "white",
              },
            }}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default VisitLogsScreen;

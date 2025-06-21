import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
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

import { carouselImages } from "@/constants/data/carousel.image";
import { router } from "expo-router";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const MemberScreen = () => {
  const onPressAdd = () => {
    console.log("Add user");
    router.push("/members/addMember");
  };

  const newMembersCount = 3;

  const memberData = [
    { name: "John Doe" },
    { name: "Jane Smith" },
    { name: "Michael Scott" },
    { name: "Angela Martin" },
    { name: "Jim Halpert" },
  ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        className="px-4"
        data={memberData}
        keyExtractor={(item, index) => index.toString()}
        ListHeaderComponent={
          <>
            {/* Picker Cabang */}
            <View className="mt-2 flex-row justify-end">
              <LinearGradient
                colors={["#c084fc", "#60a5fa"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                className="w-1/2"
                style={{ borderRadius: 10 }}
              >
                <RNPickerSelect
                  onValueChange={(value) => console.log("Cabang:", value)}
                  items={[
                    { label: "Jakarta", value: "jakarta" },
                    { label: "Bandung", value: "bandung" },
                    { label: "Surabaya", value: "surabaya" },
                  ]}
                  placeholder={{ label: "Pilih Cabang", value: null }}
                  style={{
                    inputIOS: { color: "white", fontSize: 14 },
                    inputAndroid: { color: "white", fontSize: 14 },
                    placeholder: { color: "#eee" },
                  }}
                />
              </LinearGradient>
            </View>

            {/* Header Carousel */}
            <View className="mt-4 relative w-full" style={{ height: 240 }}>
              <View
                style={{
                  borderRadius: 20,
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
                  Total: {memberData.length} Anggota
                </Text>
              </View>
            </View>

            {/* Search box */}
            <View className="mt-14 mb-10">
              <View className="flex-row items-center bg-white/50 rounded-full px-4 py-2">
                <AntDesign
                  name="search1"
                  size={18}
                  color="#ccc"
                  className="mr-2 ml-4"
                />
                <TextInput
                  placeholder="Cari member..."
                  placeholderTextColor="#ccc"
                  className="flex-1 text-white"
                />
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View
            className={`px-4 py-3 ${
              index % 2 === 0 ? "bg-white/5" : "bg-white/10"
            }`}
          >
            <Text className="text-white text-base font-rubik">
              {item.name}
            </Text>
          </View>
        )}
        ListFooterComponent={<View className="h-10" />}
      />
    </SafeAreaView>
  );
};

export default MemberScreen;

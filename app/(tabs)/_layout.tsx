import { isAdmin } from "@/utils/roleCheck";
import { useUser } from "@clerk/clerk-expo";
import BottomSheet from "@gorhom/bottom-sheet";
import { Tabs, useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable } from "react-native";

import DrawerContent from "@/components/drawer/drawer.content";
import TabIcon from "@/components/tab.icon";
import BottomSheetContext from "@/context/BottomSheetContext";

import { icons } from "@/constants/icons";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const TabsLayout = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isMoreFocused, setIsMoreFocused] = useState(false);

  const { user } = useUser();
  const email = user?.primaryEmailAddress?.emailAddress;
  const admin = isAdmin(email);

  const router = useRouter();

  const openDrawer = () => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsOpenDrawer(true);
    setIsMoreFocused(true);
  };

  const closeDrawer = () => {
    bottomSheetRef.current?.close();
    setIsOpenDrawer(false);
    setIsMoreFocused(false);
  };

  const toggleDrawer = () => {
    isOpenDrawer ? closeDrawer() : openDrawer();
  };

  const onPressAdd = () => {
    // router.push("/admin/add-item"); // contoh route
    console.log("onPressAdd");
  };

  return (
    <BottomSheetContext.Provider value={{ openDrawer, closeDrawer }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: {
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderRadius: 26,
            marginHorizontal: 20,
            marginBottom: 36,
            height: 52,
            position: "absolute",
            borderWidth: 1,
            borderColor: "#ffffff",
            zIndex: 100,
            elevation: 10,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.home} title="Home" />
            ),
          }}
        />
        <Tabs.Screen
          name="check-situasi"
          options={{
            title: "Check Situasi",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.gathering}
                title="Situasi"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="check-in"
          options={{
            title: "Check In",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} icon={icons.qrCode} title="Check In" />
            ),
          }}
        />

        <Tabs.Screen
          name="more"
          options={{
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={isMoreFocused} icon={icons.more} />
            ),
            tabBarButton: (props) => (
              <Pressable onPress={toggleDrawer} style={props.style}>
                {props.children}
              </Pressable>
            ),
          }}
        />
      </Tabs>

      {admin && (
        <LinearGradient
          colors={["#38bdf8", "#e879f9"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          className="absolute bottom-[70px] z-[150] justify-center items-center w-14 h-14"
          style={{
            left: "50%",
            transform: [{ translateX: -25 }],
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
      )}

      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={["50%", "70%"]}
        index={-1}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        onChange={(index) => {
          if (index === -1) {
            setIsMoreFocused(false);
            setIsOpenDrawer(false);
          } else {
            setIsMoreFocused(true);
            setIsOpenDrawer(true);
          }
        }}
      >
        <DrawerContent />
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

export default TabsLayout;

import BottomSheet from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import React, { useRef, useState } from "react";
import { Pressable } from "react-native";

import DrawerContent from "@/components/drawer/drawer.content";
import TabIcon from "@/components/tab.icon";
import BottomSheetContext from "@/context/BottomSheetContext";

import { icons } from "@/constants/icons";

const TabsLayout = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isMoreFocused, setIsMoreFocused] = useState(false);

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
              <TabIcon focused={isMoreFocused} icon={icons.more} title="More" />
            ),
            tabBarButton: (props) => (
              <Pressable onPress={toggleDrawer} style={props.style}>
                {props.children}
              </Pressable>
            ),
          }}
        />
      </Tabs>

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

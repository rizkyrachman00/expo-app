import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import BottomSheet from "@gorhom/bottom-sheet";
import { Tabs } from "expo-router";
import React, { createContext, useContext, useRef, useState } from "react";
import { Image, ImageBackground, Pressable, Text, View } from "react-native";

const TabIcon = ({ focused, icon, title }: any) => {
  if (focused) {
    return (
      <ImageBackground
        source={images.highlight}
        className="flex flex-row w-full flex-1 min-w-[110px] min-h-[60px] mt-4 justify-center items-center rounded-full overflow-hidden"
      >
        <Image source={icon} className="size-5" tintColor="#151312" />
        <Text className="text-secondary text-base font-semibold ml-2">
          {title}
        </Text>
      </ImageBackground>
    );
  }

  return (
    <View className="size-full justify-center items-center mt-4 rounded-full">
      <Image source={icon} tintColor="#FCA311" className="size-5" />
    </View>
  );
};

const BottomSheetContext = createContext({
  openDrawer: () => {},
  closeDrawer: () => {},
});

export function useBottomSheetDrawer() {
  return useContext(BottomSheetContext);
}

const TabsLayout = () => {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isMoreFocused, setIsMoreFocused] = useState(false);

  const openDrawer = () => {
    bottomSheetRef.current?.snapToIndex(0);
    setIsOpen(true);
    setIsMoreFocused(true);
  };

  const closeDrawer = () => {
    bottomSheetRef.current?.close();
    setIsOpen(false);
    setIsMoreFocused(false);
  };

  const toggleDrawer = () => {
    isOpen ? closeDrawer() : openDrawer();
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
        snapPoints={["50%"]}
        index={-1}
        enableDynamicSizing={false}
        enablePanDownToClose={true}
        onChange={(index) => {
          if (index === -1) {
            setIsMoreFocused(false);
          } else {
            setIsMoreFocused(true);
          }
        }}
      >
        <YourDrawerContent />
      </BottomSheet>
    </BottomSheetContext.Provider>
  );
};

function YourDrawerContent() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Isi Bottom Sheet (Drawer Custom)</Text>
    </View>
  );
}

export default TabsLayout;

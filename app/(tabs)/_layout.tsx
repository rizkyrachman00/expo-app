import { icons } from '@/constants/icons'
import { images } from '@/constants/images'
import { Tabs } from 'expo-router'
import React from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'

const TabIcon = ({ focused, icon, title }: any) => {

  if (focused) {
    return (
      <ImageBackground source={images.highlight} className='flex flex-row w-full flex-1 min-w-[110px] min-h-[60px] mt-4 justify-center items-center rounded-full overflow-hidden'>
        <Image source={icon} className='size-5' tintColor="#151312" />
        <Text className='text-secondary text-base font-semibold ml-2'>{title}</Text>
      </ImageBackground>
    )
  }

  return (
    <View className='size-full justify-center items-center mt-4 rounded-full'>
      <Image source={icon} tintColor="#FCA311" className='size-5' />
    </View>
  )


}

const TabsLayout = () => {
  return (
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
          borderColor: "#ffffff"
        }
      }}
    >
      <Tabs.Screen name="index" options={{
        title: 'Home', headerShown: false, tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.home}
            title="Home"
          />
        )
      }} />
      <Tabs.Screen name="check-situasi" options={{
        title: 'Check Situasi', headerShown: false, tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.gathering}
            title="Situasi"
          />
        )
      }} />
      <Tabs.Screen name="check-in" options={{
        title: 'Check In', headerShown: false, tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.qrCode}
            title="Check In"
          />
        )
      }} />
      <Tabs.Screen name="more" options={{
        title: 'More', headerShown: false, tabBarIcon: ({ focused }) => (
          <TabIcon
            focused={focused}
            icon={icons.more}
            title="More"
          />
        )
      }} />
    </Tabs>
  )
}

export default TabsLayout
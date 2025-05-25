import { images } from "@/constants/images";
import {
  Image,
  Text,
  View,
  TouchableOpacity,
  GestureResponderEvent,
  Linking,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import MapSelectorModal from "@/components/map.selector.modal";

interface IconCircleProps {
  icon: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
}

const IconCircle = ({ icon, onPress }: IconCircleProps) => (
  <TouchableOpacity
    className="w-14 h-14 rounded-full border border-gray-300 justify-center items-center"
    onPress={onPress}
    activeOpacity={0.7}
  >
    {icon}
  </TouchableOpacity>
);

export default function Index() {
  const router = useRouter();
  const [isMapModalVisible, setMapModalVisible] = useState(false);

  return (
    <SafeAreaView className="bg-primary h-full">
      <Image source={images.background} className="absolute w-full z-0" />
      <View
        className="w-32 h-32 mx-auto mt-10"
        style={{
          shadowColor: "#ffffff",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.5,
          shadowRadius: 10,
          elevation: 10,
          borderRadius: 8,
          overflow: "hidden",
        }}
      >
        <Image
          source={images.logo}
          className="w-32 h-32"
          style={{
            resizeMode: "cover",
          }}
        />
      </View>

      <Text
        className="text-secondary text-lg font-rubik text-center mt-5"
        style={{ lineHeight: 30 }}
      >
        <Text>Bikin</Text>{" "}
        <Text className="text-accent font-rubik-bold">FITNESS</Text>{" "}
        <Text>lebih</Text>{" "}
        <Text className="text-accent font-rubik-bold">SERU!!{"\n"}</Text>
        Join <Text className="text-accent text-2xl font-rubik-bold">Yuk!!</Text>
      </Text>

      <TouchableOpacity
        className="items-center mt-12"
        onPress={() => router.push("/personal-trainer")}
      >
        <View className="rounded-lg overflow-hidden mx-auto w-96 h-40">
          <Image
            source={images.ptImage}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        className="items-center mt-5"
        onPress={() => router.push("/gym-partner")}
      >
        <View className="rounded-lg overflow-hidden mx-auto w-96 h-40">
          <Image
            source={images.temanGym}
            className="w-full h-full"
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
      <View className="flex-row justify-center gap-5 mt-20">
        <IconCircle
          icon={
            <FontAwesome5 name="map-marked-alt" size={24} color="#4F46E5" />
          }
          onPress={() => setMapModalVisible(true)}
        />
        <IconCircle
          icon={<FontAwesome5 name="instagram" size={24} color="#E1306C" />}
          onPress={() =>
            Linking.openURL("https://www.instagram.com/blackbox.camp")
          }
        />
        <IconCircle
          icon={<FontAwesome5 name="tiktok" size={24} color="white" />}
          onPress={() =>
            Linking.openURL("https://www.tiktok.com/@blackbox.camp")
          }
        />
        <IconCircle
          icon={<FontAwesome5 name="whatsapp" size={24} color="#25D366" />}
          onPress={() =>
            Linking.openURL("https://api.whatsapp.com/send?phone=6282325003773")
          }
        />
      </View>
      <MapSelectorModal
        visible={isMapModalVisible}
        onClose={() => setMapModalVisible(false)}
      />
    </SafeAreaView>
  );
}

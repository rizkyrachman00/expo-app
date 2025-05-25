import { GymPartners } from "@/constants/data/gym.partners";
import { FontAwesome5 } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import Octicons from "@expo/vector-icons/Octicons";
import { LinearGradient } from "expo-linear-gradient";
import {
  FlatList,
  Image,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GymPartnerList = () => {
  return (
    <>
      <Text className="text-white font-rubik text-base p-4">
        <Text className="font-rubik-bold">Teman Gym</Text> adalah freelancer
        yang siap nemenin kamu nge-gym. Mereka bukan personal trainer, tapi bisa
        bantu kamu memulai perjalanan fitness dengan cara yang lebih santai dan
        seru. Cocok banget buat kamu yang punya budget concern atau sekadar
        butuh teman buat mulai. Jangan lupa, diskusikan fee-nya di awal ya,
        karena mereka bekerja secara profesional untuk menemani kamu!
      </Text>
      <FlatList
        data={GymPartners}
        keyExtractor={(item) => item.slug}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item: trainer }) => (
          <View className="border-b w-full border-zinc-700 p-4 flex flex-col gap-4">
            {/* FOTO & NAMA */}
            <View className="flex flex-row items-center gap-6">
              <View className="w-16 h-16 rounded-full overflow-hidden ring-2 ring-offset-2 ring-zinc-300">
                <Image
                  source={trainer.profilePicture}
                  className="w-full h-full object-cover"
                  resizeMode="cover"
                />
              </View>
              <Text className="text-white font-rubik-bold text-2xl">
                {trainer.name}
              </Text>
            </View>

            {/* WA , INSTAGRAM, Tiktok */}
            <View className="flex flex-row gap-2">
            {/* WhatsApp */}
            <TouchableOpacity
              onPress={() =>
                Linking.openURL(
                  `https://api.whatsapp.com/send?phone=${trainer.wa}&text=Halo%2C%20saya%20menghubungi%20dari%20web%20BlackBox%20Gym.%20Bisa%20dibantu%20share%20pricelist%20untuk%20PT%3F%20Terimakasih`
                )
              }
              className="basis-1/3 flex-row items-center justify-center gap-1 bg-[#24CD63] py-1 px-1 rounded-md"
            >
              <FontAwesome5 name="whatsapp" size={13} color="white" />
              <Text className="text-xs font-rubik-semibold text-white text-center">
                Hubungi WA
              </Text>
            </TouchableOpacity>

            {/* Instagram */}
            {trainer.instagram && (
              <LinearGradient
                colors={["#feda75", "#d62976", "#962fbf", "#4f5bd5"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="basis-1/3 rounded-md overflow-hidden"
              >
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      `https://www.instagram.com/${trainer.instagram}`
                    )
                  }
                  className="flex flex-row items-center justify-center py-1 px-1 gap-1"
                >
                  <FontAwesome5 name="instagram" size={13} color="white" />
                  <Text className="text-xs font-rubik-semibold text-white text-center">
                    Instagram
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}

            {/* TikTok */}
            {trainer.tiktok && (
              <LinearGradient
                colors={["#25F4EE", "#010101", "#000000"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="basis-1/3 rounded-md overflow-hidden"
              >
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(`https://www.tiktok.com/@${trainer.tiktok}`)
                  }
                  className="flex flex-row items-center justify-center py-1 px-1 gap-1"
                >
                  <FontAwesome5 name="tiktok" size={13} color="white" />
                  <Text className="text-xs font-rubik-semibold text-white text-center">
                    TikTok
                  </Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>

            {/* SERTIFIKASI */}
            {(trainer.certifications ?? []).length > 0 && (
              <View className="flex-row items-start gap-2 flex-wrap">
                <Text className="w-36 font-medium text-white">Sertifikasi</Text>
                <View className="flex-row flex-wrap gap-2 flex-1">
                  {trainer.certifications?.map((cert, idx) => (
                    <View
                      key={idx}
                      className="border border-[#F6BE1A] rounded px-4 py-2 items-center justify-center flex-row gap-2"
                    >
                      <Octicons name="verified" size={15} color="#F6BE1A" />
                      <Text className="text-[#F6BE1A] text-sm text-center">
                        {cert}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* LOKASI */}
            <View className="flex-row items-start gap-2 flex-wrap">
              <Text className="w-36 font-medium text-white">
                Lokasi Training
              </Text>
              <View className="flex-row flex-wrap gap-2 flex-1">
                {trainer.locations.map((loc) => (
                  <View
                    key={loc.branchIdentifier}
                    className="border border-[#F6BE1A] rounded px-2 py-2 basis-[48%] items-center justify-center"
                  >
                    <Text className="text-sm text-white text-center">
                      {loc.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* GENDER */}
            <View className="flex-row items-start gap-2 flex-wrap">
              <Text className="w-36 font-medium text-white">Gender</Text>
              <View className="border border-[#F6BE1A] rounded px-2 py-2 w-36 items-center justify-center flex-row gap-1">
                <Ionicons
                  name={trainer.gender === "female" ? "female" : "male"}
                  size={15}
                  color="white"
                />
                <Text className="text-sm text-white">
                  {trainer.gender === "female" ? "Perempuan" : "Laki-laki"}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    </>
  );
};

export default GymPartnerList;

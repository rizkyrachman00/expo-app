import { MemberWithSubscriptions } from "@/schemas/subscription.schema";
import { formatIndoDate } from "@/utils/dateHelpers";
import { LinearGradient } from "expo-linear-gradient";
import * as Linking from "expo-linking";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";
import React, { useRef } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";
import ViewShot, { captureRef } from "react-native-view-shot";

type Props = {
  member: MemberWithSubscriptions;
};

const MembershipCard = ({ member }: Props) => {
  const viewRefs = useRef<Record<string, ViewShot | null>>({});

  // normalize phone number
  const normalizePhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    if (cleaned.startsWith("62")) return cleaned;
    if (cleaned.startsWith("0")) return "62" + cleaned.slice(1);
    return cleaned;
  };

  // validate phone number
  const isValidPhoneNumber = (phone: string): boolean => {
    return /^62[0-9]{7,14}$/.test(phone);
  };

  // share membership card to WhatsApp
  const handleShare = async (
    key: string,
    phone: string,
    branchName: string,
    activeUntil: Date
  ) => {
    const viewRef = viewRefs.current[key];
    if (!viewRef) return;

    try {
      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      const normalizedPhone = normalizePhoneNumber(phone);
      const isWA = isValidPhoneNumber(normalizedPhone);
      const formattedDate = formatIndoDate(activeUntil);

      const message = `Halo ${member.member.name},\n\nBerikut kartu member Gym Anda untuk cabang *${branchName}*.\nKartu ini berlaku hingga *${formattedDate}*.\n\nTerima kasih telah menjadi member kami.`;

      if (isWA) {
        const link = `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(
          message
        )}`;
        const supported = await Linking.canOpenURL(link);
        if (supported) {
          await Linking.openURL(link);
        } else {
          throw new Error("Tidak dapat membuka WhatsApp.");
        }
      } else {
        // fallback: share file secara umum
        const available = await Sharing.isAvailableAsync();
        if (available) {
          await Sharing.shareAsync(uri, {
            mimeType: "image/png",
            dialogTitle: "Bagikan kartu member",
          });
        } else {
          Alert.alert("Gagal", "Fitur berbagi tidak tersedia.");
        }
      }
    } catch (error) {
      Alert.alert("Gagal", "Gagal membagikan kartu.");
    }
  };

  // save membership card to gallery
  const handleDownload = async (key: string) => {
    const viewRef = viewRefs.current[key];
    if (!viewRef) return;

    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Izin Ditolak",
          "Aplikasi memerlukan izin untuk menyimpan gambar."
        );
        return;
      }

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(uri);
      await MediaLibrary.createAlbumAsync("Membership Cards", asset, false);

      Alert.alert("Sukses", "Kartu berhasil disimpan ke galeri.");
    } catch (error) {
      Alert.alert("Gagal", "Gagal menyimpan kartu.");
    }
  };

  // filter active subscriptions
  const activeSubscriptions = member.subscriptions.filter((sub) => {
    const now = new Date();
    return (
      new Date(sub.subscription.activeUntil) > now &&
      sub.subscription.deletedAt === null &&
      sub.branches.length > 0
    );
  });

  // Ambil hanya 1 subscription terbaru per cabang
  const uniqueBranchMap = new Map<
    string,
    (typeof activeSubscriptions)[0] & {
      branch: (typeof activeSubscriptions)[0]["branches"][0];
    }
  >();

  // Ambil subscription terbaru
  activeSubscriptions.forEach((sub) => {
    sub.branches.forEach((branch) => {
      const existing = uniqueBranchMap.get(branch.id);
      const currentDate = new Date(sub.subscription.activeUntil);
      const existingDate = existing
        ? new Date(existing.subscription.activeUntil)
        : null;

      if (!existing || (existingDate && currentDate > existingDate)) {
        uniqueBranchMap.set(branch.id, { ...sub, branch });
      }
    });
  });

  const uniqueBranchSubscriptions = Array.from(uniqueBranchMap.values());

  // check if there are any active subscriptions
  if (uniqueBranchSubscriptions.length === 0) {
    return (
      <View className="bg-gray-900 p-4 rounded-md mb-2">
        <Text className="text-white font-rubik-medium">Tidak ada subscription aktif.</Text>
      </View>
    );
  }

  return (
    <View className="space-y-4">
      {uniqueBranchSubscriptions.map((sub) => {
        const branch = sub.branch;
        const key = `${sub.subscription.id}-${branch.id}`;
        const payload = {
          type: "member" as const,
          memberId: member.member.id,
          branchId: branch.id,
        };
        const activeUntilDate = new Date(sub.subscription.activeUntil);
        const formattedDate = formatIndoDate(activeUntilDate);

        return (
          <View key={key}>
            <ViewShot
              ref={(ref) => {
                viewRefs.current[key] = ref;
              }}
            >
              <LinearGradient
                colors={["#1e3a8a", "#ffffff"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                className="rounded-2xl w-[280px] h-[500px] self-center overflow-hidden shadow-2xl"
              >
                <View className="flex-1 justify-between px-6 py-6">
                  {/* Header */}
                  <View className="items-center">
                    <Text className="text-white font-rubik-bold text-xl tracking-wide mb-1">
                      GYM MEMBER CARD
                    </Text>
                    <View className="w-12 h-1 bg-white/80 rounded-full mb-4" />
                  </View>

                  {/* Foto & Identitas */}
                  <View className="items-center">
                    <Image
                      source={{
                        uri: `https://ui-avatars.com/api/?name=${member.member.name}`,
                      }}
                      className="w-24 h-24 rounded-full mb-3 border-2 border-white"
                    />
                    <Text className="text-white font-rubik-bold text-lg text-center">
                      {member.member.name}
                    </Text>
                    <Text className="text-white/80 text-sm">
                      {member.member.phone}
                    </Text>
                  </View>

                  {/* Info Langganan */}
                  <View className="bg-white/90 rounded-xl p-4 mt-6">
                    <Text className="text-indigo-800 font-semibold text-sm text-center">
                      Akses Cabang
                    </Text>
                    <Text className="text-zinc-700 text-base text-center font-medium">
                      {branch.name}
                    </Text>
                    <Text className="text-zinc-500 text-xs text-center mt-1">
                      Berlaku s/d: {formattedDate}
                    </Text>
                  </View>

                  {/* QR Code */}
                  <View className="items-center mt-7 mb-2">
                    <View className="p-3 shadow-md">
                      <QRCode
                        value={JSON.stringify(payload)}
                        size={130}
                        backgroundColor="transparent"
                      />
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </ViewShot>

            {/* Tombol Share & Simpan */}
            <View className="flex-row justify-center gap-4 mt-4 mb-6">
              <Pressable
                onPress={() =>
                  handleShare(
                    key,
                    member.member.phone,
                    branch.name,
                    activeUntilDate
                  )
                }
                className="flex-1 items-center bg-emerald-600 py-2 rounded-xl"
                android_ripple={{ color: "#065f46" }}
              >
                <Text className="text-white font-rubik text-sm">
                  Kirim ke WhatsApp
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleDownload(key)}
                className="flex-1 items-center bg-indigo-600 py-2 rounded-xl"
                android_ripple={{ color: "#3730a3" }}
              >
                <Text className="text-white font-rubik text-sm">
                  Simpan ke Galeri
                </Text>
              </Pressable>
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default MembershipCard;

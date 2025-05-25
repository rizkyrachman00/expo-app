import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { openMapLink } from "@/utils/map";
import { GymLocations } from "@/constants/data/gym.locations";

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function MapSelectorModal({ visible, onClose }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/60 justify-center items-center px-4">
        <View className="bg-white rounded-xl w-full max-w-md p-6">
          <Text className="text-lg font-bold mb-4 text-center">Pilih Lokasi</Text>

          {Object.values(GymLocations).map((location) => (
            <TouchableOpacity
              key={location.branchIdentifier}
              className="py-4 border-b border-gray-200"
              onPress={() => {
                onClose();
                openMapLink(location.branchIdentifier);
              }}
            >
              <Text className="text-center text-base">{location.name}</Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-center text-blue-500 font-semibold">Batal</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

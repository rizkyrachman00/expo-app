import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useVisitorCount } from "@/hooks/useVisitorCount";
import {
  getStatusFromPercentage,
  getColorsFromStatus,
  getTitle,
} from "@/utils/visitorStatus";
import { StatusIndicator } from "./status.indicator";
import { type BranchIdentifier, type Location } from "@/types/location";

type Props = {
  location: Location;
  onPressCheckJamSepi?: (branchIdentifier: BranchIdentifier) => void;
};

export const VisitorCounter = ({ location, onPressCheckJamSepi }: Props) => {
  const { branchIdentifier, name, capacity } = location;

  const { data, isLoading, refetch, isFetching } =
    useVisitorCount(branchIdentifier);
    
  const count = data ?? 0;
  const percentage = (count / capacity) * 100;
  const status = getStatusFromPercentage(percentage);
  const colors = getColorsFromStatus(status);
  const statusLabel = getTitle(status);

  return (
    <View className="bg-gray-900 rounded-lg p-4 mt-4">
      <View className="flex-row justify-between">
        <View className="flex-1">
          <Text className="text-white font-rubik-bold text-xl">Blackbox {name}</Text>
          <Text className="text-white text-sm mt-2">Total pengunjung saat ini:</Text>
          <View className="flex-row items-end">
            <Text className="text-7xl font-rubik-bold text-white">
              {isLoading ? "..." : count}
            </Text>
            <Text className="text-white mb-1 ml-1 text-xl">/ {capacity}</Text>
          </View>
        </View>
        <View className="items-start pl-4 border-l border-zinc-700 mt-2">
          <StatusIndicator label={statusLabel} colors={colors} />
        </View>
      </View>

      {/* Bar horizontal */}
      <View className="h-2 bg-slate-600 rounded-full mt-4 overflow-hidden">
        <View
          className="h-2 rounded-full"
          style={{
            width: `${Math.max(percentage, 3)}%`,
            backgroundColor: colors[0],
          }}
        />
      </View>

      <View className="flex-row justify-between mt-4">
        <TouchableOpacity
          className="bg-white rounded-full px-4 py-2 flex-row items-center justify-center"
          onPress={() => refetch()}
          disabled={isFetching}
        >
          {isFetching ? (
            <>
              <ActivityIndicator size="small" color="#000" />
            </>
          ) : (
            <Text className="text-black">Refresh</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-white rounded-full px-4 py-2"
          onPress={() => onPressCheckJamSepi?.(branchIdentifier)}
        >
          <Text className="text-black">Check Jam Sepi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

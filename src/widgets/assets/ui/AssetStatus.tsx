import { Text, View } from 'react-native';
import { Lock } from 'lucide-react-native';
import type { Asset } from '@services/assets/types';

interface AssetStatusProps {
  asset: Asset;
  isUnavailable: boolean;
}

export const AssetStatus = ({ asset, isUnavailable }: AssetStatusProps) => {
  if (isUnavailable) {
    return (
      <View className="flex-row items-center gap-2 self-start rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
        <Lock color="rgba(255,255,255,0.35)" size={14} />
        <Text className="text-[11px] font-semibold text-white/35">закрыт</Text>
      </View>
    );
  }

  if (!asset.isOnline) {
    return (
      <View className="self-start rounded-full border border-white/10 bg-white/5 px-2.5 py-1">
        <Text className="text-[11px] font-semibold text-white/35">офлайн</Text>
      </View>
    );
  }

  return (
    <View className="flex-row items-center gap-2 self-start rounded-full border border-[#4ADE80]/15 bg-[#4ADE80]/5 px-2.5 py-1">
      <View className="h-1.5 w-1.5 rounded-full bg-[#4ADE80]" />
      <Text className="text-[11px] font-semibold text-[#4ADE80]">онлайн</Text>
    </View>
  );
};

import {useMemo} from 'react';
import {Pressable, ScrollView, Text, View} from 'react-native';
import {cn} from '@shared/lib/cn';
import type {AssetTypeId} from '../config/assetTypes';
import {assetTypeTabOptions} from '../config/assetTypes';
import type {Asset} from '@services/assets/types';
import {formatAssetDisplayName} from '../lib/formatAssetDisplayName';
import {Spinner} from 'heroui-native/spinner';

type ChartAssetListProps = {
  assetType: AssetTypeId;
  onAssetTypeChange: (type: AssetTypeId) => void;
  availableAssets: Asset[];
  unavailableAssets: Asset[];
  isLoading: boolean;
  selectedAssetId: string | null;
  onAssetSelect: (id: string | null) => void;
};

function AssetStatusDot({
  isOnline,
  isUnavailable = false,
}: {
  isOnline: boolean;
  isUnavailable?: boolean;
}) {
  if (isUnavailable) {
    return <View className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#6B7280]" />;
  }
  if (!isOnline) {
    return null;
  }
  return <View className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#4ADE80]" />;
}

export const ChartAssetList = ({
  assetType,
  onAssetTypeChange,
  availableAssets,
  unavailableAssets,
  isLoading,
  selectedAssetId,
  onAssetSelect,
}: ChartAssetListProps) => {
  const assetCount = useMemo(
    () => availableAssets.length + unavailableAssets.length,
    [availableAssets, unavailableAssets],
  );

  return (
    <View className="h-full">
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled
        style={{flexGrow: 0, flexShrink: 0, maxHeight: 36}}
        contentContainerStyle={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          paddingRight: 4,
        }}>
        {assetTypeTabOptions.map((tab) => {
          const isActive = assetType === tab.id;
          return (
            <Pressable
              key={tab.id}
              onPress={() => onAssetTypeChange(tab.id)}
              className={cn(
                'shrink-0 rounded-full px-3 py-1.5',
                isActive ? 'bg-[#4754E1]' : 'bg-[#ffffff16]',
              )}>
              <Text
                className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-white' : 'text-white/70',
                )}
                numberOfLines={1}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="mt-3 min-h-0 flex-1">
        {isLoading ? (
          <View className="items-center justify-center py-3">
            <Spinner />
          </View>
        ) : assetCount === 0 ? (
          <View className="items-center py-3">
            <Text className="text-sm text-text-secondary">
              Нет доступных активов
            </Text>
          </View>
        ) : (
          <ScrollView
            nestedScrollEnabled
            showsVerticalScrollIndicator={false}
            style={{flex: 1}}
            contentContainerStyle={{paddingBottom: 4}}>
            {availableAssets.map((asset) => {
              const isSelected = String(asset.id) === selectedAssetId;
              return (
                <Pressable
                  key={asset.id}
                  onPress={() => onAssetSelect(String(asset.id))}
                  className={cn(
                    'flex-row items-center gap-2 rounded-md px-2 py-2',
                    isSelected ? 'bg-[#ffffff16]' : 'active:bg-[#1A1D23]',
                  )}>
                  <AssetStatusDot isOnline={asset.isOnline} />
                  <Text
                    className="flex-1 text-sm text-white"
                    numberOfLines={1}>
                    {formatAssetDisplayName(asset.name)}
                  </Text>
                </Pressable>
              );
            })}
            {unavailableAssets.map((asset) => (
              <View
                key={asset.id}
                className="flex-row items-center gap-2 rounded-md px-2 py-2">
                <AssetStatusDot isOnline={asset.isOnline} isUnavailable />
                <Text
                  className="flex-1 text-sm text-white/50"
                  numberOfLines={1}>
                  {formatAssetDisplayName(asset.name)}
                </Text>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
};

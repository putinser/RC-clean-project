import {Pressable, View} from 'react-native';
import {X} from 'lucide-react-native';
import {Spinner} from 'heroui-native/spinner';
import type {Asset} from '@services/assets/types';
import {type AssetTypeId, assetTypeTabOptions} from '../config/assetTypes';
import {formatAssetDisplayName} from '../lib/formatAssetDisplayName';
import {ChartSelect} from './ChartSelect';
import {ChartShowPriceButton} from './ChartShowPriceButton';

type ChartPanelCompactHeaderProps = {
  assetType: AssetTypeId;
  onAssetTypeChange: (type: AssetTypeId) => void;
  availableAssets: Asset[];
  unavailableAssets: Asset[];
  isLoading: boolean;
  selectedAssetId: string | null;
  onAssetSelect: (id: string | null) => void;
  canTogglePrice: boolean;
  showPrice: boolean;
  onTogglePrice: () => void;
  onClose?: () => void;
};

export const ChartPanelCompactHeader = ({
  assetType,
  onAssetTypeChange,
  availableAssets,
  unavailableAssets,
  isLoading,
  selectedAssetId,
  onAssetSelect,
  canTogglePrice,
  showPrice,
  onTogglePrice,
  onClose,
}: ChartPanelCompactHeaderProps) => {
  const assetOptions = [...availableAssets, ...unavailableAssets].map(
    (asset) => ({
      id: String(asset.id),
      label1: formatAssetDisplayName(asset.name),
    }),
  );

  const typeOptions = assetTypeTabOptions.map((tab) => ({
    id: tab.id,
    label1: tab.label,
  }));

  return (
    <View className="flex-row items-center gap-1 border-b border-[#21262d] px-1.5 py-1">
      <View className="w-[88px] shrink-0">
        <ChartSelect
          ariaLabel="Тип актива"
          options={typeOptions}
          value={assetType}
          onChange={(value) => onAssetTypeChange(value as AssetTypeId)}
          compact
        />
      </View>
      {isLoading ? (
        <View className="h-8 min-w-0 flex-1 items-center justify-center rounded-[10px] border border-[#464B52] bg-[#12151B]">
          <Spinner size="sm" />
        </View>
      ) : (
        <View className="min-w-0 flex-1">
          <ChartSelect
            ariaLabel="Актив"
            options={assetOptions}
            value={selectedAssetId ?? ''}
            onChange={(value) => onAssetSelect(value || null)}
            compact
          />
        </View>
      )}
      <View className="flex-row items-center gap-1">
        {canTogglePrice ? (
          <ChartShowPriceButton
            showPrice={showPrice}
            onToggle={onTogglePrice}
            compact
          />
        ) : null}
        {onClose ? (
          <Pressable
            onPress={onClose}
            accessibilityRole="button"
            accessibilityLabel="Закрыть график"
            className="h-8 w-8 items-center justify-center rounded-lg border border-[#21262d] bg-[#0F1115]/95">
            <X size={16} color="#87A3AB" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
};

import { Pressable, ScrollView, Text, View } from 'react-native';
import { LayoutGrid, Star, X } from 'lucide-react-native';
import { Spinner } from 'heroui-native/spinner';
import { useUserStore } from '@entities/user';
import { AuthPopupState } from '@widgets/auth-popup/model/authPopupState';
import { useAuthNavigation } from '@widgets/auth-popup/model/useAuthNavigation';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import { cn } from '@shared/lib/cn';
import { signalFilterOptions } from '../config/constants';
import { useSignals, signalsAssetTypeOptions } from '../model/useSignals';
import type { SignalsControllerProps, SignalTypeId } from '../model/types';
import { SignalsSelect } from './SignalsSelect';
import { SignalSparkline } from './SignalSparkline';
import { SignalsTable } from './SignalsTable';

export const SignalsController = ({
  selectedAssetId,
  onClearSelectedAsset,
}: SignalsControllerProps) => {
  const {
    assetType,
    signalType,
    setSignalType,
    onlyFavorites,
    setOnlyFavorites,
    assets,
    filteredAssets,
    filteredUnavailableAssets,
    handleAssetTypeChange,
    handleReset,
  } = useSignals({ selectedAssetId, onClearSelectedAsset });

  const isAuthorized = useUserStore(state => state.isAuthorized);
  const { navigateWithAuth } = useAuthNavigation();

  const handleFavoritesClick = () => {
    if (!isAuthorized) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }
    setOnlyFavorites(true);
  };

  const selectedAsset =
    selectedAssetId != null
      ? [...assets.available, ...assets.unavailable].find(
          asset => asset.id === selectedAssetId,
        )
      : null;

  return (
    <ScrollView
      className="bg-background"
      contentContainerClassName="px-4 py-3 pb-28"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-row items-center justify-between gap-3 mb-4">
        <Text className="flex-1 shrink text-xl font-bold tracking-tight text-white">
          Сигналы изменения поведения рынка
        </Text>
        <View className="flex-row items-center gap-1 self-start rounded-xl border border-white/10 bg-white/5 p-1">
          <Pressable
            onPress={() => setOnlyFavorites(false)}
            accessibilityLabel="Табличный вид"
            className={cn(
              'h-8 w-8 items-center justify-center rounded-lg',
              !onlyFavorites ? 'bg-primary' : 'active:bg-white/5',
            )}
          >
            <LayoutGrid
              color={!onlyFavorites ? '#051014' : 'rgba(255,255,255,0.35)'}
              size={16}
            />
          </Pressable>
          <Pressable
            onPress={handleFavoritesClick}
            accessibilityLabel="Избранное"
            className={cn(
              'h-8 w-8 items-center justify-center rounded-lg',
              onlyFavorites ? 'bg-primary' : 'active:bg-white/5',
            )}
          >
            <Star
              color={onlyFavorites ? '#051014' : 'rgba(255,255,255,0.35)'}
              size={16}
              fill={onlyFavorites ? '#051014' : 'none'}
            />
          </Pressable>
        </View>
      </View>

      <View className="rounded-2xl border border-[#464B52] bg-[#0F1115] p-3 gap-3 mb-4">
        <View className="gap-2">
          <SignalsSelect
            ariaLabel="Тип актива"
            options={signalsAssetTypeOptions}
            placeholder="Все активы"
            value={assetType}
            onChange={handleAssetTypeChange}
          />
          <SignalsSelect
            ariaLabel="Тип сигнала"
            options={signalFilterOptions}
            placeholder="Все сигналы"
            value={signalType}
            onChange={value => setSignalType(value as SignalTypeId)}
          />
        </View>
        <Pressable
          onPress={handleReset}
          className="self-start rounded-lg px-3 py-2"
        >
          <Text className="text-xs font-semibold text-primary">Сбросить</Text>
        </Pressable>
      </View>

      {selectedAsset ? (
        <View className="gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3 mb-4">
          <Text className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
            Фильтр по поиску
          </Text>
          <View className="flex-row items-center justify-between gap-3">
            <Text
              className="flex-1 shrink text-sm font-semibold text-white"
              numberOfLines={1}
            >
              {formatAssetDisplayName(selectedAsset.name)}
            </Text>
            <Pressable
              onPress={onClearSelectedAsset}
              className="flex-row items-center gap-2 rounded-lg px-3 py-2"
            >
              <X color="rgba(255,255,255,0.6)" size={16} />
              <Text className="text-xs font-semibold text-white/60">
                Очистить
              </Text>
            </Pressable>
          </View>
        </View>
      ) : null}

      <View className="rounded-2xl border border-white/10 bg-[#0F1115] px-4 py-3 gap-2 mb-4">
        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
          <View className="flex-row items-center gap-2">
            <View className="h-1.5 w-5 rounded-full bg-[#4ADE80]" />
            <Text className="text-[11px] font-medium text-white/45">
              зелёный — перекупленность
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-1.5 w-5 rounded-full bg-[#EF4444]" />
            <Text className="text-[11px] font-medium text-white/45">
              красный — перепроданность
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <SignalSparkline />
            <Text className="text-[11px] font-medium text-white/45">
              серый — нет сигнала
            </Text>
          </View>
        </View>
        <Text className="text-xs leading-relaxed text-white/35">
          Цвет линии в колонке «Сигнал» показывает наличие сигнала хотя бы у
          одной группы участников. Точные значения смотри в колонках «Юр. лица»
          и «Физ. лица».
        </Text>
      </View>

      {assets.isLoading ? (
        <View className="items-center justify-center rounded-2xl bg-[#0F1115] py-16">
          <View className="flex-row items-center gap-2">
            <Spinner size="sm" />
            <Text className="text-sm font-semibold text-white/55">
              Загрузка активов
            </Text>
          </View>
        </View>
      ) : (
        <View className="gap-5">
          <SignalsTable assets={filteredAssets} title="Доступные сигналы" />
          {filteredUnavailableAssets.length > 0 ? (
            <SignalsTable
              assets={filteredUnavailableAssets}
              title="Недоступные"
              isUnavailable
            />
          ) : null}
        </View>
      )}
    </ScrollView>
  );
};

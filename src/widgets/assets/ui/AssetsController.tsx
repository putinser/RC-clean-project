import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { Search, Star, X } from 'lucide-react-native';
import { Spinner } from 'heroui-native/spinner';
import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '@entities/user';
import { AuthPopupState } from '@widgets/auth-popup/model/authPopupState';
import { useAuthNavigation } from '@widgets/auth-popup/model/useAuthNavigation';
import { assetTypeTabOptions } from '@widgets/chart/config/assetTypes';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import {ChartSelect} from '@widgets/chart/ui/ChartSelect';
import {useLandingScrollStore} from '@widgets/landing/model/landingScroll';
import {cn} from '@shared/lib/cn';
import type {MainTabNavigation} from '@shared/types/navigation';
import { useAssetsPage } from '../model/useAssetsPage';
import type { AssetsControllerProps } from '../model/types';
import { AssetsTable } from './AssetsTable';

export const AssetsController = ({
  selectedAssetId,
  onClearSelectedAsset,
}: AssetsControllerProps) => {
  const navigation = useNavigation<MainTabNavigation>();
  const setPendingAnchor = useLandingScrollStore(s => s.setPendingAnchor);
  const {
    assetType,
    searchQuery,
    onlyFavorites,
    setOnlyFavorites,
    assets,
    filteredAvailableAssets,
    filteredUnavailableAssets,
    handleAssetTypeChange,
    handleSearchChange,
    handleReset,
  } = useAssetsPage({ selectedAssetId, onClearSelectedAsset });

  const isAuthorized = useUserStore(state => state.isAuthorized);
  const { navigateWithAuth } = useAuthNavigation();

  const handleFavoritesClick = () => {
    if (!isAuthorized) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }
    setOnlyFavorites(!onlyFavorites);
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
      <View className="mb-4">
        <Text className="text-xs font-semibold uppercase tracking-[0.24em] text-primary/70">
          Каталог инструментов
        </Text>
        <Text className="mt-2 text-2xl font-bold tracking-tight text-white">
          Активы
        </Text>
        <Text className="mt-2 text-sm leading-relaxed text-white/45">
          Выбирайте доступные инструменты, отслеживайте online-цены и открывайте
          график в один клик.
        </Text>
      </View>

      <View className="mb-4 rounded-2xl border border-[#464B52] bg-[#0F1115] p-3 gap-3">
        <ChartSelect
          ariaLabel="Тип актива"
          options={assetTypeTabOptions.map(option => ({
            id: option.id,
            label1: option.label,
          }))}
          value={assetType}
          onChange={handleAssetTypeChange}
        />

        <View className="relative">
          <View className="absolute left-3.5 top-0 bottom-0 justify-center z-10">
            <Search color="rgba(255,255,255,0.3)" size={16} />
          </View>
          <TextInput
            value={searchQuery}
            onChangeText={handleSearchChange}
            placeholder="Поиск по названию или ISIN"
            placeholderTextColor="rgba(255,255,255,0.3)"
            className="h-10 rounded-[10px] border border-[#464B52] bg-[#12151B] py-2 pl-10 pr-10 text-sm text-white"
          />
          {searchQuery ? (
            <Pressable
              onPress={() => handleSearchChange('')}
              accessibilityLabel="Очистить поиск"
              className="absolute right-3 top-0 bottom-0 justify-center"
            >
              <X color="rgba(255,255,255,0.35)" size={16} />
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row flex-wrap items-center gap-2">
          <Pressable
            onPress={handleFavoritesClick}
            className={cn(
              'flex-row items-center gap-2 rounded-lg px-3 py-2',
              onlyFavorites ? 'bg-primary' : 'active:bg-white/10',
            )}
          >
            <Star
              color={onlyFavorites ? '#051014' : 'rgba(255,255,255,0.45)'}
              size={16}
              fill={onlyFavorites ? '#051014' : 'none'}
            />
            <Text
              className={cn(
                'text-xs font-semibold',
                onlyFavorites ? 'text-[#051014]' : 'text-white/45',
              )}
            >
              Избранное
            </Text>
          </Pressable>
          <Pressable onPress={handleReset} className="rounded-lg px-3 py-2">
            <Text className="text-xs font-semibold text-primary">Сбросить</Text>
          </Pressable>
        </View>
      </View>

      {selectedAsset ? (
        <View className="mb-4 gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
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

      <View className="mb-4 rounded-2xl border border-white/10 bg-[#0F1115] px-4 py-3">
        <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
          <View className="flex-row items-center gap-2">
            <View className="h-1.5 w-5 rounded-full bg-[#4ADE80]" />
            <Text className="text-[11px] font-medium text-white/45">
              онлайн-данные
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-1.5 w-5 rounded-full bg-[#EF4444]" />
            <Text className="text-[11px] font-medium text-white/45">
              отрицательное изменение
            </Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="h-1.5 w-5 rounded-full bg-white/20" />
            <Text className="text-[11px] font-medium text-white/45">
              недоступно в текущем тарифе
            </Text>
          </View>
        </View>
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
          <AssetsTable
            assets={filteredAvailableAssets}
            title="Доступные вам"
            description="Данные обновляются каждые 5 минут в режиме online."
          />
          {filteredUnavailableAssets.length > 0 ? (
            <View className="gap-3">
              <View className="gap-3 rounded-2xl border border-primary/15 bg-primary/5 px-4 py-3">
                <Text className="text-sm font-bold text-white/85">
                  Нужны остальные активы?
                </Text>
                <Text className="text-xs leading-relaxed text-white/35">
                  Откройте доступ к закрытым инструментам через тарифный план.
                </Text>
                <Pressable
                  onPress={() => {
                    navigation.navigate('Home');
                    setPendingAnchor('tariffs');
                  }}
                  className="mt-1 h-10 items-center justify-center rounded-lg bg-primary px-4"
                >
                  <Text className="text-sm font-bold text-[#051014]">
                    Разблокировать
                  </Text>
                </Pressable>
              </View>
              <AssetsTable
                assets={filteredUnavailableAssets}
                title="Недоступные"
                isUnavailable
              />
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
};

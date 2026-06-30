import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { BookmarkPlus, Lock, Star, Trash2, X } from 'lucide-react-native';
import { Spinner } from 'heroui-native/spinner';
import { useUserStore } from '@entities/user';
import { AuthPopupState } from '@widgets/auth-popup/model/authPopupState';
import { useAuthNavigation } from '@widgets/auth-popup/model/useAuthNavigation';
import { ChartSelect } from '@widgets/chart/ui/ChartSelect';
import { formatAssetDisplayName } from '@widgets/chart/lib/formatAssetDisplayName';
import { useLandingScrollStore } from '@widgets/landing/model/landingScroll';
import type {
  ScreenerPeriod,
  ScreenerSortDirection,
  ScreenerSortMetric,
  ScreenerView,
} from '@services/screener/types';
import { cn } from '@shared/lib/cn';
import type { MainTabNavigation } from '@shared/types/navigation';
import {
  screenerAssetClassOptions,
  screenerChangeSortOptions,
  screenerDirectionOptions,
  screenerPeriodOptions,
  screenerRatioSortOptions,
  screenerSegmentOptions,
  screenerViewOptions,
} from '../config/constants';
import { useScreener } from '../model/useScreener';
import type { ScreenerControllerProps } from '../model/types';
import { ScreenerPresetModal } from './ScreenerPresetModal';
import { ScreenerTable } from './ScreenerTable';

export const ScreenerController = ({
  selectedAssetId,
  selectedAssetName,
  onClearSelectedAsset,
}: ScreenerControllerProps) => {
  const navigation = useNavigation<MainTabNavigation>();
  const setPendingAnchor = useLandingScrollStore(s => s.setPendingAnchor);
  const [presetModalVisible, setPresetModalVisible] = useState(false);

  const {
    assetClass,
    izFiz,
    period,
    view,
    sort,
    direction,
    systemPresetId,
    onlyFavorites,
    state,
    presets,
    presetMessage,
    visibleItems,
    hasMore,
    setPeriod,
    setSort,
    setDirection,
    setSystemPresetId,
    setOnlyFavorites,
    loadMore,
    handleAssetClassChange,
    handleIzFizChange,
    handleViewChange,
    handleReset,
    applyUserPreset,
    saveUserPreset,
    deleteUserPreset,
  } = useScreener({ selectedAssetId, selectedAssetName, onClearSelectedAsset });

  const isAuthorized = useUserStore(store => store.isAuthorized);
  const { navigateWithAuth } = useAuthNavigation();
  const sortOptions =
    view === 'ratios' ? screenerRatioSortOptions : screenerChangeSortOptions;

  const handleFavoritesClick = () => {
    if (!isAuthorized) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }
    setOnlyFavorites(!onlyFavorites);
  };

  const openTariffs = () => {
    navigation.navigate('Home');
    setPendingAnchor('tariffs');
  };

  const renderAccessState = () => {
    if (state.accessStatus === 'checking' || (state.isLoading && !state.data)) {
      return (
        <View className="items-center justify-center rounded-2xl border border-white/10 bg-[#0F1115] py-16">
          <View className="flex-row items-center gap-2">
            <Spinner size="sm" />
            <Text className="text-sm font-semibold text-white/55">
              Проверяем доступ к скринеру
            </Text>
          </View>
        </View>
      );
    }

    if (state.accessStatus === 'unauthorized') {
      return (
        <View className="gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <Lock color="#56d1fb" size={32} />
          <Text className="text-xl font-bold text-white">
            Войдите в аккаунт
          </Text>
          <Text className="text-sm leading-relaxed text-white/45">
            Скринер работает с персональными тарифами и сохранёнными пресетами,
            поэтому для доступа нужна авторизация.
          </Text>
          <Pressable
            onPress={() => navigateWithAuth(AuthPopupState.LOGIN)}
            className="mt-2 h-10 items-center justify-center self-start rounded-lg bg-primary px-4"
          >
            <Text className="text-sm font-bold text-[#051014]">Войти</Text>
          </Pressable>
        </View>
      );
    }

    if (state.accessStatus === 'forbidden') {
      return (
        <View className="gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-6">
          <Lock color="#56d1fb" size={32} />
          <Text className="text-xl font-bold text-white">
            Нужен платный тариф
          </Text>
          <Text className="text-sm leading-relaxed text-white/45">
            Скринер доступен на платных тарифах. Обновите тариф, чтобы открыть
            фильтры по позициям, участникам и открытому интересу.
          </Text>
          <Pressable
            onPress={openTariffs}
            className="mt-2 h-10 items-center justify-center self-start rounded-lg bg-primary px-4"
          >
            <Text className="text-sm font-bold text-[#051014]">
              Смотреть тарифы
            </Text>
          </Pressable>
        </View>
      );
    }

    if (state.accessStatus === 'unavailable') {
      return (
        <View className="rounded-2xl border border-white/10 bg-[#0F1115] p-6">
          <Text className="text-xl font-bold text-white">
            Скринер недоступен
          </Text>
          <Text className="mt-2 text-sm leading-relaxed text-white/45">
            Сейчас доступ к скринеру закрыт. Попробуйте позже или проверьте
            права текущего аккаунта.
          </Text>
        </View>
      );
    }

    if (state.accessStatus === 'error') {
      return (
        <View className="rounded-2xl border border-[#EF4444]/20 bg-[#EF4444]/5 p-6">
          <Text className="text-xl font-bold text-white">
            Не удалось загрузить скринер
          </Text>
          <Text className="mt-2 text-sm leading-relaxed text-white/45">
            {state.error ?? 'Попробуйте обновить страницу.'}
          </Text>
        </View>
      );
    }

    return null;
  };

  const accessState = renderAccessState();

  return (
    <>
      <ScrollView
        className="bg-background"
        contentContainerClassName="px-4 py-3 pb-28"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-4">
          <Text className="text-2xl font-bold tracking-tight text-white">
            Скринер
          </Text>
          <View className="mt-4 border-b border-white/10" />
        </View>

        <View className="mb-4 rounded-2xl border border-[#464B52] bg-[#0F1115] p-3 gap-3">
          <ChartSelect
            ariaLabel="Класс актива"
            options={screenerAssetClassOptions}
            value={assetClass}
            onChange={handleAssetClassChange}
          />
          <ChartSelect
            ariaLabel="Группа участников"
            options={screenerSegmentOptions}
            value={String(izFiz)}
            onChange={handleIzFizChange}
          />
          {view === 'changes' ? (
            <ChartSelect
              ariaLabel="Период"
              options={screenerPeriodOptions}
              value={period}
              onChange={value => setPeriod(value as ScreenerPeriod)}
            />
          ) : null}
          <ChartSelect
            ariaLabel="Режим отображения"
            options={screenerViewOptions}
            value={view}
            onChange={value => handleViewChange(value as ScreenerView)}
          />

          <View className="border-t border-white/5 pt-3 gap-3">
            <ChartSelect
              ariaLabel="Сортировка"
              options={sortOptions}
              value={sort}
              onChange={value => setSort(value as ScreenerSortMetric)}
            />
            <ChartSelect
              ariaLabel="Направление"
              options={screenerDirectionOptions}
              value={direction}
              onChange={value => setDirection(value as ScreenerSortDirection)}
            />
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
            <Pressable
              onPress={() => setPresetModalVisible(true)}
              disabled={presets.isSaving || state.accessStatus !== 'available'}
              className="flex-row items-center gap-2 rounded-lg px-3 py-2 active:bg-white/10"
            >
              <BookmarkPlus color="rgba(255,255,255,0.45)" size={16} />
              <Text className="text-xs font-semibold text-white/45">
                Сохранить в пресеты
              </Text>
            </Pressable>
            <Pressable onPress={handleReset} className="rounded-lg px-3 py-2">
              <Text className="text-xs font-semibold text-primary">
                Сбросить
              </Text>
            </Pressable>
            {presetMessage ? (
              <Text className="text-xs font-semibold text-white/40">
                {presetMessage}
              </Text>
            ) : null}
          </View>

          {presets.system.length > 0 || presets.user.length > 0 ? (
            <View className="gap-3 border-t border-white/5 pt-3">
              {presets.system.length > 0 ? (
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-white/30">
                    Системные
                  </Text>
                  {presets.system.map(preset => (
                    <Pressable
                      key={preset.id}
                      onPress={() =>
                        setSystemPresetId(
                          systemPresetId === preset.id ? null : preset.id,
                        )
                      }
                      className={cn(
                        'rounded-full border px-3 py-1.5',
                        systemPresetId === preset.id
                          ? 'border-primary bg-primary/15'
                          : 'border-white/10 bg-white/5',
                      )}
                    >
                      <Text
                        className={cn(
                          'text-xs font-semibold',
                          systemPresetId === preset.id
                            ? 'text-primary'
                            : 'text-white/45',
                        )}
                      >
                        {preset.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              ) : null}
              {presets.user.length > 0 ? (
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="text-xs font-semibold uppercase tracking-wider text-white/30">
                    Мои
                  </Text>
                  {presets.user.map(preset => (
                    <View
                      key={preset.id}
                      className="flex-row overflow-hidden rounded-full border border-white/10 bg-white/5"
                    >
                      <Pressable
                        onPress={() => applyUserPreset(preset.id)}
                        className="px-3 py-1.5"
                      >
                        <Text className="text-xs font-semibold text-white/45">
                          {preset.name}
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => deleteUserPreset(preset.id)}
                        accessibilityLabel={`Удалить пресет ${preset.name}`}
                        className="border-l border-white/10 px-2 py-1.5"
                      >
                        <Trash2 color="rgba(255,255,255,0.3)" size={14} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          ) : null}
        </View>

        {selectedAssetName ? (
          <View className="mb-4 gap-2 rounded-2xl border border-primary/20 bg-primary/5 px-4 py-3">
            <Text className="text-[10px] font-semibold uppercase tracking-wider text-primary/70">
              Фильтр по поиску
            </Text>
            <View className="flex-row items-center justify-between gap-3">
              <Text
                className="flex-1 shrink text-sm font-semibold text-white"
                numberOfLines={1}
              >
                {formatAssetDisplayName(selectedAssetName)}
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
          {view === 'ratios' ? (
            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
              <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-5 rounded-full bg-[#16A34A]" />
                <Text className="text-[11px] font-medium text-white/45">
                  зелёный — покупки / покупатели
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-5 rounded-full bg-[#D946EF]" />
                <Text className="text-[11px] font-medium text-white/45">
                  фиолетовый — продажи / продавцы
                </Text>
              </View>
            </View>
          ) : (
            <View className="flex-row flex-wrap items-center gap-x-4 gap-y-2">
              <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-5 rounded-full bg-[#4ADE80]" />
                <Text className="text-[11px] font-medium text-white/45">
                  рост
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <View className="h-1.5 w-5 rounded-full bg-[#EF4444]" />
                <Text className="text-[11px] font-medium text-white/45">
                  снижение
                </Text>
              </View>
            </View>
          )}
        </View>

        {accessState ?? (
          <>
            {state.isLoading ? (
              <View className="items-center justify-center rounded-2xl bg-[#0F1115] py-16">
                <View className="flex-row items-center gap-2">
                  <Spinner size="sm" />
                  <Text className="text-sm font-semibold text-white/55">
                    Загрузка скринера
                  </Text>
                </View>
              </View>
            ) : (
              <ScreenerTable
                items={visibleItems}
                total={state.data?.meta.total ?? 0}
                view={view}
                hasMore={hasMore}
                isLoadingMore={state.isLoadingMore}
                onLoadMore={loadMore}
              />
            )}
          </>
        )}
      </ScrollView>

      <ScreenerPresetModal
        visible={presetModalVisible}
        isSaving={presets.isSaving}
        onClose={() => setPresetModalVisible(false)}
        onSave={saveUserPreset}
      />
    </>
  );
};

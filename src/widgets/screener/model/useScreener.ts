import { useEffect, useMemo, useState } from 'react';
import { useFavoritesStore } from '@entities/favorite';
import { useUserStore } from '@entities/user';
import { serviceScreener } from '@services/screener';
import type {
  CreateScreenerPresetPayload,
  ScreenerAssetClass,
  ScreenerIzFiz,
  ScreenerListParams,
  ScreenerPeriod,
  ScreenerSortDirection,
  ScreenerSortMetric,
  ScreenerView,
} from '@services/screener/types';
import {
  assetTypeToScreenerAssetClass,
  screenerShownLimit,
} from '../config/constants';
import type {
  ScreenerAccessStatus,
  ScreenerPresetsState,
  ScreenerState,
} from './types';

const DEFAULT_ASSET_CLASS: ScreenerAssetClass = 'stocks';
const DEFAULT_IZ_FIZ: ScreenerIzFiz = 0;
const DEFAULT_PERIOD: ScreenerPeriod = '1d';
const DEFAULT_VIEW: ScreenerView = 'ratios';
const DEFAULT_RATIO_SORT: ScreenerSortMetric = 'positions_long_ratio';
const DEFAULT_CHANGE_SORT: ScreenerSortMetric = 'positions_long_change';
const DEFAULT_DIRECTION: ScreenerSortDirection = 'desc';

interface UseScreenerParams {
  selectedAssetId?: number | null;
  selectedAssetName?: string | null;
  onClearSelectedAsset?: () => void;
}

function getAccessStatus(status: number): ScreenerAccessStatus {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'unavailable';
  return 'error';
}

function buildParams({
  assetClass,
  izFiz,
  period,
  sort,
  direction,
  search,
  systemPresetId,
  offset,
}: {
  assetClass: ScreenerAssetClass;
  izFiz: ScreenerIzFiz;
  period: ScreenerPeriod;
  sort: ScreenerSortMetric;
  direction: ScreenerSortDirection;
  search: string;
  systemPresetId: number | null;
  offset: number;
}): ScreenerListParams {
  return {
    period,
    iz_fiz: izFiz,
    asset_class: assetClass,
    sort,
    direction,
    limit: screenerShownLimit,
    offset,
    search: search || null,
    system_preset_id: systemPresetId,
  };
}

export const useScreener = ({
  selectedAssetId,
  selectedAssetName,
  onClearSelectedAsset,
}: UseScreenerParams) => {
  const [assetClass, setAssetClass] =
    useState<ScreenerAssetClass>(DEFAULT_ASSET_CLASS);
  const [izFiz, setIzFiz] = useState<ScreenerIzFiz>(DEFAULT_IZ_FIZ);
  const [period, setPeriod] = useState<ScreenerPeriod>(DEFAULT_PERIOD);
  const [view, setView] = useState<ScreenerView>(DEFAULT_VIEW);
  const [sort, setSort] = useState<ScreenerSortMetric>(DEFAULT_RATIO_SORT);
  const [direction, setDirection] =
    useState<ScreenerSortDirection>(DEFAULT_DIRECTION);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [systemPresetId, setSystemPresetId] = useState<number | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [presetMessage, setPresetMessage] = useState<string | null>(null);
  const [state, setState] = useState<ScreenerState>({
    data: null,
    isLoading: true,
    isLoadingMore: false,
    accessStatus: 'checking',
    error: null,
  });
  const [presets, setPresets] = useState<ScreenerPresetsState>({
    system: [],
    user: [],
    isLoading: false,
    isSaving: false,
  });

  const favorites = useFavoritesStore(store => store.favorites);
  const fetchFavorites = useFavoritesStore(store => store.fetchFavorites);
  const isAuthorized = useUserStore(store => store.isAuthorized);
  const loadingStatus = useUserStore(store => store.loadingStatus);

  const activeSearch = selectedAssetName ?? debouncedSearchQuery;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    if (isAuthorized) {
      fetchFavorites();
    } else {
      setOnlyFavorites(false);
    }
  }, [fetchFavorites, isAuthorized]);

  useEffect(() => {
    let isCancelled = false;

    const checkAvailability = async () => {
      if (loadingStatus !== 'loaded') {
        setState(prev => ({ ...prev, accessStatus: 'checking' }));
        return;
      }

      if (!isAuthorized) {
        setState({
          data: null,
          isLoading: false,
          isLoadingMore: false,
          accessStatus: 'unauthorized',
          error: null,
        });
        return;
      }

      setState(prev => ({ ...prev, accessStatus: 'checking' }));
      const result = await serviceScreener.getAvailability();

      if (isCancelled) return;

      if (result.success && result.data) {
        setState(prev => ({
          ...prev,
          accessStatus: 'available',
          error: null,
        }));
        return;
      }

      setState({
        data: null,
        isLoading: false,
        isLoadingMore: false,
        accessStatus: result.success
          ? 'unavailable'
          : getAccessStatus(result.status),
        error: result.success ? null : result.message,
      });
    };

    checkAvailability();
    return () => {
      isCancelled = true;
    };
  }, [isAuthorized, loadingStatus]);

  useEffect(() => {
    let isCancelled = false;

    const fetchPresets = async () => {
      if (state.accessStatus !== 'available') return;

      setPresets(prev => ({ ...prev, isLoading: true }));
      const [systemResult, userResult] = await Promise.all([
        serviceScreener.getSystemPresets({
          asset_class: assetClass,
          iz_fiz: izFiz,
        }),
        serviceScreener.getPresets(),
      ]);

      if (isCancelled) return;

      setPresets(prev => ({
        ...prev,
        system: systemResult.success ? systemResult.data : [],
        user: userResult.success ? userResult.data : prev.user,
        isLoading: false,
      }));
    };

    fetchPresets();
    return () => {
      isCancelled = true;
    };
  }, [assetClass, izFiz, state.accessStatus]);

  useEffect(() => {
    let isCancelled = false;

    const fetchList = async () => {
      if (state.accessStatus !== 'available') return;

      setState(prev => ({
        ...prev,
        isLoading: true,
        isLoadingMore: false,
        error: null,
      }));

      const result = await serviceScreener.getList(
        buildParams({
          assetClass,
          izFiz,
          period,
          sort,
          direction,
          search: activeSearch,
          systemPresetId,
          offset: 0,
        }),
      );

      if (isCancelled) return;

      if (result.success) {
        setState({
          data: result.data,
          isLoading: false,
          isLoadingMore: false,
          accessStatus: 'available',
          error: null,
        });
        return;
      }

      setState({
        data: null,
        isLoading: false,
        isLoadingMore: false,
        accessStatus: getAccessStatus(result.status),
        error: result.message,
      });
    };

    fetchList();
    return () => {
      isCancelled = true;
    };
  }, [
    activeSearch,
    assetClass,
    direction,
    izFiz,
    period,
    sort,
    state.accessStatus,
    systemPresetId,
  ]);

  const visibleItems = useMemo(() => {
    let items = state.data?.items ?? [];

    if (onlyFavorites) {
      items = items.filter(item => favorites.includes(item.asset.id));
    }

    if (selectedAssetId) {
      return items.filter(item => item.asset.id === selectedAssetId);
    }

    return items;
  }, [favorites, onlyFavorites, selectedAssetId, state.data]);

  const hasMore =
    !selectedAssetId &&
    Boolean(state.data) &&
    (state.data?.items.length ?? 0) < (state.data?.meta.total ?? 0);

  const loadMore = async () => {
    if (!state.data || state.isLoadingMore || !hasMore) return;

    setState(prev => ({ ...prev, isLoadingMore: true }));

    const result = await serviceScreener.getList(
      buildParams({
        assetClass,
        izFiz,
        period,
        sort,
        direction,
        search: activeSearch,
        systemPresetId,
        offset: state.data.items.length,
      }),
    );

    if (result.success) {
      setState(prev => ({
        ...prev,
        data: prev.data
          ? {
              items: [...prev.data.items, ...result.data.items],
              meta: result.data.meta,
            }
          : result.data,
        isLoadingMore: false,
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isLoadingMore: false,
      error: result.message,
    }));
  };

  const handleAssetClassChange = (value: string) => {
    setAssetClass(value as ScreenerAssetClass);
    setSystemPresetId(null);
    setSearchQuery('');
    onClearSelectedAsset?.();
  };

  const handleIzFizChange = (value: string) => {
    setIzFiz(Number(value) as ScreenerIzFiz);
    setSystemPresetId(null);
  };

  const handleViewChange = (nextView: ScreenerView) => {
    setView(nextView);
    setSort(nextView === 'ratios' ? DEFAULT_RATIO_SORT : DEFAULT_CHANGE_SORT);
    setPeriod(nextView === 'ratios' ? '1d' : '5m');
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    onClearSelectedAsset?.();
  };

  const handleReset = () => {
    setAssetClass(DEFAULT_ASSET_CLASS);
    setIzFiz(DEFAULT_IZ_FIZ);
    setPeriod(DEFAULT_PERIOD);
    setView(DEFAULT_VIEW);
    setSort(DEFAULT_RATIO_SORT);
    setDirection(DEFAULT_DIRECTION);
    setSearchQuery('');
    setDebouncedSearchQuery('');
    setSystemPresetId(null);
    setOnlyFavorites(false);
    setPresetMessage(null);
    onClearSelectedAsset?.();
  };

  const applyUserPreset = (id: number) => {
    const preset = presets.user.find(item => item.id === id);
    if (!preset) return;

    setAssetClass(preset.asset_class);
    setIzFiz(preset.iz_fiz);
    setPeriod(preset.period);
    setView(preset.view);
    setSort(preset.sort);
    setDirection(preset.direction);
    setSystemPresetId(null);
    setSearchQuery('');
    onClearSelectedAsset?.();
  };

  const saveUserPreset = async (name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const payload: CreateScreenerPresetPayload = {
      name: trimmedName,
      asset_class: assetClass,
      view,
      iz_fiz: izFiz,
      period,
      sort,
      direction,
    };

    setPresets(prev => ({ ...prev, isSaving: true }));
    setPresetMessage(null);
    const result = await serviceScreener.createPreset(payload);

    if (result.success) {
      setPresets(prev => ({
        ...prev,
        user: [result.data, ...prev.user],
        isSaving: false,
      }));
      setPresetMessage('Пресет сохранён');
      return;
    }

    setPresets(prev => ({ ...prev, isSaving: false }));
    setPresetMessage(result.message);
  };

  const deleteUserPreset = async (id: number) => {
    const result = await serviceScreener.deletePreset(id);
    if (result.success) {
      setPresets(prev => ({
        ...prev,
        user: prev.user.filter(item => item.id !== id),
      }));
    }
  };

  return {
    assetClass,
    izFiz,
    period,
    view,
    sort,
    direction,
    searchQuery,
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
    handleSearchChange,
    handleReset,
    applyUserPreset,
    saveUserPreset,
    deleteUserPreset,
  };
};

export { assetTypeToScreenerAssetClass };

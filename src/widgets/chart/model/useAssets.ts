import {useEffect, useRef, useState} from 'react';
import {useUserStore} from '@entities/user';
import {serviceAssets} from '@services/assets';
import type {
  Asset,
  AssetItem,
  GetAssetsParams,
  PriceReportItem,
  RsiReportItem,
} from '@services/assets/types';
import {type AssetTypeId, EassetTypes} from '../config/assetTypes';
import type {ChartIntervalId} from '../config/chartInterval';
import type {ChartPeriodId} from '../config/chartPeriod';
import {
  type ChartViewId,
  getChartDataMode,
  getChartPositionFetcher,
  getChartPriceReportFetcher,
  getChartPriceReportType,
  getChartRsiFetcher,
} from '../config/chartView';
import {getApiParams} from '../lib/chartFilters';

interface AssetsState {
  available: Asset[];
  unavailable: Asset[];
  isLoading: boolean;
}

export const useAssets = (
  assetType: AssetTypeId = EassetTypes.STOCK,
  view: ChartViewId,
  selectedAssetId: string | null,
  interval: ChartIntervalId,
  period: ChartPeriodId,
  isFiz: boolean,
  searchQuery: string = '',
) => {
  const [assets, setAssets] = useState<AssetsState>({
    available: [],
    unavailable: [],
    isLoading: true,
  });
  const [isLoadingAssets, setIsLoadingAssets] = useState(true);
  const [assetsLegal, setAssetsLegal] = useState<AssetItem[]>([]);
  const [assetsPrice, setAssetsPrice] = useState<AssetItem[]>([]);
  const [assetsRsi, setAssetsRsi] = useState<RsiReportItem[]>([]);
  const [assetsPriceReport, setAssetsPriceReport] = useState<PriceReportItem[]>(
    [],
  );
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>(
    undefined,
  );
  const assetsCacheRef = useRef<
    Partial<
      Record<AssetTypeId, Pick<AssetsState, 'available' | 'unavailable'>>
    >
  >({});
  const chartDataMode = getChartDataMode(view);
  const fetchPosition = getChartPositionFetcher(view);
  const fetchRsi = getChartRsiFetcher(view);
  const fetchPriceReport = getChartPriceReportFetcher(view);
  const priceReportType = getChartPriceReportType(view);
  const isAuthorized = useUserStore((state) => state.isAuthorized);

  useEffect(() => {
    const found =
      assets.available.find((a) => String(a.id) === selectedAssetId) ||
      assets.unavailable.find((a) => String(a.id) === selectedAssetId);
    if (found) {
      setSelectedAsset(found);
      return;
    }
    setSelectedAsset(undefined);
  }, [assets.available, assets.unavailable, selectedAssetId]);

  useEffect(() => {
    let isCancelled = false;
    const fetchAssets = async () => {
      if (searchQuery) {
        try {
          setAssets((prev) => ({...prev, isLoading: true}));
          const data = await serviceAssets.getAssets('', searchQuery);
          if (!isCancelled) {
            setAssets({
              available: data.avalible,
              unavailable: data.unavalible,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Failed to fetch search assets:', error);
          if (!isCancelled) {
            setAssets({
              available: [],
              unavailable: [],
              isLoading: false,
            });
          }
        }
        return;
      }

      const cached = assetsCacheRef.current[assetType];
      if (cached) {
        setAssets({
          available: cached.available,
          unavailable: cached.unavailable,
          isLoading: false,
        });
        return;
      }

      try {
        setAssets((prev) => ({...prev, isLoading: true}));
        const data = await serviceAssets.getAssets(assetType);

        if (!isCancelled) {
          assetsCacheRef.current[assetType] = {
            available: data.avalible,
            unavailable: data.unavalible,
          };
          setAssets({
            available: data.avalible,
            unavailable: data.unavalible,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Failed to fetch assets:', error);
        if (!isCancelled) {
          setAssets({
            available: [],
            unavailable: [],
            isLoading: false,
          });
        }
      }
    };

    fetchAssets();

    return () => {
      isCancelled = true;
    };
  }, [assetType, isAuthorized, searchQuery]);

  useEffect(() => {
    let isCancelled = false;

    const clearChartData = () => {
      setAssetsLegal([]);
      setAssetsPrice([]);
      setAssetsRsi([]);
      setAssetsPriceReport([]);
    };

    const fetchChartData = async () => {
      if (!chartDataMode) {
        clearChartData();
        setIsLoadingAssets(false);
        return;
      }

      if (!selectedAssetId) {
        clearChartData();
        setIsLoadingAssets(false);
        return;
      }

      const {
        from,
        to,
        interval: apiInterval,
        type: apiType,
      } = getApiParams(interval, period);

      const baseParams: GetAssetsParams = {
        from,
        to,
        interval: apiInterval,
        type: apiType,
        iz_fiz: isFiz,
        id: Number(selectedAssetId),
      };

      try {
        setIsLoadingAssets(true);

        if (chartDataMode === 'position' && fetchPosition) {
          const priceParams: GetAssetsParams = {
            ...baseParams,
            additional_report_type: priceReportType,
          };
          const [positionAssets, priceAssets] = await Promise.all([
            fetchPosition(baseParams),
            serviceAssets.getAssetsPrice(priceParams),
          ]);

          if (!isCancelled) {
            setAssetsLegal(positionAssets);
            setAssetsPrice(priceAssets);
            setAssetsRsi([]);
            setAssetsPriceReport([]);
            setIsLoadingAssets(false);
          }
          return;
        }

        if (chartDataMode === 'rsi' && fetchRsi) {
          const rsiAssets = await fetchRsi(baseParams);

          if (!isCancelled) {
            setAssetsLegal([]);
            setAssetsPrice([]);
            setAssetsRsi(rsiAssets);
            setAssetsPriceReport([]);
            setIsLoadingAssets(false);
          }
          return;
        }

        if (chartDataMode === 'price-only' && fetchPriceReport) {
          const priceReportAssets = await fetchPriceReport(baseParams);

          if (!isCancelled) {
            setAssetsLegal([]);
            setAssetsPrice([]);
            setAssetsRsi([]);
            setAssetsPriceReport(priceReportAssets);
            setIsLoadingAssets(false);
          }
        }
      } catch (error) {
        console.error('Failed to fetch chart data:', error);
        if (!isCancelled) {
          clearChartData();
          setIsLoadingAssets(false);
        }
      }
    };

    fetchChartData();

    return () => {
      isCancelled = true;
    };
  }, [
    chartDataMode,
    fetchPosition,
    fetchRsi,
    fetchPriceReport,
    priceReportType,
    selectedAssetId,
    interval,
    period,
    isFiz,
  ]);

  return {
    assetsLegal,
    assetsPrice,
    assetsRsi,
    assetsPriceReport,
    availableAssets: assets.available,
    unavailableAssets: assets.unavailable,
    isLoading: assets.isLoading,
    selectedAsset,
    isLoadingAssets,
  };
};

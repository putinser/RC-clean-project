export type AssetType = 'stock' | 'currency' | 'product' | 'index' | 'other';

export type AssetPrice = {
  value: number;
  daily_changes_perc: number;
  daily_changes_value: number;
};

export type AssetRsiStatus = 'overbought' | 'oversold';

export type AssetRsiValue = {
  value: number;
  status: AssetRsiStatus;
  overbought: number;
  oversold: number;
};

export type AssetRsi = {
  fiz: AssetRsiValue;
  yur: AssetRsiValue;
};

export type Asset = {
  id: number;
  type: AssetType;
  name: string;
  isin: string;
  isOnline: boolean;
  available: boolean;
  price: AssetPrice;
  rsi: AssetRsi;
};

export type AssetsData = {
  avalible: Asset[];
  unavalible: Asset[];
};

export type AssetsResponse = {
  success: boolean;
  data: AssetsData;
  error: unknown;
};

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

export interface AssetValue {
  long: number;
  short: number;
  pure: number;
  open: number;
}

export interface AssetItem {
  moment: string;
  value: AssetValue;
}

export interface RsiReportItem {
  moment: string;
  value: number;
}

export interface PriceReportItem {
  moment: string;
  value: number | null;
  rsi: number;
}

export interface GetAssetsParams {
  from?: number;
  id: number;
  to?: number;
  interval: number;
  type?: string;
  iz_fiz?: boolean;
  additional_report_type?: string;
}

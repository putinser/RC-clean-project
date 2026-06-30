export type ScreenerAssetClass =
  | 'stocks'
  | 'currencies'
  | 'commodities'
  | 'indices'
  | 'others';

export type ScreenerPeriod = '5m' | '1h' | '1d' | '1w' | '1mo';

export type ScreenerIzFiz = 0 | 1;

export type ScreenerSortDirection = 'asc' | 'desc';

export type ScreenerView = 'ratios' | 'changes';

export type ScreenerSortMetric =
  | 'positions_long_ratio'
  | 'positions_short_ratio'
  | 'participants_long_ratio'
  | 'participants_short_ratio'
  | 'positions_long_change'
  | 'positions_short_change'
  | 'participants_long_change'
  | 'participants_short_change'
  | 'net_position_change'
  | 'net_participants_change'
  | 'open_interest_positions_change'
  | 'open_interest_participants_change';

export type ScreenerRatioDirection =
  | 'towards_long'
  | 'towards_short'
  | 'neutral'
  | null;

export type ScreenerChangeSign = -1 | 0 | 1 | null;

export type ScreenerAssetMetadata = {
  id: number;
  name: string;
  base_code: string | null;
  isin: string | null;
  type: 'stock' | 'currency' | 'product' | 'index' | 'other';
  asset_class?: ScreenerAssetClass | null;
  is_online: boolean;
  last_price: number | null;
  last_price_change_percent: number | null;
};

export type ScreenerRatioBlock = {
  long_percent: number | null;
  short_percent: number | null;
  direction: ScreenerRatioDirection;
  insufficient: string | null;
};

export type ScreenerChangeBlock = {
  value: number | null;
  sign: ScreenerChangeSign;
  insufficient: string | null;
};

export type ScreenerAssetSnapshot = {
  asset_id: number;
  period: ScreenerPeriod;
  iz_fiz: ScreenerIzFiz;
  as_of: string;
  positions: {
    ratio: ScreenerRatioBlock;
    change_long: ScreenerChangeBlock;
    change_short: ScreenerChangeBlock;
  };
  participants: {
    ratio: ScreenerRatioBlock;
    change_long: ScreenerChangeBlock;
    change_short: ScreenerChangeBlock;
  };
  net: {
    position_change: ScreenerChangeBlock;
    participants_change: ScreenerChangeBlock;
  };
  open_interest: {
    positions_change: ScreenerChangeBlock;
    participants_change: ScreenerChangeBlock;
  };
};

export type ScreenerListItem = {
  asset: ScreenerAssetMetadata;
  snapshot: ScreenerAssetSnapshot;
};

export type ScreenerListMeta = {
  total: number;
  limit: number;
  offset: number;
  period: ScreenerPeriod;
  iz_fiz: ScreenerIzFiz;
  asset_class: ScreenerAssetClass;
  sort: ScreenerSortMetric;
  direction: ScreenerSortDirection;
  search: string | null;
  system_preset_id: number | null;
};

export type ScreenerListData = {
  items: ScreenerListItem[];
  meta: ScreenerListMeta;
};

export type ScreenerListParams = {
  period: ScreenerPeriod;
  iz_fiz: ScreenerIzFiz;
  asset_class: ScreenerAssetClass;
  sort?: ScreenerSortMetric;
  direction?: ScreenerSortDirection;
  limit?: number;
  offset?: number;
  search?: string | null;
  system_preset_id?: number | null;
};

export type ScreenerSystemPreset = {
  id: number;
  name: string;
  asset_class: ScreenerAssetClass;
  iz_fiz: ScreenerIzFiz;
  sort_order: number;
  conditions: {
    metric: ScreenerSortMetric;
    operator: 'gte' | 'lte' | 'gt' | 'lt' | 'eq' | 'between';
    value: number;
    value_to: number | null;
  }[];
};

export type ScreenerPreset = {
  id: number;
  name: string;
  asset_class: ScreenerAssetClass;
  view: ScreenerView;
  iz_fiz: ScreenerIzFiz;
  period: ScreenerPeriod;
  sort: ScreenerSortMetric;
  direction: ScreenerSortDirection;
  created_at: string;
};

export type CreateScreenerPresetPayload = {
  name: string;
  asset_class: ScreenerAssetClass;
  view?: ScreenerView;
  iz_fiz: ScreenerIzFiz;
  period: ScreenerPeriod;
  sort: ScreenerSortMetric;
  direction: ScreenerSortDirection;
};

export type ScreenerActionResult<T> =
  | { success: true; data: T; status?: number; message?: string }
  | { success: false; data: null; status: number; message: string };

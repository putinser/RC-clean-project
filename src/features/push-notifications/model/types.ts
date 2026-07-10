export type PushSignalAsset = {
  isin?: string;
  name?: string;
  rsiIndividual?: number;
  rsiLegal?: number;
  rsiIndividualStatus?: string;
  rsiLegalStatus?: string;
};

export type PushPayload = {
  type?: string;
  entityId?: string;
  deepLink?: string;
  assets?: PushSignalAsset[];
};

export type PushType = 'signal' | 'asset' | 'screener' | 'chart' | string;

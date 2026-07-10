import type {PushPayload, PushSignalAsset} from '../model/types';

const toNumber = (value: unknown): number | undefined => {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }

  return undefined;
};

const toStringValue = (value: unknown): string | undefined =>
  typeof value === 'string' ? value : undefined;

const parseAssets = (value: unknown): PushSignalAsset[] | undefined => {
  let raw = value;

  if (typeof raw === 'string') {
    try {
      raw = JSON.parse(raw);
    } catch {
      return undefined;
    }
  }

  if (!Array.isArray(raw)) {
    return undefined;
  }

  return raw.map((item) => {
    if (!item || typeof item !== 'object') {
      return {};
    }

    const asset = item as Record<string, unknown>;

    return {
      isin: toStringValue(asset.isin) ?? toStringValue(asset.ISIN),
      name: toStringValue(asset.name) ?? toStringValue(asset.NAME),
      rsiIndividual:
        toNumber(asset.rsi_individual) ??
        toNumber(asset.rsiIndividual) ??
        toNumber(asset.RSI_INDIVIDUAL),
      rsiLegal:
        toNumber(asset.rsi_legal) ??
        toNumber(asset.rsiLegal) ??
        toNumber(asset.RSI_LEGAL),
      rsiIndividualStatus:
        toStringValue(asset.rsi_individual_status) ??
        toStringValue(asset.rsiIndividualStatus) ??
        toStringValue(asset.RSI_INDIVIDUAL_STATUS),
      rsiLegalStatus:
        toStringValue(asset.rsi_legal_status) ??
        toStringValue(asset.rsiLegalStatus) ??
        toStringValue(asset.RSI_LEGAL_STATUS),
    };
  });
};

export function parsePushData(
  data?: {[key: string]: string | object} | undefined,
): PushPayload {
  if (!data) {
    return {};
  }

  return {
    type: typeof data.type === 'string' ? data.type : undefined,
    entityId:
      typeof data.entity_id === 'string'
        ? data.entity_id
        : typeof data.entityId === 'string'
          ? data.entityId
          : undefined,
    deepLink:
      typeof data.deep_link === 'string'
        ? data.deep_link
        : typeof data.deepLink === 'string'
          ? data.deepLink
          : undefined,
    assets: parseAssets(data.assets),
  };
}

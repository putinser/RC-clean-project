import type {PushSignalAsset} from '../model/types';

const STATUS_LABELS: Record<string, string> = {
  overbought: 'перекупленность',
  oversold: 'перепроданность',
  neutral: 'нейтрально',
};

const formatStatus = (status?: string, value?: number) => {
  if (!status && value == null) {
    return null;
  }

  const label = status ? STATUS_LABELS[status] ?? status : null;
  if (value != null && label) {
    return `${value} (${label})`;
  }
  if (value != null) {
    return String(value);
  }
  return label;
};

export function formatSignalPushBody(assets?: PushSignalAsset[]): string | null {
  if (!assets?.length) {
    return null;
  }

  return assets
    .map((asset) => {
      const name = asset.name ?? asset.isin ?? 'Актив';
      const individual = formatStatus(
        asset.rsiIndividualStatus,
        asset.rsiIndividual,
      );
      const legal = formatStatus(asset.rsiLegalStatus, asset.rsiLegal);
      const details = [
        individual ? `физ: ${individual}` : null,
        legal ? `юр: ${legal}` : null,
      ].filter(Boolean);

      if (details.length === 0) {
        return name;
      }

      return `${name}\n${details.join('\n')}`;
    })
    .join('\n\n');
}

export function getSignalTypeFromAsset(
  asset?: PushSignalAsset,
):
  | 'legal-overbought'
  | 'legal-oversold'
  | 'individual-overbought'
  | 'individual-oversold'
  | undefined {
  if (!asset) {
    return undefined;
  }

  if (asset.rsiIndividualStatus === 'overbought') {
    return 'individual-overbought';
  }
  if (asset.rsiIndividualStatus === 'oversold') {
    return 'individual-oversold';
  }
  if (asset.rsiLegalStatus === 'overbought') {
    return 'legal-overbought';
  }
  if (asset.rsiLegalStatus === 'oversold') {
    return 'legal-oversold';
  }

  return undefined;
}

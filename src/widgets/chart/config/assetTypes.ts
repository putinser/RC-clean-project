export const EassetTypes = {
  CURRENCY: 'currency',
  STOCK: 'stock',
  PRODUCT: 'product',
  INDEX: 'index',
  OTHER: 'other',
} as const;

export type AssetTypeId = (typeof EassetTypes)[keyof typeof EassetTypes];

export const assetTypesNames: Record<AssetTypeId, string> = {
  [EassetTypes.STOCK]: 'Акции',
  [EassetTypes.CURRENCY]: 'Валютные пары',
  [EassetTypes.PRODUCT]: 'Товары',
  [EassetTypes.INDEX]: 'Индексы',
  [EassetTypes.OTHER]: 'Другие',
};

export const assetTypeTabOptions: {id: AssetTypeId; label: string}[] = [
  EassetTypes.STOCK,
  EassetTypes.CURRENCY,
  EassetTypes.PRODUCT,
  EassetTypes.INDEX,
  EassetTypes.OTHER,
].map((id) => ({
  id,
  label: assetTypesNames[id],
}));

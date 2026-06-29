const SHORT_NAME_ALIASES: Record<string, string> = {
  'Московская Биржа': 'Московская биржа',
  'НК Лукойл': 'Лукойл',
  'Норильский никель': 'Норникель',
  'ПИК СЗ': 'ПИК',
  'СПБ Биржа': 'СПБ Биржа',
};

export function formatAssetDisplayName(name: string): string {
  const quotedMatch = name.match(/[«"„]([^»""]+)[»""]/);
  let displayName = quotedMatch?.[1]?.trim() ?? name;

  displayName = displayName.replace(/^(НК|ГМК)\s+/i, '');

  return SHORT_NAME_ALIASES[displayName] ?? displayName;
}

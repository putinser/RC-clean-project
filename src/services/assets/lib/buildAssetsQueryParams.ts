const CYRILLIC_PATTERN = /[а-яА-ЯёЁ]/;
const LATIN_CODE_PATTERN = /^[A-Za-z0-9._-]+$/;

export function buildAssetsQueryParams(search: string) {
  const trimmed = search.trim();

  if (!trimmed) {
    return { search: '', isin: '' };
  }

  const isLatinCodeQuery =
    !CYRILLIC_PATTERN.test(trimmed) && LATIN_CODE_PATTERN.test(trimmed);

  if (isLatinCodeQuery) {
    return { search: '', isin: trimmed };
  }

  return { search: trimmed, isin: '' };
}

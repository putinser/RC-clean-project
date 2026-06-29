type Quote = {
  symbol: string;
  price: number;
  changePercent: number;
};

const MOCK_QUOTES: Quote[] = [
  {symbol: 'GAZP', price: 168.42, changePercent: 1.84},
  {symbol: 'SBER', price: 314.77, changePercent: 0.92},
  {symbol: 'LKOH', price: 7432.5, changePercent: -0.41},
  {symbol: 'YDEX', price: 4128.0, changePercent: 2.17},
  {symbol: 'ROSN', price: 612.35, changePercent: -1.08},
  {symbol: 'VTBR', price: 0.024, changePercent: 0.5},
];

const TICKER_LOOP = [...MOCK_QUOTES, ...MOCK_QUOTES] as const;

function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export type {Quote};
export {MOCK_QUOTES, TICKER_LOOP, formatPrice};

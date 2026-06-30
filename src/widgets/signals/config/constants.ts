import type { SignalTypeId } from '../model/types';

export const signalFilterOptions: { id: SignalTypeId; label1: string }[] = [
  { id: 'all', label1: 'Все сигналы' },
  { id: 'legal-overbought', label1: 'Юр. лица перекуплены' },
  { id: 'legal-oversold', label1: 'Юр. лица перепроданы' },
  { id: 'individual-overbought', label1: 'Физ. лица перекуплены' },
  { id: 'individual-oversold', label1: 'Физ. лица перепроданы' },
];

export const shownLimit = 15;

export const SIGNAL_COLOR_OVERBOUGHT = '#22C55E';
export const SIGNAL_COLOR_OVERSOLD = '#DC2626';
export const SIGNAL_COLOR_NEUTRAL = '#737780';

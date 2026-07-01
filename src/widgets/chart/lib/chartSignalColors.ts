export const CHART_SIGNAL_COLORS = {
  success: '#1BCD54',
  fail: '#EC1C1C',
  neutral: '#CFCFD0',
} as const;

export const getRsiSignalColor = (
  value: number,
  overbought: number,
  oversold: number,
) => {
  if (value > 0 && value <= oversold) {
    return CHART_SIGNAL_COLORS.fail;
  }

  if (value >= overbought && value <= 100) {
    return CHART_SIGNAL_COLORS.success;
  }

  return CHART_SIGNAL_COLORS.neutral;
};

const monthNames: Record<string, string> = {
  январь: 'янв.',
  февраль: 'фев.',
  март: 'мар.',
  апрель: 'апр.',
  май: 'май',
  июнь: 'июн.',
  июль: 'июл.',
  август: 'авг.',
  сентябрь: 'сен.',
  октябрь: 'окт.',
  ноябрь: 'ноя.',
  декабрь: 'дек.',
};

const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
const threeHundredDaysInMilliseconds = 300 * oneDayInMilliseconds;

export const formatChartXAxisLabel = (
  value: string,
  periodInMilliseconds: number,
) => {
  const date = new Date(+value);
  if (!date.getDate()) return '';

  if (periodInMilliseconds < oneDayInMilliseconds) {
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (periodInMilliseconds < threeHundredDaysInMilliseconds) {
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
    });
  }

  const month = date.toLocaleDateString('ru-RU', {month: 'long'});
  const year = date.toLocaleDateString('ru-RU', {year: 'numeric'});
  const shortMonth = monthNames[month.toLowerCase()] || month;
  return `${shortMonth} ${year}`;
};

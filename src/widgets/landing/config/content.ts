import {
  ArrowLeftRight,
  ChartCandlestick,
  Gauge,
  History,
  Landmark,
  Layers,
  Scale,
  Split,
  Waves,
} from 'lucide-react-native';

export const capabilitiesHeader = {
  title: 'Фокус на поведении участников, а не на рыночном шуме',
  eyeBrow: 'ВОЗМОЖНОСТИ',
  icon: Layers,
} as const;

export const capabilitiesItems = [
  {
    title: 'Динамика лонгов и шортов',
    description:
      'Изменения структуры позиций по ключевым инструментам срочного рынка.',
    icon: Split,
  },
  {
    title: 'Изменение настроения рынка',
    description:
      'Индекс настроения на основе позиции, объёма и направленной активности.',
    icon: Gauge,
  },
  {
    title: 'Активность крупных участников',
    description: 'Выявление устойчивых потоков и накопления позиций.',
    icon: Landmark,
  },
  {
    title: 'Дисбаланс позиций',
    description: 'Оценка перекоса между длинной и короткой сторонами.',
    icon: Scale,
  },
  {
    title: 'Аномальные объёмы',
    description: 'Отклонения дельты объёма от нормального диапазона.',
    icon: Waves,
  },
  {
    title: 'Рыночное давление',
    description: 'Баланс давления покупателей и продавцов по инструментам.',
    icon: ArrowLeftRight,
  },
  {
    title: 'Анализ фьючерсов',
    description: 'RTS, Si, BR, GOLD, IMOEX и другие ликвидные инструменты.',
    icon: ChartCandlestick,
  },
  {
    title: 'История изменений позиций',
    description: 'Контекст поведения участников по сессиям и периодам.',
    icon: History,
  },
] as const;

export const howItWorksHeader = {
  title: 'Процесс аналитики в три ',
  titleGradient: 'шага',
  eyeBrow: 'КАК РАБОТАЕТ',
} as const;

export const howItWorksSteps = [
  {
    step: '01',
    title: 'Сбор данных срочного рынка',
    description:
      'Инструменты, объёмы, открытый интерес и изменения структуры позиций приводятся к единой аналитической модели.',
  },
  {
    step: '02',
    title: 'Анализ поведения участников',
    description:
      'Система оценивает длинную и короткую сторону, дисбаланс, давление и устойчивость потока.',
  },
  {
    step: '03',
    title: 'Формирование аналитических сигналов',
    description:
      'Сигналы подсвечивают значимые изменения поведения без лишних информационных слоёв.',
  },
] as const;

export const cardStats = [
  {
    text: '10',
    description: 'инструментов в мониторинге',
    textVariant: 'first' as const,
  },
  {
    text: '1280+',
    description: 'сигналов в сутки',
    textVariant: 'second' as const,
  },
  {
    text: '5 мин',
    description: 'среднее обновление данных',
    textVariant: 'third' as const,
  },
];

import { BadgeCheck } from 'lucide-react-native';

export const tariffsHeader = {
  title: 'Тарифы под разные аналитические задачи',
  eyeBrow: 'ТАРИФЫ',
  icon: BadgeCheck,
} as const;

export const headerButtons = [
  { id: '1', label: 'График', target: 'Chart' as const },
  { id: '2', label: 'Возможности', anchor: 'capabilities' as const },
  { id: '3', label: 'Как работает', anchor: 'how-it-works' as const },
  { id: '4', label: 'Тарифы', anchor: 'tariffs' as const },
];

export const footerButtons = [
  { id: '1', label: 'График', target: 'Chart' as const },
  { id: '2', label: 'Возможности', anchor: 'capabilities' as const },
  { id: '3', label: 'Как работает', anchor: 'how-it-works' as const },
  { id: '4', label: 'Тарифы', anchor: 'tariffs' as const },
];

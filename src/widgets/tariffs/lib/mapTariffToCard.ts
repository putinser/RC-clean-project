import type {TariffCardProps} from '@entities/tariff';
import type {Tariff} from '@services/subscription/types';

function formatTariffPrice(price: string): string {
  const value = Number(price);
  if (Number.isNaN(value)) return price;
  return `${new Intl.NumberFormat('ru-RU', {maximumFractionDigits: 0}).format(value)} ₽`;
}

export function filterPaidTariffs(tariffs: Tariff[]): Tariff[] {
  return tariffs.filter((tariff) => tariff.role.name !== 'free');
}

export function mapTariffToCardProps(tariff: Tariff): TariffCardProps {
  const recommended = tariff.role.name === 'middle';

  return {
    title: tariff.name,
    description: tariff.description_hover,
    price: formatTariffPrice(tariff.price),
    priceDetail: tariff.terms,
    features: tariff.description,
    buttonText: 'Получить доступ',
    variant: recommended ? 'primary' : 'default',
    recommended,
  };
}

import {useEffect, useState} from 'react';
import {View, Text} from 'react-native';
import {SectionWithGrid} from '@shared/ui/SectionWithGrid';
import {TariffCard} from '@entities/tariff';
import {Spinner} from 'heroui-native/spinner';
import {serviceSubscription} from '@services/subscription';
import type {Tariff} from '@services/subscription/types';
import {tariffsHeader} from '../config/content';
import {filterPaidTariffs, mapTariffToCardProps} from '@widgets/tariffs/lib/mapTariffToCard';

export const Tariffs = () => {
  const [tariffs, setTariffs] = useState<Tariff[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    serviceSubscription
      .getSubscription()
      .then((data) => {
        if (mounted) {
          setTariffs(filterPaidTariffs(data));
        }
      })
      .catch(() => {
        if (mounted) {
          setTariffs([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (isLoading) {
    return (
      <View className="py-12 items-center justify-center">
        <Spinner />
      </View>
    );
  }

  if (!tariffs || tariffs.length === 0) {
    return (
      <View className="py-12 items-center">
        <Text className="text-text-secondary">Не удалось загрузить тарифы</Text>
      </View>
    );
  }

  return (
    <SectionWithGrid
      id="tariffs"
      headerProps={tariffsHeader}
      className="pb-10">
      {tariffs.map((tariff) => {
        const props = mapTariffToCardProps(tariff);
        return <TariffCard key={tariff.id} {...props} />;
      })}
    </SectionWithGrid>
  );
};

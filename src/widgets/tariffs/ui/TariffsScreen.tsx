import {View, ScrollView} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {SectionWithGrid} from '@shared/ui/SectionWithGrid';
import {TariffCard} from '@entities/tariff';
import {tariffsHeader} from '@widgets/landing/config/content';
import {
  filterPaidTariffs,
  mapTariffToCardProps,
} from '@widgets/tariffs/lib/mapTariffToCard';
import {useEffect, useState} from 'react';
import {Text} from 'react-native';
import {Spinner} from 'heroui-native/spinner';
import {serviceSubscription} from '@services/subscription';
import type {Tariff} from '@services/subscription/types';

export const TariffsScreen = () => {
  const [tariffs, setTariffs] = useState<Tariff[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    serviceSubscription
      .getSubscription()
      .then((data) => {
        if (mounted) setTariffs(filterPaidTariffs(data));
      })
      .catch(() => {
        if (mounted) setTariffs([]);
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView bounces={false}>
        {isLoading ? (
          <View className="py-12 items-center">
            <Spinner />
          </View>
        ) : !tariffs || tariffs.length === 0 ? (
          <View className="py-12 items-center">
            <Text className="text-text-secondary">
              Не удалось загрузить тарифы
            </Text>
          </View>
        ) : (
          <SectionWithGrid id="tariffs-screen" headerProps={tariffsHeader}>
            {tariffs.map((tariff) => {
              const props = mapTariffToCardProps(tariff);
              return <TariffCard key={tariff.id} {...props} />;
            })}
          </SectionWithGrid>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

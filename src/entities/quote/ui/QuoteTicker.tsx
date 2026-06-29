import {useEffect} from 'react';
import {View, Text} from 'react-native';
import Animated, {
  useSharedValue,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import {TICKER_LOOP, formatPrice} from '../model/quotes';
import type {Quote} from '../model/quotes';

function QuoteTickerItem({quote}: {quote: Quote}) {
  const isPositive = quote.changePercent > 0;
  const color = isPositive ? '#57EF70' : '#EC3736';
  const sign = isPositive ? '+' : '';

  return (
    <View className="flex-row items-center gap-2 mx-4 shrink-0">
      <Text className="text-[14px] font-medium text-white">{quote.symbol}</Text>
      <Text className="text-[14px] font-medium" style={{color}}>
        ₽{formatPrice(quote.price)}
      </Text>
      <Text className="text-[14px] font-medium" style={{color}}>
        {sign}
        {quote.changePercent.toFixed(2)}%
      </Text>
    </View>
  );
}

export const QuoteTicker = () => {
  const translateX = useSharedValue(0);

  useEffect(() => {
    translateX.value = withRepeat(
      withTiming(-500, {duration: 40000, easing: Easing.linear}),
      -1,
      false,
    );
  }, [translateX]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: translateX.value}],
  }));

  return (
    <View className="flex-row items-center bg-[#0F1115] border border-[#464B52] rounded-2xl px-4 py-3 w-full">
      <View className="flex-row items-center gap-3 shrink-0 mr-3">
        <View className="items-center justify-center w-8 h-4 bg-[#EC3736]/20 rounded-full">
          <View className="w-2 h-2 rounded-full bg-[#EC3736]" />
        </View>
        <Text className="text-[#8A99AE] text-[13px] font-normal">
          КОТИРОВКИ ОНЛАЙН
        </Text>
      </View>

      <View className="flex-1 overflow-hidden">
        <Animated.View style={[animatedStyle]} className="flex-row">
          {TICKER_LOOP.map((quote, i) => (
            <QuoteTickerItem key={`${quote.symbol}-${i}`} quote={quote} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

import {View} from 'react-native';
import {CardStat} from '@entities/statistics';
import {cardStats} from '../config/content';

export const CardStats = () => {
  return (
    <View className="container-main mt-2 gap-4">
      {cardStats.map((cardStat) => (
        <CardStat
          key={cardStat.text}
          text={cardStat.text}
          description={cardStat.description}
          textVariant={cardStat.textVariant}
        />
      ))}
    </View>
  );
};

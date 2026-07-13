import {useState} from 'react';
import {Modal, Pressable, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Columns2, Rows2, Square} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';
import type {ChartLayoutId} from '../config/chartLayout';

const layoutOptions: Array<{
  id: ChartLayoutId;
  label: string;
  Icon: typeof Square;
}> = [
  {id: 'single', label: 'Один график', Icon: Square},
  {id: 'horizontal', label: 'Два горизонтально', Icon: Rows2},
  {id: 'vertical', label: 'Два вертикально', Icon: Columns2},
];

type ChartLayoutSelectProps = {
  value: ChartLayoutId;
  onChange: (layout: ChartLayoutId) => void;
};

export const ChartLayoutSelect = ({
  value,
  onChange,
}: ChartLayoutSelectProps) => {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const current = layoutOptions.find((option) => option.id === value);
  const CurrentIcon = current?.Icon ?? Square;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Вид раскладки графиков"
        className={cn(
          'h-8 w-8 items-center justify-center rounded-lg border border-[#464B52] bg-[#181B22]',
          open && 'border-[#4754E1]',
        )}>
        <CurrentIcon size={16} color={open ? '#4754E1' : '#87A3AB'} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}>
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/60"
            onPress={() => setOpen(false)}
          />
          <View
            className="rounded-t-2xl border border-[#464B52] bg-[#0F1115] px-3 pt-3"
            style={{paddingBottom: Math.max(insets.bottom, 16) + 8}}>
            <Text className="mb-2 px-1 text-sm font-medium text-white/70">
              Раскладка графиков
            </Text>
            <View className="flex-row gap-2">
              {layoutOptions.map((option) => {
                const isActive = option.id === value;
                const OptionIcon = option.Icon;

                return (
                  <Pressable
                    key={option.id}
                    onPress={() => {
                      onChange(option.id);
                      setOpen(false);
                    }}
                    accessibilityRole="button"
                    accessibilityLabel={option.label}
                    className={cn(
                      'min-w-0 flex-1 items-center gap-2 rounded-xl border px-2 py-3',
                      isActive
                        ? 'border-[#4754E1] bg-[#4754E1]/15'
                        : 'border-[#21262d] bg-[#181B22]',
                    )}>
                    <OptionIcon
                      size={20}
                      color={isActive ? '#8085FF' : '#87A3AB'}
                    />
                    <Text
                      className={cn(
                        'text-center text-[11px]',
                        isActive ? 'font-medium text-white' : 'text-white/70',
                      )}
                      numberOfLines={2}>
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

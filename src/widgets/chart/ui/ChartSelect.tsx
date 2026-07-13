import {useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ChevronDown} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';
import type {MetricOption} from '../config/chartMetric';

type DropdownOption = {
  value: string;
  label: string;
};

type ChartDropdownProps = {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  compact?: boolean;
  className?: string;
};

function ChartDropdown({
  options,
  value,
  onChange,
  ariaLabel,
  compact = false,
  className,
}: ChartDropdownProps) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const selected = options.find((opt) => opt.value === value);

  return (
    <>
      <Pressable
        accessibilityLabel={ariaLabel}
        onPress={() => setOpen(true)}
        className={cn(
          'w-full min-w-0 flex-row items-center justify-between gap-2 border border-[#464B52] bg-[#181B22]',
          compact
            ? 'min-h-[32px] rounded-[10px] px-2 py-1'
            : 'min-h-[40px] rounded-xl px-3 py-2',
          className,
        )}>
        <Text
          className={cn(
            'min-w-0 flex-1 shrink text-white',
            compact ? 'text-xs' : 'text-sm',
          )}
          numberOfLines={1}>
          {selected?.label ?? 'Выберите...'}
        </Text>
        <ChevronDown color="#87A3AB" size={compact ? 14 : 16} />
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
            className="max-h-[50%] rounded-t-2xl border border-[#464B52] bg-[#0F1115] px-2 pt-3"
            style={{paddingBottom: Math.max(insets.bottom, 16) + 8}}>
            <ScrollView>
              {options.map((opt) => {
                const isActive = opt.value === value;
                return (
                  <Pressable
                    key={opt.value}
                    onPress={() => {
                      onChange(opt.value);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-3',
                      isActive && 'bg-[#ffffff16]',
                    )}>
                    <Text
                      className={cn(
                        'text-sm',
                        isActive ? 'font-medium text-white' : 'text-white/80',
                      )}>
                      {opt.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}

type ChartSelectProps = {
  options: {id: string; label1: string}[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  compact?: boolean;
  className?: string;
};

export const ChartSelect = ({
  options,
  value,
  onChange,
  ariaLabel,
  compact,
  className,
}: ChartSelectProps) => {
  const dropdownOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.label1,
  }));

  return (
    <ChartDropdown
      options={dropdownOptions}
      value={value}
      onChange={onChange}
      ariaLabel={ariaLabel}
      compact={compact}
      className={className}
    />
  );
};

type MetricSelectProps = {
  options: MetricOption[];
  value: string;
  onChange: (value: string) => void;
  compact?: boolean;
};

export const MetricSelect = ({
  options,
  value,
  onChange,
  compact,
}: MetricSelectProps) => {
  const dropdownOptions = options.map((opt) => ({
    value: opt.id,
    label: opt.label2 ? `${opt.label1}/${opt.label2}` : opt.label1,
  }));

  return (
    <ChartDropdown
      options={dropdownOptions}
      value={value}
      onChange={onChange}
      ariaLabel="Показатель"
      compact={compact}
    />
  );
};

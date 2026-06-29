import {useState} from 'react';
import {Modal, Pressable, ScrollView, Text, View} from 'react-native';
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
};

function ChartDropdown({
  options,
  value,
  onChange,
  ariaLabel,
}: ChartDropdownProps) {
  const [open, setOpen] = useState(false);
  const selected = options.find((opt) => opt.value === value);

  return (
    <>
      <Pressable
        accessibilityLabel={ariaLabel}
        onPress={() => setOpen(true)}
        className="min-h-[40px] w-full min-w-0 flex-row items-center justify-between gap-2 rounded-xl border border-[#464B52] bg-[#181B22] px-3 py-2">
        <Text className="min-w-0 flex-1 shrink text-sm text-white" numberOfLines={1}>
          {selected?.label ?? 'Выберите...'}
        </Text>
        <ChevronDown color="#87A3AB" size={16} />
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
          <View className="max-h-[50%] rounded-t-2xl border border-[#464B52] bg-[#0F1115] px-2 pb-8 pt-3">
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
};

export const ChartSelect = ({
  options,
  value,
  onChange,
  ariaLabel,
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
    />
  );
};

type MetricSelectProps = {
  options: MetricOption[];
  value: string;
  onChange: (value: string) => void;
};

export const MetricSelect = ({options, value, onChange}: MetricSelectProps) => {
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
    />
  );
};

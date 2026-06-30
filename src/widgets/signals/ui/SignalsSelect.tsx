import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { cn } from '@shared/lib/cn';

type SignalsSelectOption = {
  id: string;
  label1: string;
};

interface SignalsSelectProps {
  options: SignalsSelectOption[];
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  placeholder?: string;
}

export const SignalsSelect = ({
  options,
  value,
  onChange,
  ariaLabel,
  placeholder = 'Выберите...',
}: SignalsSelectProps) => {
  const [open, setOpen] = useState(false);
  const selected = options.find(opt => opt.id === value);

  return (
    <>
      <Pressable
        accessibilityLabel={ariaLabel}
        onPress={() => setOpen(true)}
        className="min-h-[44px] w-full flex-row items-center justify-between gap-2 rounded-xl border border-[#464B52] bg-[#181B22] px-3 py-2"
      >
        <Text
          className="min-w-0 flex-1 shrink text-sm text-white"
          numberOfLines={1}
        >
          {selected?.label1 ?? placeholder}
        </Text>
        <ChevronDown color="#87A3AB" size={16} />
      </Pressable>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <View className="flex-1 justify-end">
          <Pressable
            className="absolute inset-0 bg-black/60"
            onPress={() => setOpen(false)}
          />
          <View className="max-h-[50%] rounded-t-2xl border border-[#464B52] bg-[#0F1115] px-2 pb-8 pt-3">
            <ScrollView>
              {options.map(opt => {
                const isActive = opt.id === value;
                return (
                  <Pressable
                    key={opt.id}
                    onPress={() => {
                      onChange(opt.id);
                      setOpen(false);
                    }}
                    className={cn(
                      'rounded-lg px-3 py-3',
                      isActive && 'bg-[#ffffff16]',
                    )}
                  >
                    <Text
                      className={cn(
                        'text-sm',
                        isActive ? 'font-medium text-white' : 'text-white/80',
                      )}
                    >
                      {opt.label1}
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
};

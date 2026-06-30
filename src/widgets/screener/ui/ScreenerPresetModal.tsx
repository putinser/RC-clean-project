import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

interface ScreenerPresetModalProps {
  visible: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: (name: string) => void;
}

export const ScreenerPresetModal = ({
  visible,
  isSaving,
  onClose,
  onSave,
}: ScreenerPresetModalProps) => {
  const [name, setName] = useState('');

  const handleSave = () => {
    onSave(name);
    setName('');
    onClose();
  };

  const handleClose = () => {
    setName('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 items-center justify-center bg-black/60 px-6">
        <View className="w-full max-w-sm rounded-2xl border border-[#464B52] bg-[#0F1115] p-4">
          <Text className="text-lg font-bold text-white">Сохранить пресет</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Название пресета"
            placeholderTextColor="rgba(255,255,255,0.3)"
            className="mt-4 h-11 rounded-xl border border-[#464B52] bg-[#12151B] px-3 text-sm text-white"
          />
          <View className="mt-4 flex-row justify-end gap-2">
            <Pressable onPress={handleClose} className="rounded-lg px-4 py-2">
              <Text className="text-sm font-semibold text-white/60">
                Отмена
              </Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={isSaving || !name.trim()}
              className="rounded-lg bg-primary px-4 py-2"
            >
              <Text className="text-sm font-bold text-[#051014]">
                Сохранить
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

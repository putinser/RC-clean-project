import {useEffect, useState} from 'react';
import {View, Text, TextInput, Pressable, FlatList} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Search, X} from 'lucide-react-native';
import {Spinner} from 'heroui-native/spinner';
import {serviceAssets} from '@services/assets';
import type {Asset} from '@services/assets/types';
import {LogoWithText} from '@shared/ui/Logo';
import {UserAvatar} from '@entities/user';
import {cn} from '@shared/lib/cn';

type TerminalHeaderProps = {
  onAssetSelect?: (asset: Asset) => void;
};

export const TerminalHeader = ({onAssetSelect}: TerminalHeaderProps) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsDropdownOpen(false);
      return;
    }

    const handle = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await serviceAssets.getAssets('stock', query.trim());
        const all = [...data.avalible, ...data.unavalible].slice(0, 10);
        setResults(all);
        setIsDropdownOpen(true);
      } catch {
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 400);

    return () => clearTimeout(handle);
  }, [query]);

  const handleSelect = (asset: Asset) => {
    onAssetSelect?.(asset);
    setQuery('');
    setResults([]);
    setIsDropdownOpen(false);
  };

  return (
    <SafeAreaView
      className="bg-[#0B0C10] border-b border-[#464B52]"
      edges={['top']}>
      <View className="px-4 py-3 gap-3">
        <View className="flex-row items-center justify-between">
          <LogoWithText className="w-7 h-7" size={16} />
          <UserAvatar />
        </View>

        <View className="relative">
          <View className="flex-row items-center gap-2 bg-[#181b22] border border-[#464B52] rounded-xl px-3 h-10">
            <Search color="#a6aab2" size={16} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Поиск инструмента..."
              placeholderTextColor="#a6aab2"
              className="flex-1 text-foreground text-sm"
            />
            {isLoading ? (
              <Spinner size="sm" />
            ) : query ? (
              <Pressable onPress={() => setQuery('')}>
                <X color="#a6aab2" size={16} />
              </Pressable>
            ) : null}
          </View>

          {isDropdownOpen && results.length > 0 ? (
            <View className="absolute top-12 left-0 right-0 bg-[#0d1520] border border-[#464B52] rounded-xl z-50 max-h-[240px]">
              <FlatList
                data={results}
                keyExtractor={(item) => String(item.id)}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() => handleSelect(item)}
                    className="px-4 py-3 border-b border-[#464B52]/50 flex-row items-center justify-between">
                    <View>
                      <Text className="text-foreground text-sm font-medium">
                        {item.name}
                      </Text>
                      <Text className="text-text-secondary text-xs">
                        {item.isin}
                      </Text>
                    </View>
                    <View
                      className={cn(
                        'w-2 h-2 rounded-full',
                        item.isOnline ? 'bg-[#57EF70]' : 'bg-[#686B72]',
                      )}
                    />
                  </Pressable>
                )}
              />
            </View>
          ) : null}
        </View>
      </View>
    </SafeAreaView>
  );
};

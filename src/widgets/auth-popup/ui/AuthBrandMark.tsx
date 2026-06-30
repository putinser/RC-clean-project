import {View, Text, Pressable, StyleSheet} from 'react-native';
import {X} from 'lucide-react-native';
import {useNavigation} from '@react-navigation/native';
import type {AppStackNavigation} from '@shared/types/navigation';
import {Logo} from '@shared/ui/Logo';

type AuthBrandMarkProps = {
  compact?: boolean;
};

export const AuthBrandMark = ({compact = false}: AuthBrandMarkProps) => {
  const navigation = useNavigation<AppStackNavigation>();

  const handleClose = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('Main', {screen: 'Home'});
    }
  };

  if (compact) {
    return (
      <View style={styles.compactRow}>
        <Logo className="w-10 h-10" size={18} />
        <Text style={styles.compactTitle}>MOSBIR</Text>
      </View>
    );
  }

  return (
    <View style={styles.row}>
      <View style={styles.brand}>
        <Logo className="w-11 h-11" size={18} />
        <View style={styles.brandText}>
          <Text style={styles.title}>MOSBIR</Text>
          <Text style={styles.tagline}>Аналитика участников Московской биржи</Text>
        </View>
      </View>
      <Pressable
        onPress={handleClose}
        style={styles.close}
        accessibilityLabel="Закрыть">
        <X color="#a6aab2" size={20} strokeWidth={1.75} />
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  brand: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  brandText: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#E8ECF3',
  },
  tagline: {
    marginTop: 2,
    fontSize: 12,
    color: '#a6aab2',
  },
  close: {
    borderRadius: 8,
    padding: 6,
  },
  compactRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
    color: '#E8ECF3',
  },
});

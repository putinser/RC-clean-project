import {View, Text, Pressable, StyleSheet} from 'react-native';
import {cn} from '@shared/lib/cn';
import {useAuthNavigation} from '../model/useAuthNavigation';
import {AuthPopupState} from '../model/authPopupState';

type AuthTabsProps = {
  active: AuthPopupState.LOGIN | AuthPopupState.REGISTER_START;
};

export const AuthTabs = ({active}: AuthTabsProps) => {
  const {navigateWithAuth} = useAuthNavigation();

  const tabs: Array<{id: AuthPopupState; label: string}> = [
    {id: AuthPopupState.REGISTER_START, label: 'Регистрация'},
    {id: AuthPopupState.LOGIN, label: 'Вход'},
  ];

  return (
    <View style={styles.root}>
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            onPress={() => navigateWithAuth(tab.id)}
            style={[styles.tab, isActive && styles.tabActive]}>
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#181B22',
    padding: 4,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingVertical: 10,
  },
  tabActive: {
    backgroundColor: '#0F1115',
    borderWidth: 1,
    borderColor: '#464B52',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#a6aab2',
  },
  labelActive: {
    color: '#56d1fb',
  },
});

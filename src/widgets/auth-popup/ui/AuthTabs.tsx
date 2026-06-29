import {View, Text, Pressable} from 'react-native';
import {cn} from '@shared/lib/cn';
import {useAuthNavigation} from '../model/useAuthNavigation';
import {AuthPopupState} from '../model/authPopupState';

type AuthTabsProps = {
  active: AuthPopupState.LOGIN | AuthPopupState.REGISTER_START;
};

export const AuthTabs = ({active}: AuthTabsProps) => {
  const {navigateWithAuth} = useAuthNavigation();

  const tabs: Array<{id: AuthPopupState; label: string}> = [
    {id: AuthPopupState.LOGIN, label: 'Вход'},
    {id: AuthPopupState.REGISTER_START, label: 'Регистрация'},
  ];

  return (
    <View className="flex-row gap-2 w-full">
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <Pressable
            key={tab.id}
            onPress={() => navigateWithAuth(tab.id)}
            className={cn(
              'flex-1 py-2.5 rounded-lg items-center',
              isActive && 'bg-secondary/40',
            )}>
            <Text
              className={cn(
                'text-sm font-medium',
                isActive ? 'text-primary' : 'text-text-secondary',
              )}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

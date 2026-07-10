import {useState, useRef} from 'react';
import {Pressable, View, Text} from 'react-native';
import {User, LogOut} from 'lucide-react-native';
import {cn} from '@shared/lib/cn';
import {storage} from '@shared/lib/storage';
import {STORAGE_KEYS} from '@shared/lib/storageKeys';
import {serviceDeviceTokens} from '@services/device-tokens';
import {useUserStore} from '../model/useUserStore';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';

export const UserAvatar = () => {
  const isAuthorized = useUserStore((s) => s.isAuthorized);
  const currentUser = useUserStore((s) => s.currentUser);
  const logout = useUserStore((s) => s.logout);
  const loadingStatus = useUserStore((s) => s.loadingStatus);
  const {navigateWithAuth} = useAuthNavigation();
  const [menuOpen, setMenuOpen] = useState(false);
  const buttonRef = useRef<View>(null);

  const handleClick = () => {
    if (loadingStatus === 'initial') return;
    if (!isAuthorized) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }
    setMenuOpen((open) => !open);
  };

  const handleLogout = async () => {
    const token = await storage.getItem<string>(STORAGE_KEYS.FCM_TOKEN);
    if (token) {
      await serviceDeviceTokens.unregister({token}).catch(() => undefined);
    }
    logout();
    setMenuOpen(false);
  };

  const initial = currentUser?.name?.charAt(0)?.toUpperCase() ?? '';

  return (
    <View ref={buttonRef} className="relative">
      <Pressable
        onPress={handleClick}
        className={cn(
          'w-[41px] h-[41px] rounded-full border bg-secondary/20 items-center justify-center overflow-hidden',
          'border-primary/30',
        )}
        accessibilityLabel={isAuthorized ? 'Меню пользователя' : 'Войти'}>
        {isAuthorized && currentUser?.avatar ? null : isAuthorized && initial ? (
          <Text className="text-sm font-semibold text-primary">{initial}</Text>
        ) : (
          <User color="#fff" size={20} strokeWidth={1.5} />
        )}
      </Pressable>

      {menuOpen && isAuthorized && currentUser ? (
        <View className="absolute right-0 top-full mt-2 min-w-[180px] rounded-xl border border-[#3B3B41] bg-[#0d1520] py-2 z-50">
          <Text
          className="px-4 py-2 text-sm font-medium text-foreground"
          numberOfLines={1}>
          {currentUser.name}
        </Text>
        <Text
          className="px-4 pb-2 text-xs text-text-secondary"
          numberOfLines={1}>
          {currentUser.email}
        </Text>
        <Pressable
          onPress={handleLogout}
          className="flex-row items-center gap-2 w-full px-4 py-2">
          <LogOut color="#a6aab2" size={16} />
          <Text className="text-sm text-text-secondary">Выйти</Text>
        </Pressable>
      </View>
      ) : null}
    </View>
  );
};

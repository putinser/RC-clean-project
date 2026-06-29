import {useEffect} from 'react';
import {Pressable} from 'react-native';
import {Star} from 'lucide-react-native';
import {Spinner} from 'heroui-native/spinner';
import {useFavoritesStore} from '@entities/favorite';
import {useUserStore} from '@entities/user';
import {AuthPopupState} from '@widgets/auth-popup/model/authPopupState';
import {useAuthNavigation} from '@widgets/auth-popup/model/useAuthNavigation';
import {cn} from '@shared/lib/cn';

interface FavoriteButtonProps {
  assetId: number;
  assetName: string;
  className?: string;
}

export const FavoriteButton = ({
  assetId,
  assetName,
  className,
}: FavoriteButtonProps) => {
  const isAuthorized = useUserStore((state) => state.isAuthorized);
  const favorites = useFavoritesStore((state) => state.favorites);
  const loadingAssetId = useFavoritesStore((state) => state.loadingAssetId);
  const fetchFavorites = useFavoritesStore((state) => state.fetchFavorites);
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);
  const clearFavorites = useFavoritesStore((state) => state.clearFavorites);
  const {navigateWithAuth} = useAuthNavigation();

  const isFavorite = favorites.includes(assetId);
  const isLoading = loadingAssetId === assetId;

  useEffect(() => {
    if (isAuthorized) {
      fetchFavorites();
      return;
    }
    clearFavorites();
  }, [clearFavorites, fetchFavorites, isAuthorized]);

  const handleClick = async () => {
    if (!isAuthorized) {
      navigateWithAuth(AuthPopupState.LOGIN);
      return;
    }
    if (isLoading) return;
    await toggleFavorite(assetId);
  };

  return (
    <Pressable
      onPress={handleClick}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={
        isFavorite
          ? `Удалить из избранного ${assetName}`
          : `Добавить в избранное ${assetName}`
      }
      className={cn(
        'h-7 w-7 items-center justify-center rounded-lg',
        isFavorite && 'text-primary',
        className,
      )}>
      {isLoading ? (
        <Spinner size="sm" />
      ) : (
        <Star
          color={isFavorite ? '#56d1fb' : 'rgba(255,255,255,0.35)'}
          size={16}
          fill={isFavorite ? '#56d1fb' : 'none'}
        />
      )}
    </Pressable>
  );
};

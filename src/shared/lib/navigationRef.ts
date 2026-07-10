import {createNavigationContainerRef} from '@react-navigation/native';
import type {AppStackParamList} from '@shared/types/navigation';

export const navigationRef = createNavigationContainerRef<AppStackParamList>();

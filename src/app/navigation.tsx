import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainTabs} from '@widgets/terminal';
import {AuthScreen} from '@widgets/auth-popup';
import type {AppStackParamList} from '@shared/types/navigation';

const Stack = createNativeStackNavigator<AppStackParamList>();

export const RootNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: {backgroundColor: '#060b12'},
      }}>
      <Stack.Screen name="Main" component={MainTabs} />
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{presentation: 'modal'}}
      />
    </Stack.Navigator>
  );
};

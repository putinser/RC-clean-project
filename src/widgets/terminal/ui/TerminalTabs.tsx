import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, LineChart, Radio, Wallet, CreditCard} from 'lucide-react-native';
import type {MainTabParamList} from '@shared/types/navigation';
import {HomeScreen} from '@widgets/landing';
import {ChartScreen} from '@widgets/chart';
import {SignalsScreen} from '@widgets/signals';
import {AssetsScreen} from '@widgets/assets';
import {TariffsScreen} from '@widgets/tariffs/ui/TariffsScreen';

const Tab = createBottomTabNavigator<MainTabParamList>();

const HomeIcon = ({color, size}: {color: string; size: number}) => (
  <Home color={color} size={size} />
);
const ChartIcon = ({color, size}: {color: string; size: number}) => (
  <LineChart color={color} size={size} />
);
const SignalsIcon = ({color, size}: {color: string; size: number}) => (
  <Radio color={color} size={size} />
);
const AssetsIcon = ({color, size}: {color: string; size: number}) => (
  <Wallet color={color} size={size} />
);
const TariffsIcon = ({color, size}: {color: string; size: number}) => (
  <CreditCard color={color} size={size} />
);

export const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0F1115',
          borderTopColor: '#464B52',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#56d1fb',
        tabBarInactiveTintColor: '#a6aab2',
      }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{title: 'Главная', tabBarIcon: HomeIcon}}
      />
      <Tab.Screen
        name="Chart"
        component={ChartScreen}
        options={{title: 'График', tabBarIcon: ChartIcon}}
      />
      <Tab.Screen
        name="Signals"
        component={SignalsScreen}
        options={{title: 'Сигналы', tabBarIcon: SignalsIcon}}
      />
      <Tab.Screen
        name="Assets"
        component={AssetsScreen}
        options={{title: 'Активы', tabBarIcon: AssetsIcon}}
      />
      <Tab.Screen
        name="Tariffs"
        component={TariffsScreen}
        options={{title: 'Тарифы', tabBarIcon: TariffsIcon}}
      />
    </Tab.Navigator>
  );
};

export const TerminalTabs = MainTabs;

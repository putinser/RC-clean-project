/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {registerBackgroundHandler} from '@features/push-notifications';
import App from './App';
import {name as appName} from './app.json';

registerBackgroundHandler();

AppRegistry.registerComponent(appName, () => App);

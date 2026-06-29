import './src/global.css';
import {Providers} from '@app/providers';
import {Uniwind} from 'uniwind';

Uniwind.setTheme('dark');

export default function App() {
  return <Providers />;
}

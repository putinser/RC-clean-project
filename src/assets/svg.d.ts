declare module '*.svg' {
  import type {ComponentType} from 'react';
  import type {SvgProps} from 'react-native-svg';
  const SvgComponent: ComponentType<SvgProps & {width?: number | string; height?: number | string}>;
  export default SvgComponent;
}

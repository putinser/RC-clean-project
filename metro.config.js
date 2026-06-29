const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {withUniwindConfig} = require('uniwind/metro');
const path = require('path');

const defaultConfig = getDefaultConfig(__dirname);

const {transformer} = defaultConfig;
const {
  resolver: {sourceExts, assetExts},
} = defaultConfig;

const svgConfig = {
  transformer: {
    ...transformer,
    babelTransformerPath: require.resolve('react-native-svg-transformer'),
  },
  resolver: {
    ...defaultConfig.resolver,
    assetExts: assetExts.filter((ext) => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      tslib: path.resolve(__dirname, 'node_modules/tslib/tslib.es6.js'),
    },
  },
};

const merged = mergeConfig(defaultConfig, svgConfig);

const withUniwind = withUniwindConfig(merged, {
  cssEntryFile: './src/global.css',
  dtsFile: './src/uniwind-types.d.ts',
});

module.exports = withUniwind;

const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const path = require('path');
const { wrapWithReanimatedMetroConfig } = require('react-native-reanimated/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

const monorepoRoot = path.resolve(__dirname, '../../');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  transformer: {
    babelTransformerPath: require.resolve('react-native-svg-transformer/react-native'),
  },
  resolver: {
    unstable_conditionNames: ['browser', 'require', 'react-native'],
    unstable_enablePackageExports: false,
    assetExts: assetExts.filter(ext => ext !== 'svg'),
    sourceExts: [...sourceExts, 'svg'],
    extraNodeModules: {
      '@app': path.resolve(__dirname, './src'),
      '@core/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@core/infrastructure': path.resolve(__dirname, '../../packages/infrastructure/src'),
      '@core/presentation': path.resolve(__dirname, '../../packages/presentation/src'),
      '@core/usecase': path.resolve(__dirname, '../../packages/usecase/src'),
      '@core/domain': path.resolve(__dirname, '../../packages/domain/src'),
    },
  },
  watchFolders: [monorepoRoot],
};

module.exports = wrapWithReanimatedMetroConfig(mergeConfig(getDefaultConfig(__dirname), config));

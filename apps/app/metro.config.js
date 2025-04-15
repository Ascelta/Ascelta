const {getDefaultConfig, mergeConfig} = require("@react-native/metro-config");
const path = require("path");

const monorepoRoot = path.resolve(__dirname, "../../");

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
	watchFolders: [monorepoRoot],
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);

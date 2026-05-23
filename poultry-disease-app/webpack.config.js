const createExpoWebpackConfig = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  console.log('[webpack.config] custom webpack config loaded');
  const config = await createExpoWebpackConfig(env, argv);

  config.resolve = config.resolve || {};
  config.resolve.alias = {
    ...(config.resolve.alias || {}),
    'react-native$': 'react-native-web',
    'react-native-web/dist/exports/StyleSheet': require.resolve('react-native-web/dist/exports/StyleSheet'),
    'react-native-web/dist/exports/StyleSheet/dom': require.resolve('react-native-web/dist/exports/StyleSheet/dom'),
    'react-native-web/dist/exports/NativeEventEmitter': require.resolve('react-native-web/dist/exports/NativeEventEmitter'),
    'react-native-web/dist/exports/Platform': require.resolve('react-native-web/dist/exports/Platform'),
    'react-dom/client': require.resolve('react-dom/client'),
  };

  return config;
};

const { withGradleProperties } = require('@expo/config-plugins');

module.exports = function withForcedNdkVersion(config, { version = '28.0.13004108' } = {}) {
  return withGradleProperties(config, (config) => {
    // These two keys are what ExpoRootProject actually reads
    config.modResults.push({
      type: 'property',
      key: 'android.ndkVersion',
      value: version,
    });
    config.modResults.push({
      type: 'property',
      key: 'ndkVersion',
      value: version,
    });
    return config;
  });
};

module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            'react-native-pell-rich-editor': './node_modules/react-native-pell-rich-editor',
          },
        },
      ],
    ],
  };
};

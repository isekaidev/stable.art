const {defineConfig} = require('@vue/cli-service');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');

process.env.VUE_APP_GIT_HASH = require('child_process').execSync('git rev-parse HEAD').toString().trim();

module.exports = defineConfig({
  transpileDependencies: true,
  // lintOnSave: false,
  filenameHashing: false,
  productionSourceMap: true,

  css: {
    extract: false,
  },

  chainWebpack: (config) => {
    config.plugin('html').tap((args) => {
      args[0].inject = false; // eslint-disable-line no-param-reassign
      return args;
    });

    config.plugin('copy').tap((options) => {
      const newIgnorePaths = [
        '**/icons-old',
        '**/live.js',
        '**/manifest-dev.json',
        '**/*.psd',
      ];

      options[0].patterns[0].globOptions.ignore = [...options[0].patterns[0].globOptions.ignore, ...newIgnorePaths]; // eslint-disable-line no-param-reassign
      return options;
    });
  },

  configureWebpack: () => {
    const newConfig = {
      externals: {
        uxp: 'commonjs2 uxp',
        photoshop: 'commonjs2 photoshop',
        fs: 'commonjs2 fs',
        os: 'commonjs2 os',
      },

      plugins: [
        new NodePolyfillPlugin(), // this is for jimp; https://stackoverflow.com/a/65556946
      ],
    };

    if (process.env.NODE_ENV === 'production') {
      newConfig.plugins.push(new HtmlReplaceWebpackPlugin([
        {
          pattern: 'http://localhost:8080',
          replacement: 'https://stable.art/plugin-code',
        },
        {
          pattern: '<script defer="defer" src="/live.js"></script>',
          replacement: '',
        },
        {
          pattern: '<script src="http://localhost:8098"></script>', // vue-devtools
          replacement: '',
        },
      ]));
    }

    return newConfig;
  },
});

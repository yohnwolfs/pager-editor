const CracoAntDesignPlugin = require('craco-antd');
// const { whenProd } = require('@craco/craco');

module.exports = {
  // webpack: {
  //   configure: (webpackConfig, { env, paths }) => {
  //     // paths.appPath='public'
  //     paths.appBuild = 'build';
  //     webpackConfig.output = {
  //       ...webpackConfig.output,
  //       publicPath: whenProd(() => '/pager-editor/', undefined),
  //     };
  //     return webpackConfig;
  //   },
  // },
  // devServer: {
  //   proxy: {
  //     '/pager-editor/api': {
  //       target: 'http://localhost:3001/api',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/pager-editor/api': '',
  //       },
  //     },
  //     '/pager-editor/assets': {
  //       target: 'http://192.168.1.6:3001/assets',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/pager-editor/assets': '',
  //       },
  //     },
  //     '/pager-editor/codes': {
  //       target: 'http://192.168.1.6:3001/codes',
  //       changeOrigin: true,
  //       pathRewrite: {
  //         '^/pager-editor/codes': '',
  //       },
  //     },
  //   },
  // },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
    },
  ],
};

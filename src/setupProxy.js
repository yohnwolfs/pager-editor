const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/pager-editor/api', {
      // target: 'http://192.168.1.6:3001/api',
      target: 'http://localhost:3001/api',
      changeOrigin: true,
      pathRewrite: {
        '^/pager-editor/api': '',
      },
    }),
  );
  app.use(
    createProxyMiddleware('/pager-editor/assets', {
      // target: 'http://192.168.1.6:3001/assets',
      target: 'http://localhost:3001/assets',
      changeOrigin: true,
      pathRewrite: {
        '^/pager-editor/assets': '',
      },
    }),
  );
  app.use(
    createProxyMiddleware('/pager-editor/codes', {
      // target: 'http://192.168.1.6:3001/codes',
      target: 'http://localhost:3001/codes',
      changeOrigin: true,
      pathRewrite: {
        '^/pager-editor/codes': '',
      },
    }),
  );
};

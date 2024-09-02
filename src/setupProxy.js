const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://irhere.com.au',
      changeOrigin: true,
      secure: false, // If your server uses a self-signed certificate
    })
  );
};

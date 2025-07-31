/** @type {import('next').NextConfig} */

const nextConfig = {
  basePath: '',
  staticPageGenerationTimeout: 2000,
  output: 'standalone',
  pageExtensions: ["js", "jsx", "ts", "tsx"],

  async rewrites() {
    return [
      {
        source: '/api/bot',
        destination: 'https://big-head-eaba7dc1431e.herokuapp.com/bot',
      },
    ]
  },

  // Configuración para manejo de proxies más robusto
  experimental: {
    proxyTimeout: 60000, // 1 minuto timeout
  },

  webpack(config, options) {
    config.resolve.modules.push(__dirname);
    config.resolve.modules.push("./src");
    return config;
  },
};

module.exports = nextConfig;
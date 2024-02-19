module.exports = {
  apps: [
    {
      name: 'eprice_telegram',
      script: './dist/main.js',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};

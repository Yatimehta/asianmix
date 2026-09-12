module.exports = {
  apps: [
    {
      name: 'asianmix-backend',
      script: 'dist/server.js',
      cwd: '/var/www/asianmix/backend',
      instances: 2,
      exec_mode: 'cluster',
      max_memory_restart: '300M',
      exp_backoff_restart_delay: 100,
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001,
      },
      env_development: {
        NODE_ENV: 'development',
        PORT: 5001,
      },
      error_file: '/root/.pm2/logs/asianmix-backend-error.log',
      out_file: '/root/.pm2/logs/asianmix-backend-out.log',
      merge_logs: true,
      time: true,
    },
  ],
};

module.exports = {
  apps: [
    {
      name: "smart-farmland-web",
      cwd: __dirname,
      script: "npm",
      args: "run start",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};

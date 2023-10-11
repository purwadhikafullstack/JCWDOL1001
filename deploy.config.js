module.exports = {
  apps: [
    {
      name: "JCWDOL-10-01", // Format JCWD-{batchcode}-{groupnumber}
      script: "./projects/server/src/index.js",
      env: {
        NODE_ENV: "production",
        PORT: 3410,
      },
      time: true,
    },
  ],
};

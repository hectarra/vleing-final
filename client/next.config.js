module.exports = {
  distDir: "_next",
  generateBuildId: async () => {
    if (process.env.BUILD_ID) {
      return process.env.BUILD_ID;
    } else {
      return `${new Date().getTime()}`;
    }
  },
  webpackDevMiddleware: config => {
    config.watchOptions.poll = 300;
    return config;
  }
}
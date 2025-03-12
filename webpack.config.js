const { withExpoWebpack } = require("@expo/webpack-config");

module.exports = (env, argv) => {
  return withExpoWebpack(env, argv);
};

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  "stories": ["../stories/**/*.stories.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  "framework": "@storybook/react",
  docs: {
    autodocs: true
  },
  core: {
    builder: 'webpack5',
  },
  webpackFinal: async (config, { configType }) => {
    // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
    // You can change the configuration based on that.
    // 'PRODUCTION' is used when building the static version of storybook.
    // Check docs here: https://storybook.js.org/docs/react/configure/webpack#extending-storybooks-webpack-config

    config.plugins.push(new MiniCssExtractPlugin({ filename: 'styles.css' }));

    // Add Linaria loader after babel-loader
    config.module.rules.push({
      test: /\.(t|j)sx?$/,
      exclude: /node_modules/,
      enforce: 'post',
      use: [
        {
          loader: require.resolve('@linaria/webpack-loader'),
          options: {
            sourceMap: true,
            babelOptions: {
              presets: [
                require.resolve('@babel/preset-typescript'),
              ],
            },
          },
        },
      ],
    });

    // Replace CSS loader
    const cssKey = config.module.rules.findIndex(x => x.test.toString() === "/\\.css$/");

    config.module.rules[cssKey] = {
      test: /\.css$/,
      use: [
        {
          loader: MiniCssExtractPlugin.loader
        },
        {
          loader: 'css-loader',
          options: { sourceMap: true },
        },
      ],
    };

    return config;
  }
};

const webpack = require('webpack')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const _resolve = (...args) => path.resolve(__dirname, ...args)

const mode = process.env.NODE_ENV

module.exports = (env, {mode}) => {
  const config = {
    cache: true,
    devtool: 'source-map',
    devServer: {
      lazy: true,
      contentBase: _resolve('dist'),
      publicPath: '/',
    },
    context: _resolve('src'),
    entry: 'index.tsx',
    output: {
      path: _resolve('dist'),
      filename: 'mojimoji.js',
    },
    module: {
      rules: [
        // lint check
        {
          enforce: 'pre',
          test: /\.tsx?$/,
          exclude: /node_modules/,
          loader: 'eslint-loader',
          options: {
            fix: true,
          },
        },
        // .ts files
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: ['babel-loader', 'ts-loader'],
        },
        // .css files
        {
          test: /\.css$/,
          oneOf: [
            {
              resourceQuery: /^\?global$/,
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    modules: {
                      mode: 'global',
                    },
                  },
                },
                'postcss-loader',
              ],
            },
            {
              use: [
                'style-loader',
                {
                  loader: 'css-loader',
                  options: {
                    importLoaders: 1,
                    modules: {
                      mode: 'local',
                    },
                  },
                },
                'postcss-loader',
              ],
            },
          ],
        },
        // assets
        {
          test: /\.(jpg|png|svg)$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                name: 'assets/[name].[hash:8].[ext]',
                limit: 131072,
              },
            },
          ],
          include: [_resolve('src/assets')],
        },
      ],
    },
    plugins: [new HtmlWebpackPlugin({template: _resolve('src/index.html')})],
    resolve: {
      modules: [_resolve('src'), 'node_modules'],
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
  }

  if (mode === 'production') {
    // in production
  } else {
    const cssRules = config.module.rules.find(rule => 'zyx.css'.match(rule.test))
    cssRules.oneOf.forEach(config => {
      const cssLoaderConfig = config.use.find(x => x.loader === 'css-loader')
      cssLoaderConfig.options.modules.localIdentName = '[path][name]__[local]'
    })
  }

  return config
}

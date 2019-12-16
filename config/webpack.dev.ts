import * as webpack from 'webpack'
import * as utils from './utils'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin'
import TsconfigPathsWebpackPlugin from 'tsconfig-paths-webpack-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'

import '@types/webpack-dev-server'

process.env.NODE_ENV = 'development'

const envVariables = utils.getEnvVariables()

const config: webpack.Configuration = {
  mode: 'development',
  devtool: 'cheap-module-source-map',
  stats: 'minimal',
  entry: {
    app: utils.resolve('src/index.tsx'),
  },
  resolve: {
    modules: [
      utils.resolve('node_modules')
    ],
    extensions: [
      '.ts', '.tsx', '.js', '.jsx'
    ],
    plugins: [
      new TsconfigPathsWebpackPlugin({
        configFile: utils.resolve('tsconfig.json'),
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: true,
        }
      },
      {
        test: /.scss$/,
        oneOf: [
          {
            test: /global.scss$/,
            use: [
              'style-loader',
              'css-loader',
              'sass-loader',
            ],
          },
          {
            use: [
              'style-loader',
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]-[local]',
                  }
                }
              },
              'sass-loader'
            ]
          }
        ]
      },
    ]
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin({
      async: true,
      tsconfig: utils.resolve('tsconfig.json'),
    }),
    new HTMLWebpackPlugin({
      template: utils.resolve('public/index.html'),
    }),
    new webpack.DefinePlugin(envVariables),
    new webpack.HotModuleReplacementPlugin(),
    new CopyWebpackPlugin([
      {
        from: utils.resolve('public'),
        to: utils.resolve('dist'),
      }
    ])
  ],
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
  devServer: {
    contentBase: utils.resolve('dist'),
    historyApiFallback: true,
    host: '0.0.0.0',
    port: +process.env.PORT || 3000,
    hot: true,
    inline: true,
  },
}

export default config
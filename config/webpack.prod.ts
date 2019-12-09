import * as webpack from 'webpack'
import * as utils from './utils'
import { CleanWebpackPlugin } from 'clean-webpack-plugin'
import WorkboxWebpackPlugin from 'workbox-webpack-plugin'
import HTMLWebpackPlugin from 'html-webpack-plugin'
import OptimizeCSSAssetsPlugin from 'optimize-css-assets-webpack-plugin'
import ForkTsCheckerPlugin from 'fork-ts-checker-webpack-plugin'
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import CopyWebpackPlugin from 'copy-webpack-plugin'
import TerserWebpackPlugin from 'terser-webpack-plugin'

process.env.NODE_ENV = 'production'

const envVariables = utils.getEnvVariables()

const getStyleLoaders = (isModule: boolean): webpack.RuleSetUse => {
  const cssLoaderWithModule = {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: '[name]-[local]',
      }
    }
  }
  const cssLoader = isModule
    ? cssLoaderWithModule
    : 'css-loader' 

  return [
    MiniCssExtractPlugin.loader,
    cssLoader,
    {
      loader: 'postcss-loader',
      options: {
        ident: 'postcss',
        plugins: () => [
          require('postcss-flexbugs-fixes'),
          require('postcss-preset-env')({
            autoprefixer: {
              flexbox: 'no-2009',
            },
            stage: 3,
          }),
        ],
      }
    },
    'sass-loader',
  ]
}

const config: webpack.Configuration = {
  mode: 'production',
  devtool: false,
  bail: true,
  stats: 'normal',
  entry: {
    app: utils.resolve('src/index.tsx'),
  },
  output: {
    path: utils.resolve('dist'),
    publicPath: './',
    filename: 'javascript/[name].[chunkhash:5].js',
    chunkFilename: 'javascript/[name].[chunkhash:5].chunk.js',
  },
  resolve: {
    modules: [
      utils.resolve('node_modules')
    ],
    extensions: [
      '.ts', '.tsx', '.js', '.jsx'
    ],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: utils.resolve('tsconfig.json'),
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'babel-loader',
        options: {
          plugins: [
            '@babel/plugin-proposal-class-properties',
            [
              '@babel/plugin-transform-runtime',
              {
                helpers: true,
                regenerator: true,
                useESModules: false
              }
            ]
          ],
          presets: [
            '@babel/preset-react',
            '@babel/preset-env',
            [
              '@babel/preset-typescript',
              {
                isTSX: true,
                allExtensions: true,
                allowNamespaces: false,
              }
            ],
          ],
        }
      },
      {
        test: /.scss$/,
        oneOf: [
          {
            test: /global.scss$/,
            use: getStyleLoaders(false),
          },
          {
            use: getStyleLoaders(true)
          }
        ]
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style/[name].[contenthash:5].css',
      chunkFilename: 'style/[name].[contenthash:5].css',
    }),
    new ForkTsCheckerPlugin({
      async: true,
      tsconfig: utils.resolve('tsconfig.json'),
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new HTMLWebpackPlugin({
      inject: 'body',
      minify: {
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeTagWhitespace: true,
        collapseWhitespace: true,
      },
      template: utils.resolve('public/index.html'),
    }),
    new webpack.DefinePlugin(envVariables),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([
      {
        from: utils.resolve('public'),
        to: utils.resolve('dist'),
      }
    ]),
    new WorkboxWebpackPlugin.GenerateSW({
      clientsClaim: true,
      exclude: [/\.map$/, /asset-manifest\.json$/, /index.html$/],
      importWorkboxFrom: 'local',
      navigateFallback: '/index.html',
      navigateFallbackBlacklist: [
        new RegExp('^/_'),
        new RegExp('/[^/]+\\.[^/]+$'),
      ],
    })
  ],
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin(),
      new TerserWebpackPlugin({
        parallel: true,
        cache: true,
        sourceMap: false,
        extractComments: false,
        terserOptions: {
          safari10: true,
          output: {
            comments: false,
          }
        }
      })
    ],
    splitChunks: {
      chunks: 'all',
      name: true,
      cacheGroups: {
        vonders: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vonders',
          priority: 10,
        },
      },
    },
    runtimeChunk: {
      name: 'runtime',
    },
  },
  node: {
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty',
  },
}

export default config
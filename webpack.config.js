// @ts-check
/* eslint-disable no-console */

/** @module Webpack config
 *  @since 2025.05.17
 *  @changed 2026.06.05, 19:27
 */

const webpack = require('webpack');

const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackNotifierPlugin = require('webpack-notifier');
const { getCompilationScriptsContent, readContent } = require('./webpack.helpers');
const {
  isDev,
  isDebug,
  serveAssetsLocally,
  appVersionHash,
  outPath,
  templateFile,
  devtool,
  minimizeAssets,
  appId,
  scriptsAssetFile,
  stylesAssetFile,
  compiledTemplatesFolder,
  compiledBundleFolder,
  localServerPort,
  templateDevFile,
} = require('./webpack.params');

// const NL = '\n';

const globOptions = {
  // "dot: true" allows matching files starting with a period (e.g. .gitkeep)
  dot: true,
  ignore: [
    // Files to ignore
    '**/*_',
    '**/*!',
    '**/.*.swp',
    '**/*.tmp',
    '**/*.orig',
    '**/svgo.config.js',
    '**/.gitignore',
  ],
};

const outFolder = path.resolve(__dirname, outPath);

module.exports = {
  mode: isDev ? 'development' : 'production',

  // @see https://webpack.js.org/configuration/devtool/#devtool
  devtool,
  // devtool: isDev ? 'eval-cheap-source-map' : useSourceMaps ? 'source-map' : false,
  entry: [
    // NOTE: See also `files` field in `tsconfig.json`
    './src/root.ts',
  ],
  resolve: {
    extensions: [
      // All source extensions
      '.css',
      '.jpg',
      '.js',
      '.png',
      '.sass',
      '.scss',
      '.svg',
      '.ts',
      '.tsx',
    ],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        // @see https://github.com/TypeStrong/ts-loader
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          /* isDev ? 'style-loader' : */ {
            loader: MiniCssExtractPlugin.loader,
            options: {
              esModule: false,
            },
          },
          // Translates CSS into CommonJS
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              // modules: true,
              modules: {
                // compileType: 'icss',
                // mode: 'local',
                mode: 'icss',
              },
              sourceMap: true,
              url: true, // Don't fetch assets from `url(...)`
            },
          },
          {
            loader: 'resolve-url-loader',
            options: {
              sourceMap: true,
            },
          },
          // Compiles Sass to CSS
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
              api: 'modern',
              // Pass dev/prod falg variables. Use it like `@if $isDev {...` etc
              additionalData: `$isDev: ${isDev}; $isProd: ${!isDev};`,
              /* // NOTE: Inject 'use' for math and color features, import common variables and mixins.
               * additionalData: [
               *   // '@use "sass:math";',
               *   // '@use "sass:color";',
               *   // '@import "src/variables.scss";',
               *   // '@import "src/mixins.scss";',
               * ]
               *   .filter(Boolean)
               *   .join('\n'),
               */
              sassOptions: {
                // TODO: Pass isDev to the modules
                // @see https://github.com/sass/node-sass#outputstyle
                outputStyle: minimizeAssets ? 'compressed' : 'expanded',
                quietDeps: true,
                silenceDeprecations: [
                  // @see node_modules/sass/types/deprecations.d.ts
                  'legacy-js-api',
                  // 'import',
                  // 'color-functions',
                  // 'global-builtin',
                ],
              },
            },
          },
        ],
      },
      /* // Keep assets inlined in the css
       * {
       *   test: /\.(png|jpe?g|gif|svg|png|jpg|eot|ttf|woff|woff2)$/i,
       *   // More information here https://webpack.js.org/guides/asset-modules/
       *   type: 'asset/inline',
       * },
       */
    ],
  },
  plugins: [
    new CleanWebpackPlugin({
      dangerouslyAllowCleanPatternsOutsideProject: true,
      dry: false,
      verbose: true,
      cleanAfterEveryBuildPatterns: [], // disable default after‑build cleaning
      // Clean only specific paths (and their contents)
      cleanOnceBeforeBuildPatterns: [
        // absolute or relative paths ending with `/**/*` to clear contents
        path.resolve(outPath, `${compiledBundleFolder}/**/*`),
        path.resolve(outPath, `${compiledTemplatesFolder}/**/*`),
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.DEV': isDev,
      'process.env.DEBUG': isDebug,
      'process.env.APP_VERSION': JSON.stringify(appVersionHash),
    }),
    new MiniCssExtractPlugin({
      filename: stylesAssetFile,
      // chunkFilename: 'css/[id].css',
    }),
    new CopyPlugin({
      patterns: [
        // Copy files
        // { from: appInfoFile, to: compiledBundleFolder },
        // { from: appInfoFile, to: compiledTemplatesFolder },
        { from: 'public/app-info.txt', to: compiledTemplatesFolder },
        {
          from: 'public',
          to: compiledBundleFolder,
          globOptions,
        },
      ],
    }),
    new HtmlWebpackPlugin({
      // template: 'src/template-header.html',
      filename: `${compiledTemplatesFolder}/index.html`,
      inject: false,
      minify: false,
      templateContent: (args) => {
        /** @type {webpack.Compilation} */
        const compilation = args.compilation;
        // Get scripts content...
        const scriptsContent = getCompilationScriptsContent(compilation, {
          isDev,
          isDebug,
          serveAssetsLocally,
        });
        return [
          // Combine template...
          `<!-- ${appId} ${appVersionHash} -->`,
          // Include shared content
          readContent(path.resolve(__dirname, templateFile)),
          // UNUSED: Add dev content for debug mode
          isDev && readContent(path.resolve(__dirname, templateDevFile)),
          scriptsContent,
        ]
          .filter(Boolean)
          .join('\n');
      },
    }),
    new WebpackNotifierPlugin({
      title: 'Webpack Build',
      alwaysNotify: true, // Notifies on every successful rebuild
      emoji: true, // Adds status emojis to the notification
      // skipFirstNotification: true,
    }),
  ],
  optimization: {
    minimize: minimizeAssets,
    minimizer: minimizeAssets
      ? [
          new CssMinimizerPlugin(),
          new TerserPlugin({
            extractComments: false,
            // exclude: 'assets',
            terserOptions: {
              compress: {
                drop_debugger: false,
              },
            },
          }),
        ]
      : [],
  },
  performance: {
    hints: false,
    // maxEntrypointSize: 512000,
    // maxAssetSize: 512000,
  },
  output: {
    filename: scriptsAssetFile,
    // NOTE: See also `outDir` field in `tsconfig.json`
    path: outFolder,
    // clean: true,
    // publicPath: '/',
    // assetModuleFilename: 'assets/[hash][ext][query]',
  },
  devServer: {
    static: outFolder, // Tell server where to serve content from
    hot: true, // Enables Hot Module Replacement without full page reload
    // open: true, // Automatically opens your browser
    port: localServerPort, // Custom port
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': 'https://www.podolsk-print.ru/',
      // 'Access-Control-Allow-Origin': '*', // Or 'http://localhost:8000'
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
    },
  },
};

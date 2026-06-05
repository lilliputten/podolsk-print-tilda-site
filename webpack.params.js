// @ts-check

/** @module Webpack params
 *  @since 2025.05.17, 00:00
 *  @changed 2026.06.05, 19:27
 */

const { loadEnvFile } = require('node:process');
const fs = require('fs');
const path = require('path');
const packageData = require('./package.json');

if (fs.existsSync('.env')) loadEnvFile('.env');
if (fs.existsSync('.env.local')) loadEnvFile('.env.local');

const isDev = getTruthy(process.env.DEV);
const isDebug = getTruthy(process.env.DEBUG);

/** Use locally served assets (only for debug mode) */
const serveAssetsLocally = true;

const useInlineScripts = !serveAssetsLocally;

/** Create source maps for production mode (not dev) */
const generateSourcesForProduction = true;

/** Shared template content */
const templateFile = 'src/template.html';
const templateDevFile = 'src/template-dev.html';
// const templateScriptsFile = 'src/template-scripts.html';

const appId = packageData.name;

const appInfoFile = 'src/app-info.json';
const appInfoContent = fs.readFileSync(path.resolve(__dirname, appInfoFile), {
  encoding: 'utf8',
});
const appInfoData = JSON.parse(appInfoContent);
const { appInfo } = appInfoData;
const appVersionHash = appInfo;
const matches = appInfo.match(/^v\.(\S+) \/ (.*)$/);
matches.shift(); // Remove the 1st argument: for the whole matched string
const [version, timestamp] = matches;
const timetag = timestamp.replace(/^\d\d(\d+)\.(\d+)\.(\d+)[, -]*(\d+):(\d+).*/, '$1$2$3-$4$5');
const appVersionTag = 'v.' + version + '-' + timetag;
const outPath =
  process.env.INJECT && process.env.INJECT_PATH
    ? process.env.INJECT_PATH
    : isDev
      ? 'build-dev'
      : 'build';

// NOTE: Use trailing slashes for intermediate paths
const compiledBundleUrlPrefix = '';
const compiledBundleFolderPrefix = ``;
const compiledBundleFolder = `${compiledBundleFolderPrefix}${compiledBundleUrlPrefix}`;
const compiledTemplatesFolder = '';

const scriptsAssetFile = `${compiledBundleFolder}scripts.js`;
const stylesAssetFile = `${compiledBundleFolder}styles.css`;
const scriptsAssetUrl = `${compiledBundleUrlPrefix}scripts.js`;
const stylesAssetUrl = `${compiledBundleUrlPrefix}styles.css`;

// Dev-server options
const localServerPort = '3000';
const localServerPrefix = `http://localhost:${localServerPort}/${compiledBundleFolderPrefix}`; // Default, for raw serve

// @see https://webpack.js.org/configuration/devtool/#devtool
const devtool = isDev
  ? useInlineScripts
    ? 'inline-source-map'
    : 'source-map'
  : generateSourcesForProduction
    ? 'source-map'
    : undefined;
const minimizeAssets = !isDev || !serveAssetsLocally;

// Info:
console.log('DEV:', isDev); // eslint-disable-line no-console
console.log('DEBUG:', isDebug); // eslint-disable-line no-console
console.log('VERSION:', appVersionHash); // eslint-disable-line no-console
console.log('devtool:', devtool); // eslint-disable-line no-console
console.log('outPath:', outPath); // eslint-disable-line no-console

// Core helpers...

/** @param {boolean|string|number|undefined|null} val */
function getTruthy(val) {
  if (!val || val === 'false' || val === '0') {
    return false;
  }
  return true;
}

// Export parameters...
module.exports = {
  isDev,
  isDebug,

  serveAssetsLocally,
  useInlineScripts,

  templateFile,
  templateDevFile,
  // templateScriptsFile,
  generateSourcesForProduction,

  appId,
  appInfoFile,
  appInfoContent,
  appInfo,
  appVersionHash,
  appVersionTag,

  outPath,
  compiledBundleFolder,
  compiledTemplatesFolder,

  scriptsAssetFile,
  stylesAssetFile,
  scriptsAssetUrl,
  stylesAssetUrl,

  localServerPort,
  localServerPrefix,

  devtool,
  minimizeAssets,
};

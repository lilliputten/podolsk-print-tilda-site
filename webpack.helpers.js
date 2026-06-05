// @ts-check

/** @module Webpack config
 *  @since 2025.05.17, 00:00
 *  @changed 2026.06.05, 19:27
 */

// eslint-disable-next-line no-unused-vars
const webpack = require('webpack'); // Used only for typings

const fs = require('fs');

const {
  scriptsAssetFile,
  stylesAssetFile,
  appVersionTag,
  localServerPrefix,
} = require('./webpack.params');

/** @param {webpack.sources.Source | webpack.sources.ConcatSource} asset */
function getSourceContent(asset) {
  /** @type {string | Buffer} */
  const content = asset.source();
  // Convert to string if buffer...
  if (content instanceof Buffer) {
    return content.toString('utf8');
  }
  // TODO: Check other (?) types?
  return String(content);
}

/** @param {webpack.sources.Source | webpack.sources.ConcatSource} asset */
function getAssetContent(asset) {
  /** @type {string} */
  let content = '';
  // Extract content from a list of children or a single item...
  const concatSourceAsset = /** @type {webpack.sources.ConcatSource} */ (asset);
  if (typeof concatSourceAsset.getChildren === 'function') {
    const sources = concatSourceAsset.getChildren();
    content = sources.map(getSourceContent).join('');
    // content = sources.map((s) => s.source()).join('');
  } else {
    content = getSourceContent(asset);
  }
  return content;
}

/**
 * @param {string} content
 */
function removeSourceMaps(content) {
  content = content.replace(/\s*\/.# sourceMappingURL=.*/, '');
  content = content.replace(/[\r\n]{2,}/gm, '\n');
  return content.trim();
}

/**
 * @param {webpack.Compilation} compilation
 * @param {object} [opts]
 * @param {boolean} [opts.isDev]
 * @param {boolean} [opts.isDebug]
 * @param {boolean} [opts.serveAssetsLocally]
 */
/**
 * @param {webpack.Compilation} compilation
 * @param {object} [opts]
 * @param {boolean} [opts.isDev]
 * @param {boolean} [opts.isDebug]
 * @param {boolean} [opts.serveAssetsLocally]
 */
function getCompilationScriptsContent(compilation, opts = {}) {
  // UNUSED: Locally linked assets
  if (opts.isDev && opts.serveAssetsLocally) {
    return [
      '<!-- DEV: Locally linked compiled assets (scripts & styles) -->',
      `<link id="linkedStyles" rel="stylesheet" type="text/css" href="${localServerPrefix}${stylesAssetFile}?${appVersionTag}" />`,
      `<script id="linkedScripts" onerror="devScriptError(this)" type="text/javascript" src="${localServerPrefix}${scriptsAssetFile}?${appVersionTag}"></script>`,
    ].join('\n');
  }
  // Get all assets hash from the compilation...
  const { assets } = compilation;
  // Get scripts chunk...
  /** @type {webpack.sources.Source} */
  const scriptsAsset = assets[scriptsAssetFile];
  if (!scriptsAsset) {
    throw new Error('Scripts asset "' + scriptsAssetFile + '" not found!');
  }
  const scriptsContent = getAssetContent(scriptsAsset);
  // Get styles chunk...
  /** @type {webpack.sources.Source} */
  const stylesAsset = assets[stylesAssetFile];
  if (!stylesAsset) {
    throw new Error('Styles asset "' + stylesAssetFile + '" not found!');
  }
  const stylesContent = getAssetContent(stylesAsset);
  // const useLinkedAssets = true;
  // if (useLinkedAssets) {
  //   return [
  //     `<script type="text/javascript" src="${localServerPrefix}${scriptsAssetUrl}?${appVersionTag}"></script>`,
  //   ].join('\n');
  // }
  const useInjectedAssets = false;
  if (useInjectedAssets && opts.isDebug) {
    const scriptsContentEncoded = btoa(scriptsContent);
    return [
      `<!-- DEBUG: Injected styles begin (${stylesAssetFile}) -->`,
      `<link id="injectedStyles" rel="stylesheet" type="text/css" href="data:text/css;base64,${btoa(stylesContent)}" />`,
      `<!-- DEBUG: Injected styles end (${stylesAssetFile}) -->`,
      '',
      `<!-- DEBUG: Injected scripts begin (${scriptsAssetFile}) -->`,
      `<script id="injectedScripts" type="text/javascript" src="data:text/javascript;base64,${scriptsContentEncoded}"></script>`,
      `<!-- DEBUG: Injected scripts end (${scriptsAssetFile}) -->`,
    ].join('\n');
  }
  // TODO: Remove source map lines?
  return [
    `<!-- Inline styles begin (${stylesAssetFile}) -->`,
    '<style type="text/css">',
    removeSourceMaps(stylesContent),
    '</style>',
    `<!-- Inline styles end (${stylesAssetFile}) -->`,
    '',
    `<!-- Inline scripts begin (${scriptsAssetFile}) -->`,
    '<script type="text/javascript">',
    removeSourceMaps(scriptsContent),
    '</script>',
    `<!-- Inline scripts end (${scriptsAssetFile}) -->`,
  ].join('\n');
}

/** @param {string} fileName */
function readContent(fileName) {
  if (!fs.existsSync(fileName)) {
    return '';
  }
  const content = fs
    .readFileSync(fileName, { encoding: 'utf8' })
    .replace(/{# ex: set ft=htmldjango : #}\n*/g, '')
    .trim();
  return content;
}

module.exports = {
  // getCompilationStylesContent,
  getCompilationScriptsContent,
  readContent,
};

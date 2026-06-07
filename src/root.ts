import './app-info.scss';
import './variables/variables-expose.scss';
import './styles';

import { isDev } from './core/constants/isDev';
import { initMediaThresholdsIndicators } from './scripts/media-indicator';
import { initProductionIndex } from './scripts/ProductionIndex';
import { initSharedConfirmForm } from './scripts/shared-confirm-form';

/** Print app info */
function printAppInfo() {
  const appVersion = process.env.APP_VERSION;
  // eslint-disable-next-line no-console
  console.warn('compiled-assets', appVersion || 'APP_VERSION not available');
}

/** Initalize the whole page */
function initPage() {
  // Initalize subcomponents...
  if (isDev) {
    initMediaThresholdsIndicators();
  }
  initSharedConfirmForm();
  initProductionIndex();
  /* // Forcibely update components' dimensions
   * window.dispatchEvent(new Event('resize'));
   */
}

printAppInfo();

window.addEventListener('load', initPage);

import { isDev } from '../core/constants/isDev';
import { mediaKeysList, mediaSizesList } from '../variables/cssVariables';

export function initMediaThresholdsIndicators() {
  const body = document.body;
  const html = body.parentNode as HTMLElement;
  const isLocalhost = ['localhost', '127.0.0.1', '[::1]'].includes(window.location.hostname);
  if (html.classList.contains('debug') || isLocalhost || isDev) {
    // eslint-disable-next-line no-console
    console.log('[media-indicator:initMediaThresholdsIndicators] Creating media-indicator');
    const indicatorNode = document.createElement('div');
    indicatorNode.classList.add('media-indicator');
    const ids = mediaKeysList.concat('-');
    const widestId = mediaKeysList[0];
    const narrowestId = mediaKeysList[mediaKeysList.length - 1];
    const widestHiddenId = `max-${widestId}-hidden`;
    const narrowestHiddenId = `min-${narrowestId}-hidden`;
    const last = ids.length - 1;
    for (let i = last; i >= 0; i--) {
      const id = ids[i];
      const size = mediaSizesList[i] || 0;
      const node = document.createElement('div');
      const className = i === last ? narrowestHiddenId : !i ? widestHiddenId : `no-${id}-hidden`;
      const title = [
        // Construct title...
        'Media size:',
        `${size}+`,
        id !== '-' && `(${id})`,
        // '(click to close)',
      ]
        .filter(Boolean)
        .join(' ');
      node.setAttribute('data-id', id);
      node.setAttribute('data-min-size', String(size));
      node.classList.add(className);
      node.setAttribute('title', title);
      node.innerText = id;
      indicatorNode.appendChild(node);
    }
    indicatorNode.addEventListener('click', () => {
      indicatorNode.classList.add('hidden');
    });
    body.appendChild(indicatorNode);
  }
}

export function createSvgFromDataUrl(dataUrl: string): SVGElement | null {
  // Extract base64 data
  const base64Data = dataUrl.split(',')[1];
  if (!base64Data) return null;

  // Decode base64 string
  const decodedString = atob(base64Data);
  // Parse as XML
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(decodedString, 'image/svg+xml');
  // Extract the SVG element
  const svgElement = xmlDoc.documentElement as unknown as SVGElement;
  if (!svgElement || svgElement.tagName !== 'svg') return null;

  return svgElement;
}

/* eslint-disable @typescript-eslint/no-explicit-any */

declare const lucide: {
  // @see https://lucide.dev/guide/lucide/getting-started#example
  createIcons: (opts?: unknown) => void;
};

declare global {
  const process: {
    env: Record<string, string | undefined>;
  };

  // Type declarations for asset imports
  interface ImportMeta {
    url: string;
  }
}

declare module '*.svg' {
  const src: string;
  export default src;
}

declare module '*.png' {
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const src: string;
  export default src;
}

declare module '*.jpeg' {
  const src: string;
  export default src;
}

declare module '*.gif' {
  const src: string;
  export default src;
}

declare module '*.scss';

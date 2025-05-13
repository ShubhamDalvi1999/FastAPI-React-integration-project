// Type declarations for .jsx files
declare module '*.jsx' {
    import type { ComponentType, PropsWithChildren } from 'react';
    const component: ComponentType<PropsWithChildren<Record<string, unknown>>>;
    export default component;
  }

// Allow CSS imports
declare module '*.css' {
  const css: { [key: string]: string };
  export default css;
}

// Allow image imports
declare module '*.svg' {
  import type { ComponentType, SVGProps } from 'react';
  const SVG: ComponentType<SVGProps<SVGSVGElement>>;
  export default SVG;
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

// Declaration for global variables from environment variables
interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  // more environment variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
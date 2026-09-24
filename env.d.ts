/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_STRIPE_PUBLISHABLE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface BootstrapJs {
  Modal: any
  Tooltip: any
  Popover: any
  [key: string]: any
}

declare module 'bootstrap/dist/js/bootstrap.bundle.min.js' {
  const bootstrap: BootstrapJs
  export default bootstrap
}

interface Window {
  bootstrap: BootstrapJs
}

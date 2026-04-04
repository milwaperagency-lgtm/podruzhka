/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  readonly VITE_TELEGRAM_CHANNEL?: string;
  readonly VITE_TELEGRAM_BOT?: string;
  /** Расширение файлов базы кожи: svg (по умолчанию) или png после copy-skin-png */
  readonly VITE_SKIN_EXT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

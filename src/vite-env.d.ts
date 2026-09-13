/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 地址，如 http://localhost:3000（生产构建时注入） */
  readonly VITE_API_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

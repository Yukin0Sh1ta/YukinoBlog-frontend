// src/config/api.ts
// 后端 API 地址收敛点：
// - 开发：Vite 代理或 VITE_API_URL（.env.development，默认 http://localhost:3000）
// - 生产：构建时注入 VITE_API_URL（Vite 静态替换 import.meta.env.*）
export const API_BASE =
  import.meta.env.VITE_API_URL ?? "http://localhost:3000"

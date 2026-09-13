// src/stores/theme.ts
import { create } from "zustand"

interface ThemeState {
  isDark: boolean
  toggle: () => void
}

// 初始化：从 localStorage 恢复（默认夜间）
function loadDark() {
  try {
    const saved = localStorage.getItem("Yukino_theme")
    if (saved !== null) return saved === "dark"
  } catch {}
  return true   // 默认夜间
}

export const useThemeStore = create<ThemeState>((set) => ({
  isDark: loadDark(),
  toggle: () =>
    set((s) => {
      const next = !s.isDark
      try {
        localStorage.setItem("Yukino_theme", next ? "dark" : "light")
      } catch {}
      return { isDark: next }
    }),
}))

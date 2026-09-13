// src/stores/user.ts
import { create } from "zustand"

export interface GitHubUser {
  login: string        // GitHub 用户名
  avatar_url: string   // 头像
  name: string | null
  id: number
}

interface UserState {
  user: GitHubUser | null
  token: string | null
  login: (user: GitHubUser, token: string) => void
  logout: () => void
}

const STORAGE_KEY = "Yukino_github_user"

// 从 localStorage 恢复
function loadUser(): { user: GitHubUser | null; token: string | null } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { user: null, token: null }
    const parsed = JSON.parse(raw)
    return { user: parsed.user ?? null, token: parsed.token ?? null }
  } catch {
    return { user: null, token: null }
  }
}

const restored = loadUser()

export const useUserStore = create<UserState>((set) => ({
  user: restored.user,
  token: restored.token,

  login: (user, token) => {
    set({ user, token })
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user, token }))
  },

  logout: () => {
    set({ user: null, token: null })
    localStorage.removeItem(STORAGE_KEY)
  },
}))

// GitHub OAuth 配置
export const GITHUB_CLIENT_ID = "Ov23liUcX43fI517PrsY"

// 跳转 GitHub 授权页
export function redirectToGitHubLogin() {
  const redirectUri = `${window.location.origin}/auth/github/callback`
  const url = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user`
  window.location.href = url
}

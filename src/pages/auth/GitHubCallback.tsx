// src/pages/auth/GitHubCallback.tsx
import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router"
import { useUserStore, type GitHubUser } from "../../stores/user"
import { API_BASE } from "../../config/api"

// 后端接口地址（code 换用户信息）
const BACKEND_AUTH_URL = `${API_BASE}/api/auth/github`

export const GitHubCallback = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const login = useUserStore((s) => s.login)
  const [error, setError] = useState("")
  // 防重复：code 只能换一次 token，StrictMode 的双执行会导致第二次 401
  const calledRef = useRef(false)

  useEffect(() => {
    const code = searchParams.get("code")
    if (!code) {
      setError("未收到授权码，登录失败")
      return
    }
    // code 一次性：StrictMode 双执行时只发一次请求
    if (calledRef.current) return
    calledRef.current = true

    // 把 code 发给后端 → 后端换 token + 用户信息
    async function exchangeCode() {
      try {
        const res = await fetch(BACKEND_AUTH_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        })
        if (!res.ok) throw new Error("后端登录失败")

        const data = await res.json()
        // 后端返回：{ user: GitHubUser, token: string }
        const user: GitHubUser = {
          login: data.user.login,
          avatar_url: data.user.avatar_url,
          name: data.user.name,
          id: data.user.id,
        }
        login(user, data.token)
        navigate("/message")   // 登录成功回树洞页
      } catch {
        setError("登录失败，请重试")
      }
    }

    exchangeCode()
  }, [searchParams, login, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {error ? (
        <div className="text-center">
          <p className="text-[#ff6b6b] text-sm">{error}</p>
          <button
            onClick={() => navigate("/message")}
            className="mt-4 px-4 py-2 rounded-xl bg-white/10 text-(--text-main) text-sm cursor-pointer border border-(--card-border) hover:bg-white/20"
          >返回树洞</button>
        </div>
      ) : (
        <p className="text-(--text-main) text-sm">GitHub 登录中...</p>
      )}
    </div>
  )
}

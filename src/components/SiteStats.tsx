// src/components/SiteStats.tsx
import { useEffect, useState } from "react"
import { API_BASE } from "../config/api"

// 站点上线时间（改成你的真实上线日期）
const LAUNCH_DATE = new Date("2026-01-01T00:00:00")

interface Article {
  id: number
  description: string | null
  content: string | null
}

export const SiteStats = () => {
  const [articles, setArticles] = useState<Article[]>([])
  const [messageCount, setMessageCount] = useState(0)
  const [uptime, setUptime] = useState({ days: 0, hours: 0, minutes: 0 })

  useEffect(() => {
    // 文章：从后端拿（和文章页同一数据源）
    fetch(`${API_BASE}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setArticles(data) })
      .catch(() => {})

    // 留言数：从 localStorage 读（Message 组件存的）
    try {
      const raw = localStorage.getItem("Yukino_talk_messages")
      if (raw) {
        const list = JSON.parse(raw)
        if (Array.isArray(list)) setMessageCount(list.length)
      }
    } catch {}

    // 运行时长：上线时间到现在
    const calcUptime = () => {
      const diff = Date.now() - LAUNCH_DATE.getTime()
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setUptime({ days, hours, minutes })
    }
    calcUptime()
    const timer = setInterval(calcUptime, 60000)   // 每分钟刷新
    return () => clearInterval(timer)
  }, [])

  // 总字数：所有文章正文字数
  const totalChars = articles.reduce(
    (sum, a) => sum + (a.content || a.description || "").length,
    0
  )

  const stats = [
    { label: "文章", value: `${articles.length}` },
    { label: "总字数", value: totalChars.toLocaleString() },
    { label: "留言数", value: `${messageCount}` },
    { label: "运行时长", value: `${uptime.days}天 ${uptime.hours}小时 ${uptime.minutes}分` },
  ]

  return (
    <div className="rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-4">
      <div className="grid grid-cols-4 gap-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-sm font-semibold text-(--text-main)">{s.value}</div>
            <div className="mt-1 text-xs text-(--text-muted)">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

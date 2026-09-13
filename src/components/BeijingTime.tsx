// src/components/BeijingTime.tsx
import { useEffect, useState } from "react"

// 北京时区 = UTC+8（Asia/Shanghai）
const BEIJING_TZ = "Asia/Shanghai"

// 格式化：2026年9月10日 星期四 14:30:25
function formatBeijing(date: Date) {
  const parts = new Intl.DateTimeFormat("zh-CN", {
    timeZone: BEIJING_TZ,
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).formatToParts(date)

  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? ""

  return {
    date: `${get("year")}年${get("month")}月${get("day")}日 ${get("weekday")}`,
    time: `${get("hour")}:${get("minute")}:${get("second")}`,
  }
}

export const BeijingTime = () => {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)   // 每秒更新
    return () => clearInterval(timer)
  }, [])

  const { date, time } = formatBeijing(now)

  return (
    <div className="rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-4 flex items-center justify-between">
      {/* 左侧：日期 + 时区标记 */}
      <div>
        <div className="text-sm text-(--text-sub)">{date}</div>
        <div className="text-xs text-(--text-muted) mt-1">北京时间 · UTC+8</div>
      </div>
      {/* 右侧：时钟（等宽字体防跳动） */}
      <div className="text-3xl font-bold text-(--text-main) tabular-nums tracking-wide">
        {time}
      </div>
    </div>
  )
}

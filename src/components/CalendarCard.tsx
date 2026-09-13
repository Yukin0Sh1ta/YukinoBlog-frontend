import { useState } from "react"

const WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"]

export const CalendarCard = () => {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())    


  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth()

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11) }
    else setMonth(month - 1)
  }
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0) }
    else setMonth(month + 1)
  }

  // 生成格子（前面空位 + 日期）
  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div className="rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-4">
      {/* 头部：年月 + 切换 */}
      <div className="flex items-center justify-between mb-3">
        <button
          onClick={prevMonth}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer text-[#9a9a9a] hover:text-(--text-main) transition-colors"
        >‹</button>
        <span className="text-sm font-semibold text-(--text-main)">
          {year}年{month + 1}月
        </span>
        <button
          onClick={nextMonth}
          className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer text-[#9a9a9a] hover:text-(--text-main) transition-colors"
        >›</button>
      </div>

      {/* 星期表头 */}
      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-center text-xs text-(--text-muted)">{w}</div>
        ))}
      </div>

      {/* 日期格子 */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => (
          <div
            key={i}
            className={`h-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
              d === null
                ? ""
                : d === today && isCurrentMonth
                  ? "bg-[linear-gradient(135deg,#ea5cb6,#d83e93)] text-(--text-main) font-semibold"
                  : "text-(--text-sub) hover:bg-white/10"
            }`}
          >
            {d}
          </div>
        ))}
      </div>
    </div>
  )
}

// src/component/LyricsCard.tsx
import { memo, useMemo } from "react"
import { lyricsMap } from "../constants/lyrics"
import { useMusicStore, playlist } from "../stores/music"

const LINE_HEIGHT = 40        // 每行固定高度（px）
const VIEWPORT_LINES = 4      // 可视区显示几行
const VIEWPORT_HEIGHT = LINE_HEIGHT * VIEWPORT_LINES   // 可视区高度

// 单行歌词（memo：props 不变就跳过重渲染——解决高频 currentTime 更新的卡顿）
const LyricLineRow = memo(function LyricLineRow({
  text,
  active,
  index,
}: {
  text: string
  active: boolean
  index: number
}) {
  return (
    <div className="flex items-center justify-center" style={{ height: LINE_HEIGHT }}>
      <span
        className={`text-sm transition-all duration-300 ${
          active ? "text-white font-semibold scale-110" : "text-gray-500"
        }`}
      >
        {text}
      </span>
    </div>
  )
})

export const LyricsCard = ({ currentTime }: { currentTime: number }) => {
  const currentIndex = useMusicStore((s) => s.currentIndex)
  const currentSong = playlist[currentIndex]

  // 根据当前歌曲 id 取歌词（切歌自动换歌词）
  const lyrics = useMemo(() => {
    if (!currentSong) return []
    return lyricsMap[currentSong.id] ?? []
  }, [currentSong?.id])

  // 时间偏移校正（LRC 时间戳整体偏晚 2 秒，提前触发歌词）
  const TIME_OFFSET = 2
  const adjustedTime = currentTime + TIME_OFFSET

  // 当前歌词索引（对比时间）
  let activeIndex = 0
  lyrics.forEach((line, i) => {
    if (adjustedTime >= line.time) activeIndex = i
  })

  // 当前高亮的时间戳（同一时间戳的日文 + 中文成对高亮）
  const activeTime = lyrics[activeIndex]?.time

  // 歌词容器上移：让当前行到可视区中部
  const offset = -(activeIndex * LINE_HEIGHT) + VIEWPORT_HEIGHT / 2

  return (
    <div
      className="rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg overflow-hidden"
      style={{ height: VIEWPORT_HEIGHT }}
    >
      {/* 歌词滚动容器：整体上移实现滚动 */}
      <div
        className="transition-transform duration-200 ease-linear"
        style={{ transform: `translateY(${offset}px)` }}
      >
        {lyrics.map((line, i) => (
          <LyricLineRow
            key={i}
            index={i}
            text={line.text}
            active={line.time === activeTime}
          />
        ))}
      </div>
    </div>
  )
}

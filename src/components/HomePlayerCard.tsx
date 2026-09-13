// src/components/HomePlayerCard.tsx
// 大卡片播放器：旋转唱片 + 歌名 + 樱花进度条 + 控制按钮（PlayerControls）
import { useMusicStore, playlist } from "../stores/music"
import { PlayerControls } from "./PlayerControls"

// 动态引入 music 目录的封面（key = 文件名）
const covers = import.meta.glob("../assets/music/*.jpg", { eager: true })

function getCover(cover?: string) {
  if (!cover) return undefined
  const key = Object.keys(covers).find((k) => k.endsWith(`/${cover}`))
  return key ? (covers[key] as { default: string }).default : undefined
}

// 格式化时间 mm:ss
function formatTime(sec: number) {
  if (!isFinite(sec) || sec < 0) return "0:00"
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, "0")}`
}

export const HomePlayerCard = () => {
  const store = useMusicStore()
  const currentSong = playlist[store.currentIndex]
  const cover = getCover(currentSong?.cover)
  const progress = store.duration > 0 ? (store.currentTime / store.duration) * 100 : 0

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    store.seek((Number(e.target.value) / 100) * store.duration)
  }

  return (
    <div className="relative z-50 rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-6 flex items-center gap-6 w-full">
      {/* 唱片封面（播放时旋转） */}
      <div className="relative shrink-0">
        <div
          className={`w-32 h-32 rounded-full overflow-hidden border-4 border-white/20 shadow-xl ${
            store.playing ? "animate-spin" : ""
          }`}
          style={{ animationDuration: "8s", animationTimingFunction: "linear" }}
        >
          <img src={cover} alt={currentSong?.name} className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-white/30 border-2 border-white/50" />
      </div>

      {/* 控制区 */}
      <div className="flex-1">
        {/* 歌名 + 歌手 */}
        <h3 className="text-lg font-semibold text-(--text-main) truncate">{currentSong?.name || "未选择"}</h3>
        <p className="text-xs text-(--text-muted)">{currentSong?.artist || ""}</p>

        {/* 樱花进度条 */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xs text-(--text-muted) w-10 text-right">{formatTime(store.currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="sakura-range flex-1 cursor-pointer"
            style={{ background: `linear-gradient(to right, #f9a8d4, #ec4899 ${progress}%, rgba(255,255,255,0.15) ${progress}%)` }}
          />
          <span className="text-xs text-(--text-muted) w-10">{formatTime(store.duration)}</span>
        </div>

        {/* 控制按钮（共用组件：上一首/播放/下一首/音量弹层） */}
        <div className="mt-4 flex justify-center">
          <PlayerControls />
        </div>
      </div>
    </div>
  )
}

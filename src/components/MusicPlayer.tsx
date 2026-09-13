// src/components/MusicPlayer.tsx
// 右上角小播放器：歌曲图标 + 歌名 + 控制按钮（PlayerControls）
import { useMusicStore, playlist } from "../stores/music"
import { PlayerControls } from "./PlayerControls"

export const MusicPlayer = () => {
  const currentSong = useMusicStore((s) => playlist[s.currentIndex] ?? null)
  const playing = useMusicStore((s) => s.playing)
  const next = useMusicStore((s) => s.next)

  return (
    <div className="fixed top-25 right-5 z-10010 flex items-center gap-3 px-4 py-2.5 rounded-xl bg-(--card-bg) backdrop-blur-lg border border-(--card-border) shadow-lg select-none">
      {/* 歌曲图标 */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={playing ? "text-[#ea5cb6]" : "text-(--text-muted)"}
      >
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>

      {/* 歌名（点击切歌） */}
      <span
        className="text-xs text-(--text-muted) truncate max-w-30 cursor-pointer hover:text-(--text-sub) transition-colors"
        title={currentSong?.name || "未选择"}
        onClick={next}
      >
        {currentSong?.name || "未选择"}
      </span>

      {/* 控制按钮（共用组件） */}
      <PlayerControls size="sm" />
    </div>
  )
}

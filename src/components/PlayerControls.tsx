// src/components/PlayerControls.tsx
// 播放器共用控制按钮组：上一首/播放暂停/下一首 + 音量弹层
import { useState } from "react"
import { useMusicStore } from "../stores/music"

// 音量图标（静音/低/高，跟随音量和静音状态）
function VolumeIcon() {
  const volume = useMusicStore((s) => s.volume)
  const muted = useMusicStore((s) => s.muted)
  const high = !(volume === 0 || muted) && volume >= 0.5
  const low = !(volume === 0 || muted) && volume < 0.5
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      {/* 静音：两条叉线 */}
      {(volume === 0 || muted) && (
        <>
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </>
      )}
      {/* 低音量：一条弧线 */}
      {low && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
      {/* 高音量：两条弧线 */}
      {high && <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />}
    </svg>
  )
}

// 播放/暂停图标
function PlayPauseIcon({ size = 22 }: { size?: number }) {
  const playing = useMusicStore((s) => s.playing)
  return playing ? (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />   {/* 暂停：两竖条 */}
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />   {/* 播放：三角 */}
    </svg>
  )
}

interface PlayerControlsProps {
  size?: "sm" | "lg"   // sm：小播放器；lg：大卡片（默认）
}

export const PlayerControls = ({ size = "lg" }: PlayerControlsProps) => {
  const store = useMusicStore()
  const [volOpen, setVolOpen] = useState(false)

  const btnCls =
    size === "sm"
      ? "w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer flex items-center justify-center text-(--text-muted) hover:text-(--text-main) transition-colors"
      : "w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer flex items-center justify-center text-(--text-muted) hover:text-(--text-main) transition-colors"

  return (
    <div className={`flex items-center ${size === "sm" ? "gap-1.5" : "gap-4"}`}>
      {/* 上一首 */}
      <button onClick={store.prev} className={btnCls} title="上一首">
        <svg xmlns="http://www.w3.org/2000/svg" width={size === "sm" ? 14 : 18} height={size === "sm" ? 14 : 18} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
        </svg>
      </button>

      {/* 播放/暂停 */}
      <button
        onClick={store.togglePlay}
        className={
          size === "sm"
            ? "w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer flex items-center justify-center text-(--text-sub) hover:text-(--text-main) transition-colors"
            : "w-14 h-14 rounded-full bg-[linear-gradient(135deg,#ea5cb6,#d83e93)] border-none cursor-pointer flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
        }
        title={store.playing ? "暂停" : "播放"}
      >
        <PlayPauseIcon size={size === "sm" ? 16 : 22} />
      </button>

      {/* 下一首 */}
      <button onClick={store.next} className={btnCls} title="下一首">
        <svg xmlns="http://www.w3.org/2000/svg" width={size === "sm" ? 14 : 18} height={size === "sm" ? 14 : 18} viewBox="0 0 24 24" fill="currentColor">
          <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
        </svg>
      </button>

      {/* 音量（大版：点击弹层；小版：直接水平条） */}
      {size === "lg" ? (
        <div className="relative">
          <button
            onClick={() => setVolOpen(!volOpen)}
            className={btnCls}
            title={store.muted ? "取消静音" : "音量"}
          >
            <VolumeIcon />
          </button>

          {/* 音量弹层（向下竖直弹出） */}
          <div
            className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 origin-top transition-all duration-200 z-[9999] ${
              volOpen ? "opacity-100 scale-100" : "opacity-0 scale-90 pointer-events-none"
            }`}
          >
            <div className="bg-(--card-bg) backdrop-blur-lg border border-(--card-border) rounded-xl p-4 shadow-lg flex flex-col items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(store.volume * 100)}
                onChange={(e) => store.setVolume(Number(e.target.value) / 100)}
                className="sakura-range-vertical"
                title="音量"
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button
            onClick={store.toggleMute}
            className="bg-transparent border-none p-0 cursor-pointer text-(--text-muted) hover:text-(--text-main) transition-colors shrink-0 flex items-center justify-center"
            title={store.muted ? "取消静音" : "静音"}
          >
            <VolumeIcon />
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={Math.round(store.volume * 100)}
            onChange={(e) => store.setVolume(Number(e.target.value) / 100)}
            className="sakura-range w-16 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: `linear-gradient(to right, #f9a8d4, #ec4899 ${store.volume * 100}%, rgba(255,255,255,0.15) ${store.volume * 100}%)` }}
            title="音量"
          />
        </div>
      )}
    </div>
  )
}

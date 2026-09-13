// src/components/BackgroundCarousel.tsx
// 背景图轮换：三张图每 15 秒淡入淡出切换（预加载保证过渡平滑）
import { useEffect, useState } from "react"
import bg1 from "../assets/background/bg.webp"
import bg2 from "../assets/background/pg-1.webp"
import bg3 from "../assets/background/pg-2.webp"

const IMAGES = [bg1, bg2, bg3]
const INTERVAL = 15000   // 每张 15 秒
const FADE = 4000        // 淡入淡出 4 秒

export const BackgroundCarousel = () => {
  const [current, setCurrent] = useState(0)
  const [loaded, setLoaded] = useState(false)

  // 预加载所有背景图（大图不预载的话切换时会闪空白，opacity 过渡失效）
  useEffect(() => {
    let cancelled = false
    const promises = IMAGES.map(
      (src) =>
        new Promise<void>((resolve) => {
          const img = new Image()
          img.onload = () => resolve()
          img.onerror = () => resolve()   // 失败也算（不卡轮换）
          img.src = src
        }),
    )
    Promise.all(promises).then(() => {
      if (!cancelled) setLoaded(true)
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!loaded) return   // 图全部加载完才开始轮换
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % IMAGES.length)
    }, INTERVAL)
    return () => clearInterval(timer)
  }, [loaded])

  return (
    <div className="fixed inset-0" aria-hidden="true">
      {/* 三张图全叠放，只有当前显示（opacity 过渡淡入淡出） */}
      {IMAGES.map((src, i) => (
        <img
          key={src}
          src={src}
          alt=""
          className="absolute inset-0 w-full h-full object-cover transition-opacity ease-in-out"
          style={{
            opacity: loaded && i === current ? 1 : 0,
            transitionDuration: `${FADE}ms`,
          }}
        />
      ))}
    </div>
  )
}

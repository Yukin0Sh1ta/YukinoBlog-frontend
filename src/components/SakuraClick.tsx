// src/components/SakuraClick.tsx
import { useEffect, useState } from "react"

interface Petal {
  id: number
  x: number       // 点击 X 坐标
  y: number       // 点击 Y 坐标
  dx: number      // 水平飞散方向（随机）
  rotate: number  // 旋转角度（随机）
  size: number    // 花瓣大小（随机）
  duration: number // 动画时长（随机）
}

let petalId = 0   // 全局递增 id（保证 key 唯一）

export const SakuraClick = () => {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    // 监听全局点击
    function onClick(e: MouseEvent) {
      // 忽略按钮/链接上的点击（避免和业务交互冲突太多）——可选，先保留所有点击
      const newPetals: Petal[] = Array.from({ length: 6 }, () => ({
        id: ++petalId,
        x: e.clientX,
        y: e.clientY,
        dx: (Math.random() - 0.5) * 160,        // 水平随机 -80 ~ +80
        rotate: Math.random() * 720 - 360,      // 旋转 -360° ~ +360°
        size: 12 + Math.random() * 10,          // 12-22px
        duration: 800 + Math.random() * 500,    // 0.8-1.3 秒
      }))

      setPetals((prev) => [...prev, ...newPetals])

      // 动画结束后移除这批花瓣（防 DOM 无限增长 = 你学的内存泄漏）
      const ids = new Set(newPetals.map((p) => p.id))
      setTimeout(() => {
        setPetals((prev) => prev.filter((p) => !ids.has(p.id)))
      }, 1400)
    }

    document.addEventListener("click", onClick)
    return () => document.removeEventListener("click", onClick)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998]" aria-hidden="true">
      {petals.map((p) => (
        <span
          key={p.id}
          className="sakura-petal"
          style={
            {
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              fontSize: p.size,
              animationDuration: `${p.duration}ms`,
              "--dx": `${p.dx}px`,
              "--rotate": `${p.rotate}deg`,
            } as React.CSSProperties
          }
        >
          🌸
        </span>
      ))}
    </div>
  )
}

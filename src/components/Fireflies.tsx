// src/components/Fireflies.tsx
// 萤火虫：黄绿光点随机游走 + 呼吸闪烁（纯 CSS 动画，装饰层）

// 预生成萤火虫数据（固定随机值，避免重渲染闪烁）
const FIREFLIES = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,           // 初始水平位置（%）
  top: 20 + Math.random() * 70,        // 初始垂直位置（避开顶部导航，20%-90%）
  size: 5 + Math.random() * 6,         // 大小 5-11px
  durationX: 15 + Math.random() * 15,  // 水平游走周期（15-30s）
  durationY: 10 + Math.random() * 10,  // 垂直游走周期（10-20s）
  durationGlow: 2 + Math.random() * 3, // 闪烁周期（2-5s）
  delay: -Math.random() * 10,          // 负延迟：进场时动画已进行中（错相，不停原地）
  driftX: (Math.random() - 0.5) * 40,  // 水平游走幅度（vw 的 %）
  driftY: (Math.random() - 0.5) * 30,  // 垂直游走幅度
}))

export const Fireflies = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[6] overflow-hidden" aria-hidden="true">
      {FIREFLIES.map((f) => (
        <span
          key={f.id}
          className="firefly"
          style={
            {
              left: `${f.left}%`,
              top: `${f.top}%`,
              width: f.size,
              height: f.size,
              "--dx": `${f.driftX}vw`,
              "--dy": `${f.driftY}vh`,
              "--dur-x": `${f.durationX}s`,
              "--dur-y": `${f.durationY}s`,
              "--dur-glow": `${f.durationGlow}s`,
              animationDelay: `${f.delay}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  )
}

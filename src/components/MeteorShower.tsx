// src/components/MeteorShower.tsx
// 流星背景：纯 CSS 动画，不断坠落的流星（装饰层，不挡操作）

// 预生成流星数据（固定随机值，避免每次渲染重新随机导致闪烁）
const METEORS = Array.from({ length: 8 }, (_, i) => ({
  id: i,
  left: Math.random() * 100,          // 起始水平位置（%）
  delay: Math.random() * 8,           // 动画延迟（秒，错开）
  duration: 2 + Math.random() * 2,    // 动画时长（2-4 秒）
  height: 60 + Math.random() * 60,    // 流星尾巴长度（px）
}))

export const MeteorShower = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[5] overflow-hidden" aria-hidden="true">
      {METEORS.map((m) => (
        <span
          key={m.id}
          className="meteor"
          style={{
            left: `${m.left}%`,
            animationDelay: `${m.delay}s`,
            animationDuration: `${m.duration}s`,
            '--meteor-height': `${m.height}px`,
          } as React.CSSProperties}
        />
      ))}
    </div>
  )
}

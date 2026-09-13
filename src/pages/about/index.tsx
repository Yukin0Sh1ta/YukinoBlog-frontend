// src/pages/about/index.tsx
import { Avatar } from "../../components/Avatar"
import { TechIcon } from "../../components/TechIcon"

const aboutText = `你好，我是 Yukino，一名前端开发者。
热爱用代码把想法变成产品，喜欢探索新技术，
也在不断打磨自己的基本功。
这个博客仅用于记录学习与生活。`

// 技术栈（图标文件名 + 名称 + 品牌色；"theme" = 跟随主题文字色，用于黑色品牌 Express/Kafka）
const techRow1 = [
  { file: "html5", name: "HTML", color: "#E34F26" },
  { file: "css", name: "CSS", color: "#1572B6" },
  { file: "javascript", name: "JavaScript", color: "#F7DF1E" },
  { file: "typescript", name: "TypeScript", color: "#3178C6" },
  { file: "vite", name: "Vite", color: "#646CFF" },
  { file: "tailwindcss", name: "TailwindCSS", color: "#06B6D4" },
  { file: "axios", name: "Axios", color: "#5A29E4" },
  { file: "vuedotjs", name: "Vue3", color: "#42B883" },
  { file: "nuxt", name: "Nuxt", color: "#00DC82" },
  { file: "react", name: "React", color: "#61DAFB" },
]
const techRow2 = [
  { file: "nodedotjs", name: "NodeJS", color: "#5FA04E" },
  { file: "express", name: "ExpressJS", color: "theme" },
  { file: "nestjs", name: "NestJS", color: "#E0234E" },
  { file: "mysql", name: "MySQL", color: "#4479A1" },
  { file: "postgresql", name: "PostgreSQL", color: "#4169E1" },
  { file: "redis", name: "Redis", color: "#FF4438" },
  { file: "apachekafka", name: "Kafka", color: "theme" },
  { file: "git", name: "Git", color: "#F05032" },
  { file: "docker", name: "Docker", color: "#2496ED" },
]

export const About = () => {
  // 跑马灯行：图标（品牌色）+ 名称
  const renderRow = (items: typeof techRow1, direction: "left" | "right") => (
    <div className="marquee-mask overflow-hidden w-full">
      <div className={`marquee-track ${direction === "left" ? "marquee-left" : "marquee-right"}`}>
        {/* 两个等宽 dup 块 → -50% 精确一份，无缝循环 */}
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0">
            {items.map((item, i) => {
              return (
                <span
                  key={`${dup}-${i}`}
                  className="shrink-0 mx-2 px-3 py-1.5 rounded-full border border-(--card-border) bg-white/10 flex items-center gap-1.5 whitespace-nowrap"
                >
                  <TechIcon file={item.file} color={item.color} />
                  <span className="text-xs text-(--text-sub)">{item.name}</span>
                </span>
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div
      className="mx-auto px-4 w-full max-w-5xl"
      style={{ marginTop: "20vh" }}
    >
      {/* 标题：关于本站关于我 */}
      <h1 className="text-center text-8xl font-bold text-(--text-main)">
        关于本站关于我
      </h1>

      {/* 短分割线 */}
      <div className="mx-auto  mt-5 w-50 h-0.5 bg-[linear-gradient(90deg,#ea5cb6,#d83e93)] rounded-full" />

      {/* 上方：头像 + 个人信息（大屏并排，小屏竖排） */}
      <div className="mt-6 flex flex-col md:flex-row gap-5 md:items-stretch">
        {/* 左：头像 */}
        <div className="w-full md:flex-1 min-w-0 rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-5 flex items-center justify-center">
          <Avatar />
        </div>

        {/* 右：个人信息 */}
        <div className="w-full md:flex-1 min-w-0 rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-5">
          <h2 className="text-base font-semibold text-(--text-main) mb-2">个人信息</h2>
          <p className="text-sm leading-relaxed text-(--text-sub) whitespace-pre-line">
            {aboutText}
          </p>
        </div>
      </div>

      {/* 下方：技术栈（整行跑马灯） */}
      <div className="mt-5 rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg px-4 py-4 overflow-hidden">
        <h2 className="text-base font-semibold text-(--text-main) mb-3">技术栈</h2>
        <div className="space-y-3">
          {/* 第一行：向左滚动 */}
          {renderRow(techRow1, "left")}
          {/* 第二行：向右滚动 */}
          {renderRow(techRow2, "right")}
        </div>
      </div>
    </div>
  )
}

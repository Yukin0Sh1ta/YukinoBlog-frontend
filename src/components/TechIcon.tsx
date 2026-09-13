// src/components/TechIcon.tsx
// 技术栈图标：SVG 字符串渲染 + 品牌色/主题色
// color 是十六进制色值 → 品牌色；"theme" → 跟随主题文字色（夜白日黑，用于黑色品牌如图标本身是黑色的 Express/Kafka）

import { useMemo } from "react"

// 批量引入技术图标（?raw 拿原始 SVG 文本）
const techSvgs = import.meta.glob("../assets/tech/*.svg", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>

// 取 SVG 原始内容
function getSvg(file: string): string {
  const key = Object.keys(techSvgs).find((k) => k.includes(`/${file}.svg`))
  return key ? techSvgs[key] : ""
}

interface TechIconProps {
  file: string          // SVG 文件名（如 "react"）
  color?: string       // 品牌色（如 "#61DAFB"）或 "theme"（主题文字色）
}

export const TechIcon = ({ file, color = "theme" }: TechIconProps) => {
  const svg = useMemo(() => getSvg(file), [file])

  return (
    <span
      className="tech-icon inline-flex items-center justify-center"
      style={color === "theme" ? { color: "var(--text-main)" } : { color }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

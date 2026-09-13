// src/utils/parseLrc.ts
import type { LyricLine } from "../types/lyric";

export type { LyricLine };

// 解析 LRC 格式："[00:21.470]歌词内容" → { time: 21.47, text: "歌词内容" }
export function parseLrc(lrc: string): LyricLine[] {
  const lines: LyricLine[] = []
  const regex = /\[(\d{2}):(\d{2})\.(\d{3})\](.*)/g
  let match

  while ((match = regex.exec(lrc)) !== null) {
    const minutes = parseInt(match[1], 10)
    const seconds = parseInt(match[2], 10)
    const millis = parseInt(match[3], 10)
    const time = minutes * 60 + seconds + millis / 1000
    const text = match[4].trim()

    if (text) lines.push({ time, text })   // 跳过空行（纯时间戳）
  }

  return lines
}

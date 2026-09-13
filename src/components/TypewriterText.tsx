
import { useEffect, useState } from "react"
import { Sayings } from "../constants/Sayings"

const TYPE_SPEED = 120       // 打字速度（ms/字）
const DELETE_SPEED = 80      // 回退速度（ms/字）
const HOLD_TIME = 3000       // 显示完停留时间（ms）

export const TypewriterText = () => {
  const [sayingIndex, setSayingIndex] = useState(0)
  const [text, setText] = useState("")
  const [phase, setPhase] = useState<"typing" | "holding" | "deleting">("typing")

  useEffect(() => {
    const current = Sayings[sayingIndex]

    let timer: ReturnType<typeof setTimeout>

    if (phase === "typing") {
      // 逐字输入：下一个字
      if (text.length < current.length) {
        timer = setTimeout(() => setText(current.slice(0, text.length + 1)), TYPE_SPEED)
      } else {
        // 输完，停留
        timer = setTimeout(() => setPhase("deleting"), HOLD_TIME)
      }
    } else if (phase === "deleting") {
      // 逐字回退
      if (text.length > 0) {
        timer = setTimeout(() => setText(current.slice(0, text.length - 1)), DELETE_SPEED)
      } else {
        // 删完，换下一条
        setSayingIndex((sayingIndex + 1) % Sayings.length)
        setPhase("typing")
      }
    }

    return () => clearTimeout(timer)
  }, [phase, text, sayingIndex])

  return (
    <p className="text-sm text-[#9a9a9a] m-0 italic min-h-5">
      {text}
      {/* 光标闪烁 */}
      <span className="animate-pulse">|</span>
    </p>
  )
}

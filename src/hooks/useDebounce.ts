// src/hooks/useDebounce.ts
import { useState, useEffect } from "react"

/**
 * 防抖：value 变化后，延迟 delay 毫秒才更新返回值。
 * 期间 value 再次变化会重置定时器（前一个定时器被清理）。
 */
export function useDebounced<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)   // value 变/卸载时清掉上一个定时器
  }, [value, delay])

  return debounced
}

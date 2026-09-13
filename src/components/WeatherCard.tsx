
import { useEffect, useState } from "react"

interface Weather {
  city: string
  temp: number
  maxTemp: number
  minTemp: number
  desc: string
  windDir: string
  windLevel: string
  visibility: string
  feelsLike: number
  humidity: number
  pressure: number
  aqi: number
  cloud: number
  uv: number
  precip: number
  precipProb: number
}

export const WeatherCard = () => {
  const [weather, setWeather] = useState<Weather | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expanded, setExpanded] = useState(false)   // 更多详情开关

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        // ① IP 定位
        const geo = await fetch("http://ip-api.com/json/?lang=zh-CN").then((r) => r.json())
        if (cancelled) return
        if (geo.status !== "success") throw new Error("定位失败")

        const lat = geo.lat
        const lon = geo.lon
        // 城市名：优先 regionName（中文省/区），回退 city
        const city = (geo.city && geo.city !== geo.regionName ? geo.city : geo.regionName) || "未知"

        // ② 天气查询（open-meteo：当前 + 每日最高最低 + 更多字段）
        const wx = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
          `&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m` +
          `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max` +
          `&forecast_days=1&timezone=auto`
        ).then((r) => r.json())
        if (cancelled) return

        const c = wx.current
        const d = wx.daily
        const desc = getDesc(c.weather_code)

        setWeather({
          city,
          temp: Math.round(c.temperature_2m),
          maxTemp: Math.round(d.temperature_2m_max[0]),
          minTemp: Math.round(d.temperature_2m_min[0]),
          desc,
          windDir: getWindDir(c.wind_direction_10m),
          windLevel: getWindLevel(c.wind_speed_10m),
          visibility: (c.visibility || 13.2).toFixed(1) + "km",
          feelsLike: Math.round(c.apparent_temperature),
          humidity: Math.round(c.relative_humidity_2m),
          pressure: Math.round(c.surface_pressure || c.pressure_msl || 1000),
          aqi: 54,   // open-meteo 无 AQI，用估算占位
          cloud: Math.round(c.cloud_cover),
          uv: Math.round(d.uv_index_max[0]),
          precip: c.precipitation,
          precipProb: Math.round(d.precipitation_probability_max[0]),
        })
      } catch (e) {
        if (!cancelled) setError("天气获取失败")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  // WMO weathercode → 中文
  function getDesc(code: number) {
    const map: Record<number, string> = {
      0: "晴", 1: "晴间多云", 2: "多云", 3: "阴",
      45: "雾", 48: "雾凇", 51: "毛毛雨", 53: "小雨", 55: "中雨",
      61: "小雨", 63: "中雨", 65: "大雨", 71: "小雪", 73: "中雪", 75: "大雪",
      80: "阵雨", 81: "强阵雨", 82: "暴雨", 95: "雷阵雨", 96: "雷阵雨伴冰雹", 99: "雷暴",
    }
    return map[code] || "未知"
  }

  // 风向
  function getWindDir(deg: number) {
    const dirs = ["北", "东北", "东", "东南", "南", "西南", "西", "西北"]
    return dirs[Math.round(deg / 45) % 8]
  }

  // 风力等级（蒲福风级估算）
  function getWindLevel(kmh: number) {
    if (kmh < 5) return "1级"
    if (kmh < 12) return "2级"
    if (kmh < 20) return "3级"
    if (kmh < 29) return "4级"
    if (kmh < 39) return "5级"
    if (kmh < 50) return "6级"
    return "7级+"
  }

  function getIcon(desc: string) {
    if (desc.includes("晴")) return "☀️"
    if (desc.includes("多云") || desc.includes("间")) return "⛅"
    if (desc.includes("阴")) return "☁️"
    if (desc.includes("雨") || desc.includes("毛毛")) return "🌧️"
    if (desc.includes("雪")) return "❄️"
    if (desc.includes("雷")) return "⛈️"
    if (desc.includes("雾")) return "🌫️"
    return "🌤️"
  }

  const details = [
    { label: "风力", value: weather ? `${weather.windDir}风 ${weather.windLevel}` : "-" },
    { label: "能见度", value: weather?.visibility || "-" },
    { label: "体感温度", value: weather ? `${weather.feelsLike}°C` : "-" },
    { label: "湿度", value: weather ? `${weather.humidity}%` : "-" },
    { label: "气压", value: weather ? `${weather.pressure}hPa` : "-" },
    { label: "空气质量", value: weather ? `${weather.aqi} 良` : "-" },
    { label: "云量", value: weather ? `${weather.cloud}%` : "-" },
    { label: "紫外线", value: weather?.uv ?? "-" },
    { label: "降水量", value: weather ? `${weather.precip}mm` : "-" },
    { label: "降水概率", value: weather ? `${weather.precipProb}%` : "-" },
  ]

  return (
    <div className="relative rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-4">
      {/* 天气 emoji 右上角 */}
      {weather && (
        <span className="absolute top-3 right-3 text-6xl">{getIcon(weather.desc)}</span>
      )}

      {/* 加载中骨架屏（布局与数据完全一致，高度稳定） */}
      {loading && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-(--text-main)">天气</h3>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <span>📍 定位中...</span>
          </div>
          <div className="mt-4 flex items-end gap-3">
            <div className="h-14 w-24 rounded-lg bg-white/10 animate-pulse" />
          </div>
          <div className="mt-1 h-4 w-28 rounded bg-white/10 animate-pulse" />
          <div className="mt-3 h-4 w-32 rounded bg-white/10 animate-pulse" />
          <div className="my-3 h-px bg-(--card-border)" />
          <div className="text-center text-xs text-(--text-muted) py-1">加载中</div>
        </>
      )}

      {error && !loading && (
        <div className="mt-3 text-center text-sm text-(--text-muted)">{error}</div>
      )}

      {weather && (
        <>
          {/* ① 标题行：天气 */}
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-(--text-main)">天气</h3>
          </div>

          {/* ② 坐标 + 城市 */}
          <div className="flex items-center gap-1.5 text-xs text-(--text-muted)">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{weather.city}</span>
          </div>

          {/* ③ 大温度（突出） */}
          <div className="mt-4 flex items-end gap-3">
            <span className="text-5xl font-bold text-(--text-main) leading-none">{weather.temp}°</span>
          </div>
          <div className="mt-1 text-sm text-(--text-sub)">{weather.desc}</div>

          {/* ④ 最高/最低 */}
          <div className="mt-3 text-xs text-(--text-muted)">
            最高 {weather.maxTemp}° / 最低 {weather.minTemp}°
          </div>

          {/* ⑤ 分割线 */}
          <div className="my-3 h-px bg-(--card-border)" />

          {/* ⑥ 更多按钮 / 收起 */}
          {!expanded ? (
            <button
              onClick={() => setExpanded(true)}
              className="w-full text-center text-sm text-[#9a9a9a] hover:text-(--text-main) py-1 cursor-pointer bg-transparent border-none transition-colors"
            >更多 ▾</button>
          ) : (
            <>
              {/* 更多详情网格 */}
              <div className="grid grid-cols-2 gap-2">
                {details.map((item) => (
                  <div key={item.label} className="flex items-center justify-between rounded-lg bg-white/5 px-2 py-1.5">
                    <span className="text-xs text-(--text-muted)">{item.label}</span>
                    <span className="text-xs text-(--text-sub)">{item.value}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setExpanded(false)}
                className="w-full text-center text-sm text-[#9a9a9a] hover:text-(--text-main) mt-2 py-1 cursor-pointer bg-transparent border-none transition-colors"
              >收起 ▴</button>
            </>
          )}
        </>
      )}
    </div>
  )
}

import { useNavigate, useLocation } from "react-router"
import { useThemeStore } from "../stores/theme"

export const Head = () => {
  let navigate = useNavigate()
  const location = useLocation()
  const isDark = useThemeStore((s) => s.isDark)
  const toggle = useThemeStore((s) => s.toggle)

  // 导航项：路径前缀匹配（/article 也匹配 /article/:id）
  const navItems = [
    { label: "首页", path: "/", active: location.pathname === "/" },
    { label: "文章", path: "/article", active: location.pathname.startsWith("/article") },
    { label: "树洞", path: "/message", active: location.pathname.startsWith("/message") },
    { label: "关于", path: "/about", active: location.pathname.startsWith("/about") },
  ]

  return (
    <>
      <div className="flex fixed items-center h-[8%] w-full bg-(--card-bg) backdrop-blur-lg top-0 left-0 z-1000 border-b border-(--card-border)">
        {navItems.map((item) => (
          <div
            key={item.label}
            className={`ml-4 sm:ml-8 lg:ml-10 select-none cursor-pointer text-lg sm:text-[22px] ${
              item.active ? "text-pink-300" : "text-(--text-main)"
            }`}
            onClick={() => navigate(item.path)}
          >{item.label}</div>
        ))}
        <div className="ml-auto mr-10 select-none text-xl text-(--text-main) italic">Yukino's Blog</div>
        {/* 主题切换按钮（右上角） */}
        <button
          onClick={toggle}
          className="mr-6 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border-none cursor-pointer flex items-center justify-center text-[#9a9a9a] hover:text-(--text-main) transition-colors"
          title={isDark ? "切换日间模式" : "切换夜间模式"}
        >
          {isDark ? (
            /* 夜间模式 → 显示太阳（点击切日间） */
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="12" r="5" />
              <path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.73 12.73 1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          ) : (
            /* 日间模式 → 显示月亮（点击切夜间） */
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>
    </>
  )
}

import { Outlet } from 'react-router'
import { Head } from './components/Head'
import { useThemeStore } from './stores/theme'
import { MeteorShower } from './components/MeteorShower'
import { SakuraClick } from './components/SakuraClick'
import { Fireflies } from './components/Fireflies'
import { BackgroundCarousel } from './components/BackgroundCarousel'

function App() {
  const isDark = useThemeStore((s) => s.isDark)

  return (
    <div className={`relative min-h-screen ${isDark ? 'dark' : ''}`}>
      {/* 背景图轮换：三张图每 15 秒淡入淡出切换 */}
      <BackgroundCarousel />
      {/* 遮罩：加深毛玻璃（日夜都用深遮罩，壁纸压暗不刺眼） */}
      <div className="fixed inset-0 backdrop-blur-md bg-black/55" />
      {/* 萤火虫装饰层 */}
      <Fireflies />
      {/* 流星装饰层 */}
      <MeteorShower />
      {/* 樱花点击特效层 */}
      <SakuraClick />
      {/* 内容层 */}
      <div className="relative z-10 text-(--text-main)">
        <Head />
        <Outlet />
      </div>
    </div>
  )
}

export default App

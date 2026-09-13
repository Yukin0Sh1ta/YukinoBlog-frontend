
import { Avatar } from '../../components/Avatar'
import { LyricsCard } from '../../components/LyricsCard'
import { HomePlayerCard } from '../../components/HomePlayerCard'
import { BeijingTime } from '../../components/BeijingTime'
import { SiteStats } from '../../components/SiteStats'
import { useMusicStore } from "../../stores/music"

export const Home = () => {
  const currentTime = useMusicStore((s) => s.currentTime)

  return (
    <div
      className="mx-auto flex flex-col gap-6 px-4 w-full max-w-5xl"
      style={{ marginTop: "15vh" }}   // 大屏 3/5 效果由 max-w-5xl 逼近，小屏自动 100%
    >
      {/* 头像 + 播放器（大屏并排等高，小屏竖排） */}
      <div className="flex flex-col lg:flex-row gap-6 lg:items-stretch">
        <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-5 w-full lg:w-80 shrink-0 flex flex-col justify-center">
          <Avatar />
        </div>
        <div className="w-full lg:flex-1 flex">
          <HomePlayerCard />
        </div>
      </div>

      {/* 歌词在下方（和上面等宽：60% - 0，外层已定 60%） */}
      <LyricsCard currentTime={currentTime} />

      {/* 北京时间（歌词和站点数据之间） */}
      <BeijingTime />

      {/* 站点数据（最下方） */}
      <SiteStats />
    </div>
  )
}

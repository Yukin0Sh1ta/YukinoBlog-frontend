// src/pages/article/ArticleDetail.tsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { Avatar } from '../../components/Avatar'
import { CalendarCard } from '../../components/CalendarCard'
import { WeatherCard } from '../../components/WeatherCard'
import { HomePlayerCard } from '../../components/HomePlayerCard'
import { API_BASE } from '../../config/api'

interface ArticleData {
  id: number;
  title: string;
  cover: string;
  description: string;
  content: string | null;
  ghLogin: string;
  createdAt: string;
}

export const ArticleDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState<ArticleData | null>(null)
  const [loading, setLoading] = useState(true)

  // 从后端拿单篇文章
  useEffect(() => {
    fetch(`${API_BASE}/api/articles/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((data) => {
        setArticle(data)
        setLoading(false)
      })
      .catch(() => {
        setArticle(null)
        setLoading(false)
      })
  }, [id])

  if (loading) {
    return <p className="text-(--text-main) text-center mt-40">加载中...</p>
  }

  if (!article) {
    return <p className="text-(--text-main) text-center mt-40">文章不存在</p>
  }

  return (
    <div className="mx-auto flex flex-col lg:flex-row gap-6 px-4 w-full max-w-6xl" style={{ marginTop: "20vh" }}>
      {/* 左侧大卡片：文章内容（大屏占 70%，小屏全宽） */}
      <div className="rounded-2xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg overflow-hidden lg:mr-4 w-full lg:w-[70%] lg:flex-none">
        <img src={article.cover} alt={article.title} className="w-full h-auto" />
        <div className="p-6">
          <button onClick={() => navigate('/article')} className="text-sm text-(--text-muted) hover:text-(--text-main) mb-4">← 返回</button>
          <h1 className="text-2xl font-bold text-(--text-main)">{article.title}</h1>
          <div className="mt-4 flex gap-4 text-sm text-(--text-muted)">
            <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
            <span>作者 {article.ghLogin}</span>
          </div>
          {/* 正文渲染（纯文本，保留换行） */}
          <div className="mt-6">
            <p className="leading-relaxed text-(--text-sub) whitespace-pre-line">
              {article.content || article.description}
            </p>
          </div>
        </div>
      </div>

      {/* 右侧竖排小卡片（小屏移到文章下方） */}
      <div className="w-full lg:flex-1 flex flex-col gap-6">
        <div className="rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg p-5">
          <Avatar />
        </div>
        <HomePlayerCard />
        <WeatherCard />
        <CalendarCard />
      </div>
    </div>
  )
}

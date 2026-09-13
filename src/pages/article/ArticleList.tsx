import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDebounced } from "../../hooks/useDebounce";
import { MusicPlayer } from '../../components/MusicPlayer';
import { useUserStore } from "../../stores/user";
import { API_BASE } from "../../config/api";

interface Article {
  id: number;
  title: string;
  cover: string;
  description: string;
  likes?: number;
  views?: number;
}

// 博主的 GitHub 用户名
const OWNER_LOGIN = "Yukin0Sh1ta";

export const ArticleList = () => {
  const navigate = useNavigate()
  const ghUser = useUserStore((s) => s.user)
  const isOwner = ghUser?.login === OWNER_LOGIN   // 是否博主

  const [articles, setArticles] = useState<Article[]>([])
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounced(search, 300)   // 防抖后的搜索词

  // 加载文章（从后端数据库）
  useEffect(() => {
    fetch(`${API_BASE}/api/articles`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setArticles(data) })
      .catch(() => {})
  }, [])

  // 搜索过滤（用防抖后的词）
  const keyword = debouncedSearch.trim().toLowerCase()
  const filtered = keyword
    ? articles.filter((a) =>
        a.title.toLowerCase().includes(keyword) ||
        a.description.toLowerCase().includes(keyword)
      )
    : articles

  // 响应式列数交给 CSS Grid（小屏 1 列 → 中 2 列 → 大 3 列），不再 JS 分列

  return (
    <>
      <MusicPlayer />
      {/* 搜索栏 + 博主"+"按钮 */}
      <div className="px-4" style={{ marginTop: "14rem", paddingBottom: "1rem" }}>
        <div className="w-full max-w-2xl mx-auto flex items-center gap-3 h-16 px-4 rounded-xl border border-(--card-border) bg-white/5 relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-(--text-muted) shrink-0"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="搜索文章..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-(--text-main) placeholder:text-(--text-muted)"
          />
          {/* 博主专属"+"按钮（跳转写文章页面，其他人看不见） */}
          {isOwner && (
            <button
              onClick={() => navigate("/article/new")}
              className="w-10 h-10 rounded-full bg-[linear-gradient(135deg,#ea5cb6,#d83e93)] border-none cursor-pointer flex items-center justify-center text-(--text-main) text-xl font-bold shadow-lg hover:scale-110 transition-transform shrink-0"
              title="写文章"
            >
              +
            </button>
          )}
        </div>
      </div>

      {/* 无搜索结果提示 */}
      {filtered.length === 0 && (
        <div className="text-center text-(--text-muted) mt-8">没有找到相关文章</div>
      )}

      {/* 瀑布流卡片：CSS Grid 响应式列（lg:3 列 / md:2 列 / 小屏 1 列） */}
      <div
        className="mx-auto px-4 w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        style={{ marginTop: "8vh" }}
      >
        {filtered.map((article) => (
          <div
            key={article.id}
            className="rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => navigate(`/article/${article.id}`)}
          >
            <img
              src={article.cover}
              alt={article.title}
              className="w-full h-auto"
            />
            <div className="p-4 text-center">
              <h2 className="text-base font-semibold text-(--text-main)">
                {article.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-(--text-muted)">
                {article.description}
              </p>
              <div className="mt-3 flex items-center justify-center gap-4">
                <span className="text-xs text-(--text-muted)">❤️ {article.likes ?? 0}</span>
                <span className="text-xs text-(--text-muted)">👁 {article.views ?? 0}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

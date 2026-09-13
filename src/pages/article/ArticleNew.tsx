// src/pages/article/ArticleNew.tsx
import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { useUserStore } from "../../stores/user"
import { useDebounced } from "../../hooks/useDebounce"
import { API_BASE } from "../../config/api"
import bg from "../../assets/background/bg.webp"


const TITLE_MIN = 5
const TITLE_MAX = 20

export const ArticleNew = () => {
  const navigate = useNavigate()
  const ghUser = useUserStore((s) => s.user)
  const token = useUserStore((s) => s.token)

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")        // 当前正在输入的标签
  const [tags, setTags] = useState<string[]>([])      // 已确定的标签块
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>(bg)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  // 非博主：跳回文章页
  useEffect(() => {
    if (ghUser && ghUser.login !== "Yukin0Sh1ta") navigate("/article")
  }, [ghUser, navigate])

  // 标题计数提示
  const titleLen = title.length
  let titleHint = ""
  if (titleLen < TITLE_MIN) {
    titleHint = `还需 ${TITLE_MIN - titleLen} 字`
  } else if (titleLen > TITLE_MAX) {
    titleHint = `${titleLen}/${TITLE_MAX} 已超限`
  }

  // 标签：防抖监听——1 秒没输入就把当前词转成 #小块
  const debouncedTagInput = useDebounced(tagInput, 1000)
  useEffect(() => {
    const word = debouncedTagInput.trim()
    if (word) {
      setTags((prev) => [...prev, word])
      setTagInput("")
    }
  }, [debouncedTagInput])

  // 输入空格也确认当前标签
  function onTagInput(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value
    if (val.endsWith(" ")) {
      const word = val.trim()
      if (word) {
        setTags((prev) => [...prev, word])
        setTagInput("")
      } else {
        setTagInput("")
      }
    } else {
      setTagInput(val)
    }
  }

  // 删除标签块（点击小块）
  function removeTag(i: number) {
    setTags((prev) => prev.filter((_, idx) => idx !== i))
  }

  // 选图预览
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  // 提交（FormData：文件 + 字段）
  async function handleSubmit() {
    if (titleLen < TITLE_MIN) {
      setError(`标题至少 ${TITLE_MIN} 个字`)
      return
    }
    if (titleLen > TITLE_MAX) {
      setError(`标题最多 ${TITLE_MAX} 个字`)
      return
    }
    if (!content.trim()) {
      setError("文章主体不能为空")
      return
    }
    setSubmitting(true)
    setError("")
    try {
      const formData = new FormData()
      formData.append("token", token || "")
      formData.append("title", title)
      formData.append("content", content)
      formData.append("tags", JSON.stringify(tags))
      if (file) formData.append("file", file)

      const res = await fetch(`${API_BASE}/api/articles`, {
        method: "POST",
        body: formData,
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "发布失败")
      }
      navigate("/article")
    } catch (e: any) {
      setError(e.message || "发布失败")
    } finally {
      setSubmitting(false)
    }
  }

  // 未登录保护
  if (!ghUser) {
    return (
      <div className="text-center text-(--text-muted) mt-40">
        <p>请先登录</p>
        <button
          onClick={() => navigate("/article")}
          className="mt-4 px-4 py-2 rounded-lg bg-white/10 text-(--text-main) text-sm cursor-pointer border border-(--card-border)"
        >返回文章</button>
      </div>
    )
  }

  return (
    <div
      className="mx-auto flex flex-col gap-5 px-4 w-full max-w-4xl"
      style={{ marginTop: "14vh" }}
    >
      {/* ===== 卡片 1：标题（无边框）+ 分割线 + 主体（无边框滚动） ===== */}
      <div className="rounded-lg border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg px-5 py-4">
        {/* 第一行：标题（无边框）+ 右侧计数 */}
        <div className="relative">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="填写标题"
            maxLength={TITLE_MAX + 10}
            className="w-full h-14 bg-transparent border-none outline-none text-2xl font-semibold text-(--text-main) placeholder:text-(--text-muted)"
          />
          {titleHint && (
            <span
              className={`absolute right-0 top-1/2 -translate-y-1/2 text-xs ${
                titleLen > TITLE_MAX ? "text-[#ff6b6b]" : "text-(--text-muted)"
              }`}
            >
              {titleHint}
            </span>
          )}
        </div>

        {/* 横向分割线 */}
        <div className="h-px bg-(--card-border)" />

        {/* 第二块：文章主体（无边框、固定高、内部滚动） */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="填写文章主体"
          className="w-full h-100 mt-2 bg-transparent border-none outline-none text-sm text-(--text-main) leading-relaxed resize-none overflow-y-auto placeholder:text-(--text-muted)"
        />
      </div>


      {/* ===== 卡片 2：标签块 + 封面（竖排）+ 发布 ===== */}
      <div className="rounded-lg border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg px-5 py-4">
        {/* 第一行：标签（已确定的 #小块 + 输入框） */}
        <div className="flex flex-wrap items-center gap-2 min-h-11">
          {/* 已确定的 #标签块 */}
          {tags.map((tag, i) => (
            <span
              key={i}
              onClick={() => removeTag(i)}
              className="px-2.5 py-1 rounded-md bg-[#ea5cb6]/20 border border-[#ea5cb6]/40 text-xs text-[#ea5cb6] cursor-pointer hover:opacity-70 transition-opacity"
              title="点击删除"
            >
              #{tag}
            </span>
          ))}
          {/* 标签输入（无边框） */}
          <input
            value={tagInput}
            onChange={onTagInput}
            placeholder={tags.length === 0 ? "添加文章标签（空格或停顿确认）" : ""}
            className="flex-1 min-w-32 h-9 bg-transparent border-none outline-none text-sm text-(--text-main) placeholder:text-(--text-muted)"
          />
        </div>

        <div className="h-px bg-(--card-border) my-2" />

        {/* 第二行：封面（预览 + 选择按钮，竖向排列） */}
        <div className="flex flex-col gap-2 mb-4">
          <img
            src={preview}
            alt="封面预览"
            className="w-48 h-28 rounded-md object-cover border border-(--card-border)"
          />
          <label className="text-xs text-(--text-muted) cursor-pointer hover:text-(--text-main) transition-colors w-fit">
            选择封面图（可选，默认站内背景）
            <input
              type="file"
              accept="image/*"
              onChange={onFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* 错误提示 */}
        {error && <p className="text-xs text-[#ff6b6b] mb-2">{error}</p>}

        {/* 第三行：发布按钮 */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full h-11 rounded-md border-none bg-[linear-gradient(90deg,#ea5cb6,#d83e93)] text-(--text-main) text-sm font-semibold cursor-pointer shadow-lg hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? "发布中..." : "发布"}
        </button>
      </div>
    </div>
  )
}

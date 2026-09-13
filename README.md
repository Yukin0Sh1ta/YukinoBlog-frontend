# YukinoBlog Frontend

基于 React 19 + TypeScript + Vite 的个人博客前端。

**仓库地址**：https://github.com/Yukin0Sh1ta/YukinoBlog-frontend
**后端仓库**：https://github.com/Yukin0Sh1ta/YukinoBlog-backend
**线上地址**：部署后补充

## 技术栈

- React 19 + TypeScript + Vite
- TailwindCSS v4（响应式布局：Grid 多列自适应降级 / flex-col 断点竖排）
- Zustand（主题 / 登录态持久化）
- React Router v7

## 功能模块

- 文章：列表（瀑布流响应式）、详情、发布（博主专属，multer 封面上传）
- 留言板：图形验证码防刷、GitHub 登录后可发言
- 音乐播放器：跨页面保持播放状态、歌词滚动、樱花进度条
- 个人主页：技术栈跑马灯、打字机名言
- 特效：背景图轮换、萤火虫、流星、樱花点击

## 快速开始

```bash
pnpm install
pnpm dev        # 开发（默认连接 http://localhost:3000 后端）
pnpm build      # 生产构建，产物在 dist/
```

## 环境变量

| 变量 | 说明 | 默认 |
|---|---|---|
| `VITE_API_URL` | 后端 API 地址 | `http://localhost:3000` |

开发环境读 `.env.development`；生产构建时注入，例如：

```bash
VITE_API_URL=https://api.example.com pnpm build
```

## 部署

前端构建产物为纯静态文件（`dist/`），由服务器 nginx 托管：

```
浏览器 → nginx:80 → 静态文件（dist/）
                  → /api、/uploads 反向代理 → NestJS(:3000)
```

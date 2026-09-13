import { createBrowserRouter } from 'react-router'
import { Home } from '../pages/home'
import { ArticleDetail } from '../pages/article/ArticleDetail'
import { ArticleList } from '../pages/article/ArticleList'
import { Message } from '../pages/message'
import { About } from '../pages/about'
import { GitHubCallback } from '../pages/auth/GitHubCallback'
import { ArticleNew } from '../pages/article/ArticleNew'
import App from '../App.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      { index: true, Component: Home },
      {
        path: "article",
        Component: ArticleList,
      },
      {
        path: "article/new",
        Component: ArticleNew,       // ← 必须在 :id 之前（静态优先）
      },
      {
        path: "article/:id",
        Component: ArticleDetail,
      },
      {
        path:"message",
        Component: Message
      },
      {
        path: "about",
        Component: About,
      },
      {
        path: "auth/github/callback",
        Component: GitHubCallback,
      }
    ],
  },
])

export default router
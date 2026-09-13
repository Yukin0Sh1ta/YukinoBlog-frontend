import { useState } from 'react'
import { createPortal } from 'react-dom'
import { TypewriterText } from './TypewriterText'
import avater from '../assets/avatar/avatar.jpg'
import githubSvg from '../assets/avatar/github.svg?raw'
import qqSvg from '../assets/avatar/qq.svg?raw'
import steamSvg from '../assets/avatar/steam.svg?raw'
import wechatSvg from '../assets/avatar/wechat.svg?raw'


const QQ_NUMBER = '360874368'
const STEAM_ID = '217098045'
const WECHAT_ID = 'Yukino0523ovo'


async function copyText(text: string) {
  await navigator.clipboard.writeText(text)
}

function Icon({ svg, size = 18 }: { svg: string; size?: number }) {
  return (
    <span
      className="inline-flex items-center justify-center
        [&_svg]:w-5.5 [&_svg]:h-5.5
        [&_svg]:transition [&_svg]:duration-200
        dark:[&_svg]:invert
        hover:[&_svg]:invert"
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}

export const Avatar = () => {
  const [toast, setToast] = useState<{ label: string; value: string }>(null)
  const handleCopy = async (label: string, number: string) => {
    await copyText(number)
    setToast({ label, value: number })
    setTimeout(() => setToast(null), 2000)
  }

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      <img
        src={avater}
        alt="Yukino"
        className="w-20 h-20 rounded-full object-cover border-2 border-white/20 shadow-md"
      />
      <h2 className="text-xl font-semibold text-(--text-sub) m-0">Yukino</h2>

      <div className="flex flex-row items-center gap-4">
        <a
          href="https://github.com/Yukin0Sh1ta"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#9a9a9a] transition-colors duration-200"
          title="GitHub"
        >
          <Icon svg={githubSvg} />
        </a>

        <button
          onClick={() => handleCopy('QQ', QQ_NUMBER)}
          className="text-[#9a9a9a] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          <Icon svg={qqSvg} />
        </button>

        <button
          onClick={() => handleCopy('微信', WECHAT_ID)}
          className="text-[#9a9a9a] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          <Icon svg={wechatSvg} />
        </button>

        <button
          onClick={() => handleCopy('Steam', STEAM_ID)}
          className="text-[#9a9a9a] transition-colors duration-200 cursor-pointer bg-transparent border-none p-0"
        >
          <Icon svg={steamSvg} />
        </button>

      </div>


      <div className="w-full h-px bg-(--card-border)"></div>
      <TypewriterText />

      {/* Toast 提示：渲染到 body，页面顶部居中 */}
      {toast && createPortal(
        <div className="fixed top-[15%] left-1/2 -translate-x-1/2 z-[9999] px-4 py-2 rounded-xl border border-(--card-border) bg-(--card-bg) backdrop-blur-lg shadow-lg text-sm text-(--text-main)">
          已复制 {toast.label}：{toast.value}
        </div>,
        document.body
      )}
    </div>
  )
}

import { useEffect,useState,useRef } from "react";
import type {TalkMessage, FloatItem} from "../../types/talk"
import {fetchCaptcha,postTalk,fetchTalks} from "../../api/message"
import {MusicPlayer} from "../../components/MusicPlayer"
import { createPortal } from 'react-dom'
import '../../css/Message.css'
import { Captcha } from '../../components/Captcha';
import { useUserStore, redirectToGitHubLogin } from '../../stores/user'
const STORAGE_KEY = "Yukino_talk_messages";
const MAX = 30;
const MAX_FLOATS = 60;


export const Message = () =>{
const talkRef = useRef<HTMLDivElement>(null)
const ghUser = useUserStore((s) => s.user)
const [text,setText] = useState<string>("");
const [messages,setMessages] = useState<TalkMessage[]>([]);
const [floats,setFloats] = useState<FloatItem[]>([]);
const [captchaModalVisible,setCaptchaModalVisible] = useState(false);
const [captchaSvg,setCaptchaSvg] = useState("");
const [captchaId,setCaptchaId] = useState("");
const [captchaInput,setCaptchaInput] = useState("");
const [captchaError,setCaptchaError] = useState("");
const [captchaSummary,setCaptchaSummary] = useState({ name: "", content: "" });
useEffect(() => {
  loadRemoteMessages() 
  }, [])
  useEffect(()=>{
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  },[messages])

const remaining = Math.max(0, MAX - text.length)
const canSend = text.trim().length > 0 && text.length <= MAX

const makeFloatFromMsg = (msg: Partial<TalkMessage> ): FloatItem | null => {
  try {
    const vh = Math.max(
      document.body.clientHeight || 0,
      document.documentElement.clientHeight || 0,
      window.innerHeight || 0
    );
    const headerEl = document.querySelector(
      "header, .head, #head, .header, #header"
    );
    const headerBottom = headerEl
      ? Math.max(0, headerEl.getBoundingClientRect().bottom)
      : 8;
    const talkTop = talkRef.current
      ? Math.max(0, talkRef.current.getBoundingClientRect().top)
      : Math.max(0, vh - 120);
      
    const minTop = Math.max(8, headerBottom + 8);
    const maxTop = Math.max(minTop + 20, talkTop - 12);
    const top = Math.floor(
      minTop + Math.random() * Math.max(0, maxTop - minTop)
    );
    const baseDuration = 14;
    const duration = Math.min(
      60,
      baseDuration + Math.max(0, (msg.text?.length || 0) / 4)
    );
    const color = `hsl(${Math.floor(Math.random() * 360)}, 70%, 45%)`;
    const size = 12 + Math.floor(Math.random() * 8);
    const delay = 0;
    return {
      id: msg.id ?? Date.now(),
      display: `${msg.username ?? "匿名"}: ${msg.text ?? ""}`,
      top,
      duration,
      color,
      size,
      delay,
      opacity: 1,
      startTime: performance.now() + delay * 1000,
    };
  } catch {
    return null;
  }
}

const addFloat = (f: FloatItem | null): void =>{
  if (!f) return;
  setFloats((prev) => {
    const next = [...prev, f]
    // 限制最大浮动物品数量，防止 DOM 节点无限增长
    return next.length > MAX_FLOATS ? next.slice(next.length - MAX_FLOATS) : next
  })
}

const refreshCaptcha = async(): Promise<void> => {
  try {
    const data = await fetchCaptcha();
    setCaptchaId(data.captchaId);
    setCaptchaSvg(data.svg);
    setCaptchaError("");
  } catch (e) {
    setCaptchaError("获取验证码失败，请重试");
  }
}

const openCaptchaModal = (): void =>{
  // 未登录：不允许发留言，引导 GitHub 登录
  if (!ghUser) {
    redirectToGitHubLogin()
    return
  }
  const content = (text ?? "").trim();
  const name = ghUser.login;   // GitHub 用户名
  if (!content || content.length > MAX) return;

  setCaptchaSummary({ name, content });
  setCaptchaInput("");
  setCaptchaError("");
  setCaptchaModalVisible(true);
  refreshCaptcha();
}

const closeCaptchaModal = (): void =>{
  setCaptchaModalVisible(false);
  setCaptchaInput("");
  setCaptchaError("");
}

const confirmCaptcha = async(): Promise<void> =>{
  const content = captchaSummary.content;
  const name = captchaSummary.name;
  if (!content || !captchaInput.trim()) return;

  try {
    const saved = await postTalk({
      username: name,
      text: content,
      captchaId: captchaId,
      captcha: captchaInput.trim(),
    });
    setMessages((prev) => [saved, ...prev])
    const f = makeFloatFromMsg(saved);
    addFloat(f);
    setText("");
    closeCaptchaModal();
  } catch (e: any) {
    const status = e?.response?.status;
    if (status === 429) {
      setCaptchaError("操作过于频繁，请稍后再试");
      refreshCaptcha();
    } else if (status === 400) {
      setCaptchaError("验证码错误");
      refreshCaptcha();
    } else {
      setCaptchaError("发送失败，请重试");
      refreshCaptcha();
    }
  }
}

const handleSendClick = (): void =>{
  const content = (text ?? "").trim();
  if (!content || content.length > MAX) return;
  if (!captchaId) {
    openCaptchaModal();
    return;
  }
   // 如果已有 captchaId（之前验证过），直接打开弹窗复用
  openCaptchaModal();
}

const loadRemoteMessages = async(): Promise<void> =>{
    const data = await fetchTalks();
    if (Array.isArray(data)) {
      setMessages(data);
      data.forEach((d)=>{
          addFloat(makeFloatFromMsg(d));
      })
      if (data.length === 0) {         
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setMessages(JSON.parse(raw));
      }
    }
  }



  return(
    <>
      <MusicPlayer></MusicPlayer>
      <div ref={talkRef} className="fixed left-1/2 -translate-x-1/2 bottom-5 z-10001 w-[min(720px,calc(100%-48px))] max-w-180 h-14 flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-(--card-bg) backdrop-blur-lg backdrop-saturate-110 border border-(--card-border) shadow-[0_8px_20px_rgba(0,0,0,0.4)] text-(--text-main) overflow-visible max-sm:h-13 max-sm:px-2.5">
        {/* GitHub 登录状态：已登录显示头像+用户名，未登录显示登录按钮 */}
        {ghUser ? (
          <div className="flex-[0_0_auto] flex items-center gap-2 select-none">
            <img src={ghUser.avatar_url} alt={ghUser.login} className="w-7.5 h-7.5 rounded-full object-cover border border-white/20" />
            <span className="text-xs text-(--text-main)">{ghUser.login}</span>
          </div>
        ) : (
          <button
            onClick={redirectToGitHubLogin}
            className="flex-[0_0_auto] flex items-center gap-2 h-7.5 px-3 rounded-[10px] border border-(--card-border) bg-white/10 text-xs text-(--text-main) cursor-pointer hover:bg-white/20 transition-colors"
            title="使用 GitHub 登录"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            GitHub 登录
          </button>
        )}

        <input value={text}onChange={(e)=>{setText(e.target.value)}}type="text"placeholder={ghUser ? "说点什么吧" : "登录后才能留言"}disabled={!ghUser}className="flex-[1_1_auto] h-7.5 min-h-7.5 px-2 py-1.5 rounded-[10px] border border-(--card-border) bg-white/10 text-xs text-(--text-main) leading-[1.2] overflow-hidden focus:outline-none placeholder:text-(--text-muted) placeholder:text-xs placeholder:opacity-100 max-sm:h-7 max-sm:text-xs"onKeyDown={(e)=>{if(e.key === "Enter"){e.preventDefault();handleSendClick()}}}maxLength={MAX}/>

        <div className="flex-[0_0_auto] ml-2 text-(--text-sub) text-xs px-2 py-1 rounded-lg bg-white/2 select-none">{ remaining } / { MAX }</div>
        <div className="flex gap-2 items-center justify-end">
          <button type="button" className="h-8 px-2.5 py-1.5 rounded-[10px] border-none bg-[linear-gradient(90deg,#ea5cb6,#d83e93)] text-(--text-main) font-semibold flex items-center justify-center shadow-[0_6px_14px_rgba(47,176,255,0.14)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed max-sm:h-7 max-sm:px-2"onClick={handleSendClick}disabled={!canSend}>发送</button></div>
        {createPortal(
          <div className="fixed left-0 top-0 w-full h-full pointer-events-none z-9998"aria-hidden="true">
        {floats.map((f, fi)=>{
            return(
              <div key={`float-${fi}-${f.id}`}className="float-item fixed left-0 whitespace-nowrap bg-transparent p-0 border-none shadow-none translate-x-[100vw] will-change-[transform,opacity] pointer-events-none [text-shadow:0_1px_3px_rgba(0,0,0,0.5)]"data-fid={f.id}
              style=
            {{
              top: f.top + 'px',
              animationDuration: f.duration + 's',
              animationDelay: f.delay + 's',
              animationIterationCount: 'infinite',
              color: f.color,
              fontSize: f.size + 'px',
              opacity: f.opacity
            }}
            >
              {f.display}
            </div>
          )
        })}
      </div>,document.body
        )}
    </div>
      <Captcha  
        data={{
          captchaModalVisible, captchaInput, captchaError, captchaSummary, captchaSvg,
        }}
        actions={{
          confirmCaptcha, closeCaptchaModal, refreshCaptcha, setCaptchaInput,
        }}/>


</> 
  )
}
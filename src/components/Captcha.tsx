import { createPortal } from 'react-dom'

export const Captcha = ({data,actions}) =>{
    return(
        <>
             {/* 验证码弹窗 */}
            {data.captchaModalVisible && createPortal(
                <div className="fixed inset-0 z-10010 flex items-center justify-center"onClick={(e)=>{if(e.target === e.currentTarget) actions.closeCaptchaModal()}}>
                  {/* 遮罩层 */}
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>
                  {/* 弹窗主体（毛玻璃） */}
                  <div className="relative w-[min(400px,calc(100%-32px))] max-w-100 rounded-2xl bg-(--card-bg) backdrop-blur-xl backdrop-saturate-110 border border-(--card-border) shadow-[0_16px_40px_rgba(0,0,0,0.4)] p-5 max-sm:p-4">
                    <h3 className="text-(--text-main) text-base font-semibold mb-4 text-center max-sm:text-sm max-sm:mb-3">发送留言</h3>
                  {/* 验证码图片 */}
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex-1 h-12 rounded-xl bg-white/6 border border-(--card-border) flex items-center justify-center cursor-pointer overflow-hidden select-none transition-colors duration-200 hover:border-[#ea5cb6]/50"onClick={actions.refreshCaptcha}title="点击刷新验证码"dangerouslySetInnerHTML={{ __html: data.captchaSvg }}></div>
                      <button type="button"className="h-10 px-3 rounded-xl border border-(--card-border) bg-white/6 text-(--text-sub) text-xs cursor-pointer transition-all duration-200 hover:bg-white/12 hover:text-(--text-main) active:scale-95"onClick={actions.refreshCaptcha}>刷新</button>
                    </div>
                  {/* 验证码输入 */}
                  <input
                    value={data.captchaInput}
                    onChange={(e)=>{actions.setCaptchaInput(e.target.value)}}
                    type="text"
                    placeholder="请输入验证码"
                    maxLength={6}
                    className="w-full h-10 px-3 rounded-xl border border-(--card-border) bg-white/10 text-sm text-(--text-main) outline-none focus:border-[#ea5cb6] focus:shadow-[0_6px_18px_rgba(47,176,255,0.12)] focus:bg-white/4 placeholder:text-(--text-muted) placeholder:text-xs mb-4 max-sm:mb-3"
                    onKeyDown={(e)=>{if(e.key === "Enter"){ e.preventDefault();actions.confirmCaptcha()}}}
                  />
                  {/* 提示信息 */}
                  {data.captchaError &&  <div  className="mb-3 text-[#ff6b6b] text-xs text-center">{ data.captchaError }</div>}
                  {/* 按钮区 */}
                  <div className="flex gap-3">
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-xl border border-(--card-border) bg-white/6 text-(--text-sub) text-xs font-medium cursor-pointer transition-all duration-200 hover:bg-white/12 hover:text-(--text-main) active:scale-95"
                      onClick={actions.closeCaptchaModal}>取消</button>
                    <button
                      type="button"
                      className="flex-1 h-9 rounded-xl border-none bg-[linear-gradient(90deg,#ea5cb6,#d83e93)] text-(--text-main) text-xs font-semibold cursor-pointer shadow-[0_6px_14px_rgba(47,176,255,0.14)] transition-all duration-200 hover:shadow-[0_8px_20px_rgba(47,176,255,0.22)] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={actions.confirmCaptcha}
                      disabled={!data.captchaInput.trim()}>确认发送</button>
                  </div>
        
        
                </div>
        
              </div>,
              document.body)}
        </>
    )
}
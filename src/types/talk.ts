export interface TalkMessage {
  id?: number | string;
  username: string;
  text: string;
  time?: number;
}

export interface CaptchaData {
  captchaId: string;
  svg: string;
}

export interface FloatItem {
  id: number | string;
  display: string;
  top: number;
  duration: number;
  color: string;
  size: number;
  delay: number;
  opacity: number;
  startTime: number;
}

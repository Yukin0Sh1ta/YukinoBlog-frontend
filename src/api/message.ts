import {instance} from "../utils/request";
import type { TalkMessage, CaptchaData } from "../types/talk";

export type { TalkMessage, CaptchaData };

export async function fetchTalks(): Promise<TalkMessage[]> {
  return instance.get(`/api/talk`);
}

export async function fetchCaptcha(): Promise<CaptchaData> {
  return instance.get(`/api/captcha`);
}

export async function postTalk(payload: {
  username: string;
  text: string;
  captchaId: string;
  captcha: string;
}): Promise<TalkMessage> {
  return instance.post(`/api/talk`, payload);
}

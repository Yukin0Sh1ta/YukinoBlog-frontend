import { create } from "zustand";
import type { Song, MusicState } from "../types/music";
import { API_BASE } from "../config/api";

export type { Song } from "../types/music";

function songUrl(id: string): string {
  return `${API_BASE}/api/music/url/${id}`;
}

export const playlist: Song[] = [
  { name: "みずいろの雨", artist: "松任谷由実", id: "26211236", cover: "midori.jpg" },
  { name: "One Last Kiss", artist: "Hikaru Utada", id: "1835122771", cover: "onelastkiss.jpg" },
  { name: "星と僕らと", artist: "须田景凪", id: "864433778", cover: "hoshi.jpg" },
];

const STORAGE_KEY = "Yukino_music_state";

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return {
      currentIndex: typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0,
      volume: typeof parsed.volume === "number" ? parsed.volume : 0.1,
      muted: typeof parsed.muted === "boolean" ? parsed.muted : false,
    };
  } catch {
    return null;
  }
}

// audio 单例放模块级（跨组件共享同一个，不会被重复创建）
const audio = new Audio();
let audioInited = false;
const restored = loadState();

export const useMusicStore = create<MusicState>()((set, get) => ({

  currentIndex: restored?.currentIndex ?? 0,
  playing: false,
  volume: restored?.volume ?? 0.1,
  muted: restored?.muted ?? false,
  currentTime: 0,
  duration: 0,

  // ====== 持久化 ======
  persist: () => {
    const { currentIndex, volume, muted } = get();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ currentIndex, volume, muted }));
  },

  // ====== Actions（用 set 更新）======
  init: () => {
    if (audioInited) return;
    audioInited = true;

    const { muted, volume } = get();
    audio.volume = muted ? 0 : volume;

    audio.addEventListener("play", () => set({ playing: true }));
    audio.addEventListener("pause", () => set({ playing: false }));
    audio.addEventListener("ended", () => {
      // 播放完自动下一首：确保 playing 状态正确
      get().next();
      set({ playing: true });
    });
    // 高频同步播放时间（100ms，比 timeupdate 的 250ms 更细，歌词更跟手）
    const syncTimer = setInterval(() => {
      set({ currentTime: audio.currentTime });
    }, 100);
    audio.addEventListener("loadedmetadata", () => {
      set({ duration: audio.duration || 0 });
    });
    audio.addEventListener("error", () => {
      console.warn("音频加载失败");
      set({ playing: false });
    });

    const song = playlist[get().currentIndex];
    if (song) {
      // 只预加载音频，不自动播放（用户点击播放按钮才播）
      audio.src = songUrl(song.id);
      audio.load();
    }
  },

  loadAndPlay: (index) => {
    if (index < 0 || index >= playlist.length) return;
    get().init();
    set({ currentIndex: index, playing: true });
    audio.src = songUrl(playlist[index].id);
    audio.load();
    audio.play().catch(() => set({ playing: false }));
  },

  togglePlay: () => {
    const { playing, currentIndex } = get();
    get().init();
    const song = playlist[currentIndex];
    if (!song) return;
    if (playing) {
      audio.pause();
    } else {
      const url = songUrl(song.id);
      if (!audio.src || audio.src !== url) {
        audio.src = url;
        audio.load();
      }
      audio.play().catch(() => set({ playing: false }));
    }
  },

  next: () => get().loadAndPlay((get().currentIndex + 1) % playlist.length),
  prev: () => get().loadAndPlay((get().currentIndex - 1 + playlist.length) % playlist.length),

  setVolume: (v) => {
    const clamped = Math.max(0, Math.min(1, v));
    set({ volume: clamped });
    audio.volume = clamped;
    if (clamped > 0) set({ muted: false });
    get().persist();
  },

  toggleMute: () => {
    const { muted, volume } = get();
    set({ muted: !muted });
    audio.volume = !muted ? 0 : volume;
    get().persist();
  },

  seek: (time) => {
    if (Number.isFinite(time)) {
      audio.currentTime = time;
      set({ currentTime: time });
    }
  },
}));
export interface Song {
  name: string;
  artist: string;
  id: string;
  cover?: string;
}

export interface MusicState {
  currentIndex: number;
  playing: boolean;
  volume: number;
  muted: boolean;
  currentTime: number;
  duration: number;
  persist: () => void;
  init: () => void;
  loadAndPlay: (index: number) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  seek: (time: number) => void;
}

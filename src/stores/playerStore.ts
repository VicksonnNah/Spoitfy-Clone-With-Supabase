import { create } from 'zustand'
import type { Song } from '../types'

interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  isPlaying: boolean
  currentTime: number
  duration: number
  volume: number
  queueIndex: number
  setCurrentSong: (song: Song) => void
  playQueue: (songs: Song[], startIndex?: number) => void
  togglePlay: () => void
  setPlaying: (playing: boolean) => void
  setCurrentTime: (time: number) => void
  setDuration: (duration: number) => void
  setVolume: (volume: number) => void
  next: () => void
  prev: () => void
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 0.7,
  queueIndex: -1,

  setCurrentSong: (song) => set({ currentSong: song, isPlaying: true, currentTime: 0 }),

  playQueue: (songs, startIndex = 0) =>
    set({
      queue: songs,
      queueIndex: startIndex,
      currentSong: songs[startIndex] || null,
      isPlaying: true,
      currentTime: 0,
    }),

  togglePlay: () => set((s) => ({ isPlaying: !s.isPlaying })),

  setPlaying: (playing) => set({ isPlaying: playing }),

  setCurrentTime: (time) => set({ currentTime: time }),

  setDuration: (duration) => set({ duration }),

  setVolume: (volume) => set({ volume }),

  next: () => {
    const { queue, queueIndex } = get()
    if (queueIndex < queue.length - 1) {
      const nextIndex = queueIndex + 1
      set({
        queueIndex: nextIndex,
        currentSong: queue[nextIndex],
        isPlaying: true,
        currentTime: 0,
      })
    } else {
      set({ isPlaying: false })
    }
  },

  prev: () => {
    const { queue, queueIndex, currentTime } = get()
    if (currentTime > 3) {
      set({ currentTime: 0 })
      return
    }
    if (queueIndex > 0) {
      const prevIndex = queueIndex - 1
      set({
        queueIndex: prevIndex,
        currentSong: queue[prevIndex],
        isPlaying: true,
        currentTime: 0,
      })
    }
  },
}))

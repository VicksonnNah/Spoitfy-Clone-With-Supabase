import { useEffect, useRef, useCallback } from 'react'
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function PlayerBar() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const {
    currentSong, isPlaying, currentTime, duration, volume,
    setCurrentTime, setDuration, setPlaying, togglePlay,
    next, prev, setVolume,
  } = usePlayerStore()

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    const audio = audioRef.current

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime)
    const handleLoadedMeta = () => setDuration(audio.duration)
    const handleEnded = () => next()
    const handlePlay = () => setPlaying(true)
    const handlePause = () => setPlaying(false)

    audio.addEventListener('timeupdate', handleTimeUpdate)
    audio.addEventListener('loadedmetadata', handleLoadedMeta)
    audio.addEventListener('ended', handleEnded)
    audio.addEventListener('play', handlePlay)
    audio.addEventListener('pause', handlePause)

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
      audio.removeEventListener('loadedmetadata', handleLoadedMeta)
      audio.removeEventListener('ended', handleEnded)
      audio.removeEventListener('play', handlePlay)
      audio.removeEventListener('pause', handlePause)
    }
  }, [setCurrentTime, setDuration, next, setPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentSong) return
    audio.src = currentSong.audio_url
    audio.volume = volume
    audio.play().catch(() => {})
  }, [currentSong])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
    }
    setCurrentTime(time)
  }, [setCurrentTime])

  if (!currentSong) return null

  return (
    <div className="h-20 bg-[#121212] border-t border-[#282828] flex items-center px-4 gap-4">
      {/* Song info */}
      <div className="flex items-center gap-3 w-60">
        <div className="w-12 h-12 bg-[#282828] rounded overflow-hidden shrink-0 flex items-center justify-center text-xs text-[#a0a0a0]">
          {currentSong.cover_url ? (
            <img src={currentSong.cover_url} alt="" className="w-full h-full object-cover" />
          ) : (
            '♪'
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium truncate">{currentSong.title}</p>
          <p className="text-xs text-[#a0a0a0] truncate">{currentSong.artist}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <div className="flex items-center gap-4">
          <button onClick={prev} className="text-[#a0a0a0] hover:text-white transition-colors">
            <SkipBack size={18} fill="currentColor" />
          </button>
          <button
            onClick={togglePlay}
            className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
          </button>
          <button onClick={next} className="text-[#a0a0a0] hover:text-white transition-colors">
            <SkipForward size={18} fill="currentColor" />
          </button>
        </div>
        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-xs text-[#a0a0a0] w-10 text-right">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="flex-1 h-1 accent-[#1db954] cursor-pointer"
          />
          <span className="text-xs text-[#a0a0a0] w-10">{formatTime(duration)}</span>
        </div>
      </div>

      {/* Volume */}
      <div className="flex items-center gap-2 w-40 justify-end">
        <button onClick={() => setVolume(volume === 0 ? 0.7 : 0)} className="text-[#a0a0a0] hover:text-white">
          {volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
          className="w-24 h-1 accent-[#1db954] cursor-pointer"
        />
      </div>
    </div>
  )
}

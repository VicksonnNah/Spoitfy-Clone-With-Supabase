import { Play, Heart, Plus, Trash2 } from 'lucide-react'
import { usePlayerStore } from '../stores/playerStore'
import type { Song } from '../types'

interface SongRowProps {
  song: Song
  allSongs?: Song[]
  isLiked: boolean
  onLike?: () => void
  onUnlike?: () => void
  showAddToPlaylist?: boolean
  playlists?: { id: number; name: string }[]
  onAddToPlaylist?: (playlistId: number) => void
  onRemove?: () => void
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function SongRow({
  song, allSongs, isLiked, onLike, onUnlike,
  showAddToPlaylist, playlists, onAddToPlaylist, onRemove,
}: SongRowProps) {
  const { setCurrentSong, playQueue } = usePlayerStore()

  const handlePlay = () => {
    const songs = allSongs || [song]
    const idx = songs.findIndex((s) => s.id === song.id)
    if (idx >= 0) {
      playQueue(songs, idx)
    } else {
      setCurrentSong(song)
    }
  }

  return (
    <div className="group grid grid-cols-[40px_1fr_1fr_80px_100px] items-center px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-sm">
      <div className="relative flex items-center justify-center">
        <span className="group-hover:hidden text-[#a0a0a0]">{song.id}</span>
        <button onClick={handlePlay} className="hidden group-hover:flex text-white">
          <Play size={16} fill="currentColor" />
        </button>
      </div>

      <div className="flex items-center gap-3 min-w-0">
        <div className="w-10 h-10 bg-[#282828] rounded overflow-hidden shrink-0 flex items-center justify-center text-[#a0a0a0] text-xs">
          {song.cover_url ? (
            <img src={song.cover_url} alt="" className="w-full h-full object-cover" />
          ) : '♪'}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{song.title}</p>
        </div>
      </div>

      <p className="text-[#a0a0a0] truncate">{song.artist}</p>
      <p className="text-[#a0a0a0] truncate text-xs">{song.album}</p>

      <div className="flex items-center justify-end gap-2">
        {onRemove && (
          <button onClick={onRemove} className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity">
            <Trash2 size={16} />
          </button>
        )}

        {showAddToPlaylist && playlists && onAddToPlaylist && (
          <div className="relative group/playlist">
            <button className="text-[#a0a0a0] hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
              <Plus size={16} />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-[#282828] rounded-lg shadow-xl py-1 min-w-40 hidden group-hover/playlist:block z-50">
              {playlists.length === 0 && (
                <p className="px-3 py-2 text-xs text-[#a0a0a0]">No playlists</p>
              )}
              {playlists.map((pl) => (
                <button
                  key={pl.id}
                  onClick={() => onAddToPlaylist(pl.id)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-white/10 transition-colors"
                >
                  {pl.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLiked ? (
          <button onClick={onUnlike} className="text-[#1db954] hover:text-[#1ed760] transition-colors">
            <Heart size={16} fill="currentColor" />
          </button>
        ) : (
          <button onClick={onLike} className="text-[#a0a0a0] hover:text-white opacity-0 group-hover:opacity-100 transition-all">
            <Heart size={16} />
          </button>
        )}

        <span className="text-[#a0a0a0] text-xs w-12 text-right">{formatDuration(song.duration)}</span>
      </div>
    </div>
  )
}

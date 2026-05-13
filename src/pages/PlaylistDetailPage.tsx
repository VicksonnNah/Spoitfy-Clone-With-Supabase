import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, Play } from 'lucide-react'
import { getPlaylistWithSongs, deletePlaylist, removeSongFromPlaylist, likeSong, unlikeSong, isLiked } from '../lib/db'
import { SongRow } from '../components/SongRow'
import { Button } from '../components/ui/Button'
import { usePlayerStore } from '../stores/playerStore'
import type { Playlist } from '../types'

export function PlaylistDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [playlist, setPlaylist] = useState<Playlist | null>(null)
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    load()
  }, [id])

  const load = async () => {
    setLoading(true)
    const pl = await getPlaylistWithSongs(Number(id))
    if (!pl) {
      navigate('/')
      return
    }
    setPlaylist(pl)
    const likedSet = new Set<number>()
    if (pl.songs) {
      await Promise.all(
        pl.songs.map(async (song) => {
          const liked = await isLiked(song.id)
          if (liked) likedSet.add(song.id)
        })
      )
    }
    setLikedIds(likedSet)
    setLoading(false)
  }

  const handleDelete = async () => {
    if (!playlist) return
    await deletePlaylist(playlist.id)
    navigate('/')
  }

  const handleRemoveSong = async (songId: number) => {
    if (!playlist) return
    await removeSongFromPlaylist(playlist.id, songId)
    setPlaylist({
      ...playlist,
      songs: playlist.songs?.filter((s) => s.id !== songId),
    })
  }

  const handlePlayAll = () => {
    if (!playlist?.songs?.length) return
    usePlayerStore.getState().playQueue(playlist.songs, 0)
  }

  const handleLike = async (songId: number) => {
    await likeSong(songId)
    setLikedIds((prev) => new Set(prev).add(songId))
  }

  const handleUnlike = async (songId: number) => {
    await unlikeSong(songId)
    setLikedIds((prev) => {
      const next = new Set(prev)
      next.delete(songId)
      return next
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!playlist) return null

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="flex items-start gap-6 mb-6">
        <div className="w-48 h-48 bg-gradient-to-br from-[#1db954] to-blue-600 rounded-lg flex items-center justify-center text-4xl shrink-0">
          ♪
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs uppercase tracking-wider font-semibold text-[#a0a0a0]">Playlist</p>
          <h1 className="text-3xl font-bold mt-1 truncate">{playlist.name}</h1>
          {playlist.description && (
            <p className="text-sm text-[#a0a0a0] mt-1">{playlist.description}</p>
          )}
          <p className="text-sm text-[#a0a0a0] mt-2">{playlist.songs?.length || 0} songs</p>
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handlePlayAll}
              className="w-12 h-12 bg-[#1db954] rounded-full flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all"
            >
              <Play size={22} fill="black" className="ml-0.5 text-black" />
            </button>
            <Button variant="ghost" size="sm" onClick={handleDelete}>
              <Trash2 size={16} /> Delete
            </Button>
          </div>
        </div>
      </div>

      {(!playlist.songs || playlist.songs.length === 0) ? (
        <div className="text-center py-20">
          <p className="text-[#a0a0a0] text-lg">No songs in this playlist</p>
          <p className="text-[#a0a0a0] text-sm mt-2">Add songs from the Home or Search page.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {playlist.songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              allSongs={playlist.songs}
              isLiked={likedIds.has(song.id)}
              onLike={() => handleLike(song.id)}
              onUnlike={() => handleUnlike(song.id)}
              onRemove={() => handleRemoveSong(song.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

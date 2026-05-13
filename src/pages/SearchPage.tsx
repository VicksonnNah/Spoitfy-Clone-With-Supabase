import { useState, useEffect } from 'react'
import { Search } from 'lucide-react'
import { getSongs, likeSong, unlikeSong, isLiked, getPlaylists, addSongToPlaylist, getPlaylistWithSongs } from '../lib/db'
import { SongRow } from '../components/SongRow'
import type { Song, Playlist } from '../types'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const [songs, setSongs] = useState<Song[]>([])
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setSongs([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      const [s, p] = await Promise.all([getSongs(query), getPlaylists()])
      setSongs(s)
      setPlaylists(p)
      const likedSet = new Set<number>()
      await Promise.all(
        s.map(async (song) => {
          const liked = await isLiked(song.id)
          if (liked) likedSet.add(song.id)
        })
      )
      setLikedIds(likedSet)
      setLoading(false)
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

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

  const handleAddToPlaylist = async (playlistId: number, songId: number) => {
    const pl = await getPlaylistWithSongs(playlistId)
    const pos = pl?.songs?.length || 0
    await addSongToPlaylist(playlistId, songId, pos)
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="relative mb-6">
        <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a0a0a0]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full max-w-md pl-10 pr-4 py-2.5 bg-[#121212] border border-[#282828] rounded-full text-white placeholder:text-[#a0a0a0] focus:border-[#1db954] transition-colors"
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && query && songs.length === 0 && (
        <div className="text-center py-20">
          <p className="text-[#a0a0a0] text-lg">No results for "{query}"</p>
        </div>
      )}

      {!loading && songs.length > 0 && (
        <div className="space-y-1">
          {songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              allSongs={songs}
              isLiked={likedIds.has(song.id)}
              onLike={() => handleLike(song.id)}
              onUnlike={() => handleUnlike(song.id)}
              showAddToPlaylist
              playlists={playlists}
              onAddToPlaylist={(playlistId) => handleAddToPlaylist(playlistId, song.id)}
            />
          ))}
        </div>
      )}

      {!query && (
        <div className="text-center py-20">
          <p className="text-[#a0a0a0]">Start typing to search for songs, artists, or albums</p>
        </div>
      )}
    </div>
  )
}

import { useEffect, useState } from 'react'
import { getSongs, likeSong, unlikeSong, isLiked, getPlaylists, addSongToPlaylist, getPlaylistWithSongs } from '../lib/db'
import { SongRow } from '../components/SongRow'
import type { Song, Playlist } from '../types'

export function HomePage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [likedIds, setLikedIds] = useState<Set<number>>(new Set())
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const [s, p] = await Promise.all([getSongs(), getPlaylists()])
    setSongs(s)
    setPlaylists(p)
    // Check which songs are liked
    const likedSet = new Set<number>()
    await Promise.all(
      s.map(async (song) => {
        const liked = await isLiked(song.id)
        if (liked) likedSet.add(song.id)
      })
    )
    setLikedIds(likedSet)
    setLoading(false)
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

  const handleAddToPlaylist = async (playlistId: number, songId: number) => {
    const pl = await getPlaylistWithSongs(playlistId)
    const pos = pl?.songs?.length || 0
    await addSongToPlaylist(playlistId, songId, pos)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="p-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold mb-6">Good evening</h1>

      {songs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#a0a0a0] text-lg">No songs yet</p>
          <p className="text-[#a0a0a0] text-sm mt-2">Add some songs to your Supabase database to get started.</p>
        </div>
      ) : (
        <div>
          <h2 className="text-lg font-semibold mb-3">All Songs</h2>
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
        </div>
      )}
    </div>
  )
}

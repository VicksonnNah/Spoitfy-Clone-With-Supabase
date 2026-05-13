import { useEffect, useState } from 'react'
import { Heart } from 'lucide-react'
import { getLikedSongs, unlikeSong, getPlaylists, addSongToPlaylist, getPlaylistWithSongs } from '../lib/db'
import { SongRow } from '../components/SongRow'
import type { Song, Playlist } from '../types'

export function LikedSongsPage() {
  const [songs, setSongs] = useState<Song[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    load()
  }, [])

  const load = async () => {
    setLoading(true)
    const [s, p] = await Promise.all([getLikedSongs(), getPlaylists()])
    setSongs(s)
    setPlaylists(p)
    setLoading(false)
  }

  const handleUnlike = async (songId: number) => {
    await unlikeSong(songId)
    setSongs((prev) => prev.filter((s) => s.id !== songId))
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
      <div className="flex items-center gap-4 mb-6">
        <div className="w-48 h-48 bg-gradient-to-br from-purple-700 to-pink-500 rounded-lg flex items-center justify-center">
          <Heart size={64} className="text-white/80" fill="white" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wider font-semibold text-[#a0a0a0]">Playlist</p>
          <h1 className="text-3xl font-bold mt-1">Liked Songs</h1>
          <p className="text-sm text-[#a0a0a0] mt-2">{songs.length} songs</p>
        </div>
      </div>

      {songs.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-[#a0a0a0] text-lg">No liked songs yet</p>
          <p className="text-[#a0a0a0] text-sm mt-2">Hit the heart icon on any song to save it here.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {songs.map((song) => (
            <SongRow
              key={song.id}
              song={song}
              allSongs={songs}
              isLiked
              onUnlike={() => handleUnlike(song.id)}
              showAddToPlaylist
              playlists={playlists}
              onAddToPlaylist={(playlistId) => handleAddToPlaylist(playlistId, song.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

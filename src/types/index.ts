export interface Song {
  id: number
  title: string
  artist: string
  album: string
  duration: number
  audio_url: string
  cover_url: string
  created_at: string
}

export interface Playlist {
  id: number
  user_id: string
  name: string
  description: string
  cover_url: string
  created_at: string
  songs?: Song[]
}

export interface PlaylistSong {
  id: number
  playlist_id: number
  song_id: number
  position: number
  added_at: string
}

export interface LikedSong {
  id: number
  user_id: string
  song_id: number
  created_at: string
  songs?: Song
}

export interface UserProfile {
  id: string
  email: string
}

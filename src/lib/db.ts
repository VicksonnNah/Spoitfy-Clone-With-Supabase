import { supabase } from './supabase'
import type { Song, Playlist } from '../types'

// --- Songs ---
export async function getSongs(search?: string): Promise<Song[]> {
  let query = supabase.from('songs').select('*').order('created_at', { ascending: false })
  if (search) {
    query = query.or(`title.ilike.%${search}%,artist.ilike.%${search}%,album.ilike.%${search}%`)
  }
  const { data } = await query
  return data || []
}

export async function getSong(id: number): Promise<Song | null> {
  const { data } = await supabase.from('songs').select('*').eq('id', id).single()
  return data
}

// --- Playlists ---
export async function getPlaylists(): Promise<Playlist[]> {
  const { data } = await supabase.from('playlists').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getPlaylistWithSongs(id: number): Promise<Playlist | null> {
  const { data: playlist } = await supabase.from('playlists').select('*').eq('id', id).single()
  if (!playlist) return null

  const { data: playlistSongs } = await supabase
    .from('playlist_songs')
    .select('song_id, songs(*)')
    .eq('playlist_id', id)
    .order('position')

  const songs = (playlistSongs || [])
    .map((ps: any) => ps.songs)
    .filter(Boolean)

  return { ...playlist, songs }
}

export async function createPlaylist(name: string, description = ''): Promise<Playlist | null> {
  const { data } = await supabase
    .from('playlists')
    .insert({ name, description })
    .select()
    .single()
  return data
}

export async function deletePlaylist(id: number): Promise<void> {
  await supabase.from('playlists').delete().eq('id', id)
}

export async function addSongToPlaylist(playlistId: number, songId: number, position: number): Promise<void> {
  await supabase.from('playlist_songs').insert({ playlist_id: playlistId, song_id: songId, position })
}

export async function removeSongFromPlaylist(playlistId: number, songId: number): Promise<void> {
  await supabase.from('playlist_songs').delete().match({ playlist_id: playlistId, song_id: songId })
}

// --- Liked Songs ---
export async function getLikedSongs(): Promise<Song[]> {
  const { data } = await supabase
    .from('liked_songs')
    .select('songs(*)')
    .order('created_at', { ascending: false })
  return (data || []).map((d: any) => d.songs).filter(Boolean)
}

export async function likeSong(songId: number): Promise<void> {
  await supabase.from('liked_songs').insert({ song_id: songId })
}

export async function unlikeSong(songId: number): Promise<void> {
  await supabase.from('liked_songs').delete().eq('song_id', songId)
}

export async function isLiked(songId: number): Promise<boolean> {
  const { data } = await supabase.from('liked_songs').select('id').eq('song_id', songId).maybeSingle()
  return !!data
}

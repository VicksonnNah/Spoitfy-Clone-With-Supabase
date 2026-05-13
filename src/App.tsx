import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase } from './lib/supabase'
import { useAuthStore } from './stores/authStore'
import { getPlaylists, createPlaylist } from './lib/db'
import { Sidebar } from './components/Sidebar'
import { PlayerBar } from './components/PlayerBar'
import { HomePage } from './pages/HomePage'
import { SearchPage } from './pages/SearchPage'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { LikedSongsPage } from './pages/LikedSongsPage'
import { PlaylistDetailPage } from './pages/PlaylistDetailPage'
import type { Playlist } from './types'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  const loadPlaylists = async () => {
    const pl = await getPlaylists()
    setPlaylists(pl)
  }

  useEffect(() => {
    loadPlaylists()
  }, [])

  const handleCreatePlaylist = async () => {
    const name = prompt('Playlist name:')
    if (!name?.trim()) return
    await createPlaylist(name.trim())
    await loadPlaylists()
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex flex-1 overflow-hidden">
        <Sidebar playlists={playlists} onCreatePlaylist={handleCreatePlaylist} />
        <main className="flex-1 bg-[#121212] overflow-hidden">
          {children}
        </main>
      </div>
      <PlayerBar />
    </div>
  )
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  return <ProtectedLayout>{children}</ProtectedLayout>
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user)
  const loading = useAuthStore((s) => s.loading)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0a0a0a]">
        <div className="w-10 h-10 border-2 border-[#1db954] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (user) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  const setUser = useAuthStore((s) => s.setUser)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
        <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
        <Route path="/search" element={<AuthGuard><SearchPage /></AuthGuard>} />
        <Route path="/liked" element={<AuthGuard><LikedSongsPage /></AuthGuard>} />
        <Route path="/playlist/:id" element={<AuthGuard><PlaylistDetailPage /></AuthGuard>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

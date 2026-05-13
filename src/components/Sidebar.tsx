import { NavLink } from 'react-router-dom'
import { Home, Search, Heart, Plus } from 'lucide-react'
import { useAuthStore } from '../stores/authStore'
import type { Playlist } from '../types'

interface SidebarProps {
  playlists: Playlist[]
  onCreatePlaylist: () => void
}

export function Sidebar({ playlists, onCreatePlaylist }: SidebarProps) {
  const user = useAuthStore((s) => s.user)

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
      isActive ? 'text-white bg-white/10' : 'text-[#a0a0a0] hover:text-white'
    }`

  return (
    <aside className="w-64 bg-[#0a0a0a] flex flex-col h-full p-2">
      <div className="p-3 mb-2">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-[#1db954]">♪</span> Miniify
        </h1>
      </div>

      <nav className="flex-1 space-y-1 px-1">
        <NavLink to="/" className={linkClass}>
          <Home size={22} />
          <span>Home</span>
        </NavLink>
        <NavLink to="/search" className={linkClass}>
          <Search size={22} />
          <span>Search</span>
        </NavLink>

        <div className="pt-4 pb-2">
          <div className="flex items-center justify-between px-3 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#a0a0a0]">Your Library</span>
            <button onClick={onCreatePlaylist} className="text-[#a0a0a0] hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors">
              <Plus size={16} />
            </button>
          </div>
        </div>

        <NavLink to="/liked" className={linkClass}>
          <Heart size={22} className="text-red-400" />
          <span>Liked Songs</span>
        </NavLink>

        {playlists.map((pl) => (
          <NavLink key={pl.id} to={`/playlist/${pl.id}`} className={linkClass}>
            <div className="w-5 h-5 bg-[#282828] rounded flex items-center justify-center text-xs text-[#a0a0a0] shrink-0">
              ♪
            </div>
            <span className="truncate">{pl.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 border-t border-[#282828]">
        <div className="flex items-center gap-2 text-sm text-[#a0a0a0]">
          <div className="w-7 h-7 rounded-full bg-[#1db954] flex items-center justify-center text-black font-bold text-xs">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <span className="truncate">{user?.email}</span>
        </div>
      </div>
    </aside>
  )
}

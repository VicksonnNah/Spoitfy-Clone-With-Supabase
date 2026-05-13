import { useState, type FormEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { Button } from '../components/ui/Button'

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const signIn = useAuthStore((s) => s.signIn)
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const msg = await signIn(email, password)
    if (msg) {
      setError(msg)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#0a0a0a]">
      <div className="w-full max-w-sm p-8">
        <h1 className="text-3xl font-bold mb-2 text-center">
          <span className="text-[#1db954]">♪</span> Miniify
        </h1>
        <p className="text-[#a0a0a0] text-center mb-8">Sign in to your account</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#121212] border border-[#282828] rounded-lg text-white placeholder:text-[#a0a0a0] focus:border-[#1db954] transition-colors"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-[#121212] border border-[#282828] rounded-lg text-white placeholder:text-[#a0a0a0] focus:border-[#1db954] transition-colors"
              placeholder="••••••••"
            />
          </div>
          <Button type="submit" className="w-full">Sign In</Button>
        </form>

        <p className="text-center text-sm text-[#a0a0a0] mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="text-white hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

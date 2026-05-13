-- Run this in your Supabase SQL Editor

-- Songs table
CREATE TABLE songs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT NOT NULL DEFAULT '',
  duration INTEGER NOT NULL, -- seconds
  audio_url TEXT NOT NULL,
  cover_url TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Playlists table
CREATE TABLE playlists (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Playlist songs junction table
CREATE TABLE playlist_songs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  playlist_id BIGINT NOT NULL REFERENCES playlists(id) ON DELETE CASCADE,
  song_id BIGINT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  position INTEGER NOT NULL DEFAULT 0,
  added_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(playlist_id, song_id)
);

-- Liked songs
CREATE TABLE liked_songs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  song_id BIGINT NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, song_id)
);

-- Enable Row Level Security
ALTER TABLE songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlist_songs ENABLE ROW LEVEL SECURITY;
ALTER TABLE liked_songs ENABLE ROW LEVEL SECURITY;

-- Policies: songs are public (read-only)
CREATE POLICY "Songs are public" ON songs FOR SELECT USING (true);

-- Policies: playlists are user-specific
CREATE POLICY "Users can read own playlists" ON playlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create playlists" ON playlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own playlists" ON playlists FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own playlists" ON playlists FOR DELETE USING (auth.uid() = user_id);

-- Policies: playlist_songs follow playlist ownership
CREATE POLICY "Users can read own playlist songs" ON playlist_songs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can add to own playlists" ON playlist_songs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );
CREATE POLICY "Users can remove from own playlists" ON playlist_songs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM playlists WHERE id = playlist_id AND user_id = auth.uid())
  );

-- Policies: liked songs are user-specific
CREATE POLICY "Users can read own liked songs" ON liked_songs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can like songs" ON liked_songs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unlike songs" ON liked_songs FOR DELETE USING (auth.uid() = user_id);

-- Storage bucket for song files and covers
INSERT INTO storage.buckets (id, name, public) VALUES ('audio', 'audio', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('covers', 'covers', true) ON CONFLICT DO NOTHING;

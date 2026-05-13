-- Sample songs (use real public-domain audio URLs or upload your own)
-- You need to upload audio files to the 'audio' bucket and covers to the 'covers' bucket in Supabase Storage,
-- then update the URLs below.

INSERT INTO songs (title, artist, album, duration, audio_url, cover_url) VALUES
  ('Sunny Day', 'The Wandering Souls', 'Morning Light', 234, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', ''),
  ('Ocean Waves', 'Calm Collective', 'Nature Sounds', 187, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', ''),
  ('Electric Dreams', 'Neon Pulse', 'Synthetic', 201, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', ''),
  ('Midnight Run', 'The Night Owls', 'Late Nights', 245, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', ''),
  ('Stargazing', 'Cosmic Drift', 'Celestial', 198, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', ''),
  ('Urban Flow', 'City Lights', 'Metropolis', 212, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', ''),
  ('Forest Walk', 'Nature Sounds', 'Earth', 267, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', ''),
  ('Retro Vibes', 'The Classics', 'Throwback', 189, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', ''),
  ('Jazz Cafe', 'Smooth Operators', 'Coffee Shop', 223, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', ''),
  ('Deep Focus', 'Ambient Works', 'Concentration', 300, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', ''),
  ('Summer Breeze', 'The Beach Boys Collective', 'Seasonal', 176, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', ''),
  ('Night Drive', 'Synthwave Runner', 'Retro Future', 254, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', ''),
  ('Acoustic Morning', 'Fingerstyle Folk', 'Simple Pleasures', 215, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3', ''),
  ('Electronic Pulse', 'Bass Reactor', 'Frequency', 198, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3', ''),
  ('Lofi Study', 'Chill Beats', 'Study Session', 240, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3', ''),
  ('Rock Anthem', 'The Voltage', 'High Energy', 222, 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3', '');

-- Update the sequence
SELECT setval('songs_id_seq', (SELECT MAX(id) FROM songs));

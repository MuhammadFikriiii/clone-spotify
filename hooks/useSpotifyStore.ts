"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

interface Track {
  id: number
  title: string
  artist: string
  album: string
  duration: string
  cover: string
  src: string
  lyrics: { time: number; text: string }[]
}

interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  songs: number[]
  createdAt: Date
}

interface SpotifyStore {
  // Audio state
  tracks: Track[]
  currentTrackIndex: number
  isPlaying: boolean
  isShuffled: boolean
  repeatMode: number // 0: no repeat, 1: repeat all, 2: repeat one
  volume: number

  // UI state
  currentPage: string
  showLyrics: boolean
  showCreatePlaylistModal: boolean

  // User data
  likedTracks: Set<number>
  playlists: Playlist[]

  // Actions
  initializeStore: () => void
  playTrack: (index: number) => void
  togglePlay: () => void
  nextTrack: () => void
  previousTrack: () => void
  toggleShuffle: () => void
  toggleRepeat: () => void
  toggleLike: () => void
  setVolume: (volume: number) => void
  setCurrentPage: (page: string) => void
  setShowLyrics: (show: boolean) => void
  setShowCreatePlaylistModal: (show: boolean) => void
  createPlaylist: (playlist: Omit<Playlist, "id" | "songs" | "createdAt">) => void
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void
  deletePlaylist: (id: string) => void
  addSongToPlaylist: (playlistId: string, songId: number) => void
  removeSongFromPlaylist: (playlistId: string, songId: number) => void
}

const defaultTracks: Track[] = [
    {
      id: 1,
      title: "Night Changes",
      artist: "One Direction",
      album: "One Direction",
      duration: "4:00",
      cover: "/cover/nightchanges.jpg",
      src: "/lagu/nightchanges.mp3",
      lyrics: [
    { time: 8, text: "Going out tonight, changes into something red" },
    { time: 13, text: "Her mother doesn't like that kind of dress" },
    { time: 17, text: "Everything she never had, she's showing off" },
    { time: 24, text: "Driving too fast, moon is breaking through her hair" },
    { time: 29, text: "She said it was something that she won't forget" },
    { time: 33, text: "Having no regrets is all that she really wants" },

    { time: 40, text: "We're only getting older, baby" },
    { time: 44, text: "And I've been thinking about it lately" },
    { time: 49, text: "Does it ever drive you crazy" },
    { time: 52, text: "Just how fast the night changes?" },

    { time: 57, text: "Everything that you've ever dreamed of" },
    { time: 61, text: "Disappearing when you wake up" },
    { time: 65, text: "But there's nothing to be afraid of" },
    { time: 68, text: "Even when the night changes" },
    { time: 73, text: "It will never change me and you" },

    { time: 80, text: "Chasing it tonight, doubts are running 'round her head" },
    { time: 84, text: "He's waiting, hides behind a cigarette" },
    { time: 89, text: "Heart is beating loud, and she doesn't want it to stop" },

    { time: 96, text: "Moving too fast, moon is lighting up her skin" },
    { time: 101, text: "She's falling, doesn't even know it yet" },
    { time: 104, text: "Having no regrets is all that she really wants" },

    { time: 112, text: "We're only getting older, baby" },
    { time: 117, text: "And I've been thinking about it lately" },
    { time: 121, text: "Does it ever drive you crazy" },
    { time: 124, text: "Just how fast the night changes?" },

    { time: 129, text: "Everything that you've ever dreamed of" },
    { time: 133, text: "Disappearing when you wake up" },
    { time: 137, text: "But there's nothing to be afraid of" },
    { time: 140, text: "Even when the night changes" },
    { time: 144, text: "It will never change me and you" },

    { time: 160, text: "Going out tonight, changes into something red" },
    { time: 165, text: "Her mother doesn't like that kind of dress" },
    { time: 169, text: "Reminds her of the missing piece of innocence she lost" },

    { time: 174, text: "We're only getting older, baby" },
    { time: 179, text: "And I've been thinking about it lately" },
    { time: 183, text: "Does it ever drive you crazy" },
    { time: 186, text: "Just how fast the night changes?" },

    { time: 191, text: "Everything that you've ever dreamed of" },
    { time: 195, text: "Disappearing when you wake up" },
    { time: 199, text: "But there's nothing to be afraid of" },
    { time: 202, text: "Even when the night changes" },
    { time: 235, text: "It will never change, baby" },
    { time: 238, text: "It will never change me and you" }
  ],
  },
  {
    id: 2,
    title: "Watermelon Sugar",
    artist: "Harry Styles",
    album: "Fine Line",
    duration: "2:54",
    cover: "/cover/whereweare.jpg",
    src: "/placeholder.mp3",
    lyrics: [
      { time: 0, text: "Tastes like strawberries on a summer evenin'" },
      { time: 4, text: "And it sounds just like a song" },
      { time: 8, text: "I want more berries and that summer feelin'" },
      { time: 12, text: "It's so wonderful and warm" },
      { time: 16, text: "Breathe me in, breathe me out" },
      { time: 20, text: "I don't know if I could ever go without" },
      { time: 24, text: "Watermelon sugar high" },
    ],
  },
  {
    id: 3,
    title: "Levitating",
    artist: "Dua Lipa",
    album: "Future Nostalgia",
    duration: "3:23",
    cover: "/cover/nightchanges.jpg",
    src: "/placeholder.mp3",
    lyrics: [
      { time: 0, text: "If you wanna run away with me" },
      { time: 4, text: "I know a galaxy and I can take you for a ride" },
      { time: 8, text: "I had a premonition that we fell into a rhythm" },
      { time: 12, text: "Where the music don't stop for life" },
      { time: 16, text: "Glitter in the sky, glitter in my eyes" },
      { time: 20, text: "Shining just the way I like" },
      { time: 24, text: "If you're feeling like you need a little bit of company" },
    ],
  },
  {
    id: 4,
    title: "Good 4 U",
    artist: "Olivia Rodrigo",
    album: "SOUR",
    duration: "2:58",
    cover: "/cover/nightchanges.jpg",
    src: "/placeholder.mp3",
    lyrics: [
      { time: 0, text: "Well, good for you, I guess you moved on really easily" },
      { time: 4, text: "You found a new girl and it only took a couple weeks" },
      { time: 8, text: "Remember when you said that you wanted to give me the world?" },
      { time: 12, text: "And good for you, I guess that you've been workin' on yourself" },
      { time: 16, text: "I guess that therapist I found for you, she really helped" },
      { time: 20, text: "Now you can be a better man for your brand new girl" },
      { time: 24, text: "Well, good for you" },
    ],
  },
]

export const useSpotifyStore = create<SpotifyStore>()(
  persist(
    (set, get) => ({
      // Initial state
      tracks: defaultTracks,
      currentTrackIndex: 0,
      isPlaying: false,
      isShuffled: false,
      repeatMode: 0,
      volume: 1,
      currentPage: "home",
      showLyrics: false,
      showCreatePlaylistModal: false,
      likedTracks: new Set([1, 2]),
      playlists: [
        {
          id: "default-1",
          name: "My Favorites",
          description: "My favorite songs collection",
          cover: "/placeholder.svg?height=300&width=300",
          songs: [1, 3],
          createdAt: new Date(),
        },
      ],

      // Actions
      initializeStore: () => {
        // This will be called on app initialization
        // The persist middleware will handle loading from localStorage
      },

      playTrack: (index: number) => {
        set({ currentTrackIndex: index, isPlaying: true })
      },

      togglePlay: () => {
        set((state) => ({ isPlaying: !state.isPlaying }))
      },

      nextTrack: () => {
        set((state) => {
          const { currentTrackIndex, tracks, isShuffled, repeatMode } = state
          let nextIndex

          if (isShuffled) {
            nextIndex = Math.floor(Math.random() * tracks.length)
          } else {
            nextIndex = currentTrackIndex < tracks.length - 1 ? currentTrackIndex + 1 : 0
          }

          return { currentTrackIndex: nextIndex }
        })
      },

      previousTrack: () => {
        set((state) => {
          const { currentTrackIndex, tracks, isShuffled } = state
          let prevIndex

          if (isShuffled) {
            prevIndex = Math.floor(Math.random() * tracks.length)
          } else {
            prevIndex = currentTrackIndex > 0 ? currentTrackIndex - 1 : tracks.length - 1
          }

          return { currentTrackIndex: prevIndex }
        })
      },

      toggleShuffle: () => {
        set((state) => ({ isShuffled: !state.isShuffled }))
      },

      toggleRepeat: () => {
        set((state) => ({ repeatMode: (state.repeatMode + 1) % 3 }))
      },

      toggleLike: () => {
        set((state) => {
          const currentTrack = state.tracks[state.currentTrackIndex]
          const newLikedTracks = new Set(state.likedTracks)

          if (newLikedTracks.has(currentTrack.id)) {
            newLikedTracks.delete(currentTrack.id)
          } else {
            newLikedTracks.add(currentTrack.id)
          }

          return { likedTracks: newLikedTracks }
        })
      },

      setVolume: (volume: number) => {
        set({ volume: Math.max(0, Math.min(1, volume)) })
      },

      setCurrentPage: (page: string) => {
        set({ currentPage: page })
      },

      setShowLyrics: (show: boolean) => {
        set({ showLyrics: show })
      },

      setShowCreatePlaylistModal: (show: boolean) => {
        set({ showCreatePlaylistModal: show })
      },

      createPlaylist: (playlistData) => {
        set((state) => ({
          playlists: [
            ...state.playlists,
            {
              ...playlistData,
              id: Date.now().toString(),
              songs: [],
              createdAt: new Date(),
            },
          ],
        }))
      },

      updatePlaylist: (id: string, updates: Partial<Playlist>) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) => (playlist.id === id ? { ...playlist, ...updates } : playlist)),
        }))
      },

      deletePlaylist: (id: string) => {
        set((state) => ({
          playlists: state.playlists.filter((playlist) => playlist.id !== id),
        }))
      },

      addSongToPlaylist: (playlistId: string, songId: number) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId ? { ...playlist, songs: [...playlist.songs, songId] } : playlist,
          ),
        }))
      },

      removeSongFromPlaylist: (playlistId: string, songId: number) => {
        set((state) => ({
          playlists: state.playlists.map((playlist) =>
            playlist.id === playlistId
              ? { ...playlist, songs: playlist.songs.filter((id) => id !== songId) }
              : playlist,
          ),
        }))
      },
    }),
    {
      name: "spotify-storage",
      partialize: (state) => ({
        likedTracks: Array.from(state.likedTracks),
        playlists: state.playlists,
        volume: state.volume,
        isShuffled: state.isShuffled,
        repeatMode: state.repeatMode,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray(state.likedTracks)) {
          state.likedTracks = new Set(state.likedTracks)
        }
      },
    },
  ),
)

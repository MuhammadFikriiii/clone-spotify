"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"

export default function LibraryPage() {
  const { playlists, likedTracks, setCurrentPage } = useSpotifyStore()

  const filters = ["Semua", "Playlist", "Artis", "Album"]

  return (
    <div className="p-6 animate-fadeIn">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6 animate-slideInUp">Pustaka Anda</h1>
        <div className="flex gap-2 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          {filters.map((filter, index) => (
            <button
              key={filter}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                index === 0 ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white hover:text-black"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Library Items */}
      <div className="space-y-2">
        {/* Liked Songs */}
        <div
          className="flex items-center gap-4 p-2 rounded hover:bg-white/10 cursor-pointer transition-all duration-200 hover:translate-x-1 animate-slideInUp"
          style={{ animationDelay: "0.2s" }}
          onClick={() => setCurrentPage("liked")}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-purple-600 to-blue-400 rounded flex items-center justify-center">
            <i className="fas fa-heart text-white text-2xl"></i>
          </div>
          <div>
            <h3 className="font-medium">Lagu yang Disukai</h3>
            <p className="text-sm text-gray-400">{likedTracks.size} lagu yang disukai</p>
          </div>
        </div>

        {/* Playlists */}
        {playlists.map((playlist, index) => (
          <div
            key={playlist.id}
            className="flex items-center gap-4 p-2 rounded hover:bg-white/10 cursor-pointer transition-all duration-200 hover:translate-x-1 animate-slideInUp"
            style={{ animationDelay: `${0.3 + index * 0.1}s` }}
            onClick={() => setCurrentPage(`playlist-${playlist.id}`)}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center">
              <i className="fas fa-music text-black text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium">{playlist.name}</h3>
              <p className="text-sm text-gray-400">{playlist.songs.length} lagu • Dibuat oleh Anda</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

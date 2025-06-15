"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import TrackList from "./TrackList"


export default function HomePage() {
  const { tracks, playTrack, setCurrentPage } = useSpotifyStore()

  const quickPicks = [
    { id: "liked", title: "Lagu yang Disukai", image: "/cover/nightchanges.jpg" },
    { id: "recent", title: "Diputar Baru-baru Ini", image: "/cover/whereweare.jpg" },
    { id: "playlist", title: "Pop Hits 2024", image: "/cover/nightchanges.jpg" },
  ]

  const featuredPlaylists = [
    { id: "daily-mix", title: "Daily Mix 1", description: "Ed Sheeran, Taylor Swift, dan lainnya", image: "/cover/nightchanges.jpg", },
    { id: "discover", title: "Discover Weekly", description: "Temukan musik baru setiap Senin", image: "/cover/whereweare.jpg" },
    { id: "release", title: "Release Radar", description: "Rilis terbaru dari artis yang Anda ikuti", image: "/cover/whereweare.jpg" },
  ]

  const handleQuickPickClick = (id: string) => {
    if (id === "liked") {
      setCurrentPage("liked")
    } else {
      playTrack(0)
    }
  }

  return (
    <div className="p-6 animate-fadeIn">
      {/* Greeting Section */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-6 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
          Welcome
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickPicks.map((pick, index) => (
            <button
              key={pick.id}
              onClick={() => handleQuickPickClick(pick.id)}
              className="flex items-center bg-white/10 rounded overflow-hidden hover:bg-white/20 transition-all duration-200 group animate-slideInUp"
              style={{ animationDelay: `${0.2 + index * 0.1}s` }}
            >
              <img src={pick.image || "/cover/whereweare.jpg"} alt={pick.title} className="w-20 h-20 object-cover" />
              <span className="flex-1 px-4 font-semibold text-left">{pick.title}</span>
              <div className="mr-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform">
                  <i className="fas fa-play"></i>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Featured Section */}
      <div className="mb-12 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Dibuat untuk Anda</h2>
          <button className="text-gray-400 hover:text-white text-sm font-semibold transition-colors">
            Lihat semua
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {featuredPlaylists.map((playlist, index) => (
            <div
              key={playlist.id}
              className="bg-gray-800 p-4 rounded-lg cursor-pointer hover:bg-gray-700 transition-all duration-200 group animate-slideInUp hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${0.1 + index * 0.1}s` }}
            >
              <div className="relative mb-4">
                <img
                  src={playlist.image}
                  alt={playlist.title}
                  className="w-full rounded-lg aspect-square object-cover"
                />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform shadow-lg">
                    <i className="fas fa-play"></i>
                  </div>
                </div>
              </div>
              <h3 className="font-semibold mb-2 truncate">{playlist.title}</h3>
              <p className="text-sm text-gray-400 line-clamp-2">{playlist.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Popular Songs */}
      <div className="animate-slideInUp" style={{ animationDelay: "0.2s" }}>
        <h2 className="text-2xl font-bold mb-6">Lagu Populer</h2>
        <TrackList tracks={tracks} />
      </div>
    </div>
  )
}

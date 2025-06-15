"use client"

import { useState } from "react"
import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import TrackList from "./TrackList"

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const { tracks } = useSpotifyStore()

  const categories = [
    { name: "Pop", color: "from-blue-800 to-blue-600" },
    { name: "Rock", color: "from-purple-600 to-pink-600" },
    { name: "Hip-Hop", color: "from-orange-600 to-orange-500" },
    { name: "Jazz", color: "from-green-700 to-green-500" },
  ]

  const filteredTracks = tracks.filter(
    (track) =>
      track.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      track.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="p-6 animate-fadeIn">
      {/* Search Header */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          <input
            type="text"
            placeholder="Apa yang ingin Anda dengarkan?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-700 rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white transition-all duration-200"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <div className="mb-8 animate-slideInUp">
          <h2 className="text-2xl font-bold mb-6">Hasil Pencarian</h2>
          <TrackList tracks={filteredTracks} />
        </div>
      )}

      {/* Browse Categories */}
      {!searchQuery && (
        <div className="animate-slideInUp">
          <h2 className="text-2xl font-bold mb-6">Jelajahi semua</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`h-32 bg-gradient-to-br ${category.color} rounded-lg p-4 cursor-pointer hover:scale-105 transition-all duration-200 animate-slideInUp`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <h3 className="text-2xl font-bold text-white">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

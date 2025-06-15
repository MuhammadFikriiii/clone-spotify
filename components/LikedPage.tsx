"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import TrackList from "./TrackList"

export default function LikedPage() {
  const { tracks, likedTracks, playTrack } = useSpotifyStore()

  const likedTracksData = tracks.filter((track) => likedTracks.has(track.id))

  const handlePlayAll = () => {
    if (likedTracksData.length > 0) {
      const firstLikedIndex = tracks.indexOf(likedTracksData[0])
      playTrack(firstLikedIndex)
    }
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 pb-0">
        <div className="w-48 h-48 md:w-58 md:h-58 bg-gradient-to-br from-purple-600 to-blue-400 rounded flex items-center justify-center flex-shrink-0 animate-slideInUp">
          <i className="fas fa-heart text-6xl md:text-8xl text-white"></i>
        </div>
        <div className="text-center md:text-left animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold uppercase text-white mb-2">PLAYLIST</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Lagu yang Disukai</h1>
          <p className="text-gray-400">{likedTracksData.length} lagu yang disukai</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-8 p-8 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-all duration-200 hover:bg-green-400 animate-pulse-green"
          disabled={likedTracksData.length === 0}
        >
          <i className="fas fa-play text-xl"></i>
        </button>
        <button className="text-gray-400 hover:text-white text-2xl transition-colors">
          <i className="fas fa-ellipsis-h"></i>
        </button>
      </div>

      {/* Track List */}
      <div className="px-8 pb-8 animate-slideInUp" style={{ animationDelay: "0.3s" }}>
        {likedTracksData.length > 0 ? (
          <TrackList tracks={likedTracksData} />
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-heart text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Belum ada lagu yang disukai</h3>
            <p className="text-gray-400">Mulai suka lagu untuk melihatnya di sini</p>
          </div>
        )}
      </div>
    </div>
  )
}

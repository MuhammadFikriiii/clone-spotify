"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"

interface TrackListProps {
  tracks: any[]
  showRemoveButton?: boolean
  onRemove?: (trackId: number) => void
}

export default function TrackList({ tracks, showRemoveButton = false, onRemove }: TrackListProps) {
  const { currentTrackIndex, isPlaying, playTrack, tracks: allTracks } = useSpotifyStore()

  const handleTrackClick = (track: any) => {
    const trackIndex = allTracks.findIndex((t) => t.id === track.id)
    if (trackIndex !== -1) {
      playTrack(trackIndex)
    }
  }

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => {
        const isCurrentTrack = allTracks[currentTrackIndex]?.id === track.id

        return (
          <div
            key={track.id}
            className={`
              grid grid-cols-[40px_1fr_auto_auto] md:grid-cols-[40px_1fr_1fr_auto] gap-4 p-2 rounded hover:bg-white/10 cursor-pointer transition-all duration-200 group animate-fadeIn
              ${isCurrentTrack ? "bg-white/20" : ""}
            `}
            style={{ animationDelay: `${index * 0.05}s` }}
            onClick={() => handleTrackClick(track)}
          >
            {/* Track Number / Play Icon */}
            <div className="flex items-center justify-center">
              {isCurrentTrack && isPlaying ? (
                <i className="fas fa-volume-up text-green-500"></i>
              ) : (
                <>
                  <span className="group-hover:hidden text-gray-400">{index + 1}</span>
                  <i className="fas fa-play hidden group-hover:block text-white"></i>
                </>
              )}
            </div>

            {/* Track Info */}
            <div className="flex items-center gap-3 min-w-0">
              <img
                src={track.cover || "/placeholder.svg"}
                alt={track.title}
                className="w-10 h-10 rounded object-cover"
              />
              <div className="min-w-0">
                <div className={`font-medium truncate ${isCurrentTrack ? "text-green-500" : "text-white"}`}>
                  {track.title}
                </div>
                <div className="text-sm text-gray-400 truncate">{track.artist}</div>
              </div>
            </div>

            {/* Album (hidden on mobile) */}
            <div className="hidden md:flex items-center text-sm text-gray-400 truncate">{track.album}</div>

            {/* Duration & Actions */}
            <div className="flex items-center gap-2">
              {showRemoveButton && onRemove && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onRemove(track.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-red-500 transition-all"
                >
                  <i className="fas fa-times text-sm"></i>
                </button>
              )}
              <span className="text-sm text-gray-400">{track.duration}</span>
            </div>
          </div>
        )
      })}
    </div>
  )
}

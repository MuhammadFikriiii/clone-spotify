"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import { useState, useEffect } from "react"

export default function LyricsPanel() {
  const { tracks, currentTrackIndex, showLyrics, setShowLyrics } = useSpotifyStore()

  const [currentLyricIndex, setCurrentLyricIndex] = useState(-1)
  const [currentTime, setCurrentTime] = useState(0)

  const currentTrack = tracks[currentTrackIndex]

  useEffect(() => {
    const updateTime = () => {
      const audio = document.querySelector("audio") as HTMLAudioElement
      if (audio) {
        setCurrentTime(audio.currentTime)
      }
    }

    const interval = setInterval(updateTime, 100)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (!currentTrack?.lyrics) return

    let activeIndex = -1
    for (let i = 0; i < currentTrack.lyrics.length; i++) {
      if (currentTime >= currentTrack.lyrics[i].time) {
        activeIndex = i
      } else {
        break
      }
    }

    if (activeIndex !== currentLyricIndex) {
      setCurrentLyricIndex(activeIndex)
    }
  }, [currentTime, currentTrack?.lyrics, currentLyricIndex])

  const handleLyricClick = (time: number) => {
    const audio = document.querySelector("audio") as HTMLAudioElement
    if (audio) {
      audio.currentTime = time
    }
  }

  if (!showLyrics) return null

  return (
    <div
      className={`
      fixed top-0 right-0 w-96 h-full bg-gray-900 border-l border-gray-700 z-50 flex flex-col
      transform transition-transform duration-300 ease-in-out
      ${showLyrics ? "translate-x-0" : "translate-x-full"}
    `}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-700">
        <h3 className="text-xl font-bold">Lirik</h3>
        <button onClick={() => setShowLyrics(false)} className="text-gray-400 hover:text-white transition-colors p-2">
          <i className="fas fa-times text-xl"></i>
        </button>
      </div>

      {/* Lyrics Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {currentTrack?.lyrics ? (
          <div className="space-y-4">
            {currentTrack.lyrics.map((line, index) => (
              <div
                key={index}
                onClick={() => handleLyricClick(line.time)}
                className={`
                  p-3 rounded-lg cursor-pointer transition-all duration-300 transform
                  ${
                    index === currentLyricIndex
                      ? "text-green-500 font-semibold bg-green-500/10 scale-105 translate-x-2"
                      : "text-gray-300 hover:text-white hover:bg-white/5"
                  }
                  animate-fadeIn
                `}
                style={{
                  animationDelay: `${index * 0.1}s`,
                  fontSize: index === currentLyricIndex ? "18px" : "16px",
                }}
              >
                {line.text}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 mt-20">
            <i className="fas fa-microphone-alt text-6xl mb-4 opacity-50"></i>
            <p className="text-lg">Lirik tidak tersedia untuk lagu ini</p>
          </div>
        )}
      </div>
    </div>
  )
}

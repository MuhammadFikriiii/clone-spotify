"use client"

import type React from "react"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import { useState, useEffect, useRef } from "react"

export default function Player() {
  const {
    tracks,
    currentTrackIndex,
    isPlaying,
    isShuffled,
    repeatMode,
    volume,
    likedTracks,
    playTrack,
    togglePlay,
    nextTrack,
    previousTrack,
    toggleShuffle,
    toggleRepeat,
    toggleLike,
    setVolume,
    showLyrics,
    setShowLyrics,
  } = useSpotifyStore()

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const currentTrack = tracks[currentTrackIndex]
  const isLiked = currentTrack ? likedTracks.has(currentTrack.id) : false

  // Audio event handlers (sama seperti sebelumnya)
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !currentTrack) return

    audio.src = currentTrack.src
    audio.load()

    const handleLoadedMetadata = () => setDuration(audio.duration)
    const handleTimeUpdate = () => {
      if (!isDragging) setCurrentTime(audio.currentTime)
    }
    const handleEnded = () => {
      if (repeatMode === 2) {
        audio.currentTime = 0
        audio.play()
      } else if (repeatMode === 1 || currentTrackIndex < tracks.length - 1) {
        nextTrack()
      }
    }

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentTrack, repeatMode, currentTrackIndex, tracks.length, nextTrack, isDragging])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.play().catch(console.error)
    } else {
      audio.pause()
    }
  }, [isPlaying])

  useEffect(() => {
    const audio = audioRef.current
    if (audio) audio.volume = volume
  }, [volume])

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current
    if (!audio || !duration) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    const newTime = percent * duration
    audio.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setVolume(Math.max(0, Math.min(1, percent)))
  }

  const getVolumeIcon = () => {
    if (volume === 0) return "fas fa-volume-mute"
    if (volume < 0.5) return "fas fa-volume-down"
    return "fas fa-volume-up"
  }

  const getRepeatIcon = () => {
    switch (repeatMode) {
      case 1:
        return "fas fa-redo"
      case 2:
        return "fas fa-redo-alt"
      default:
        return "fas fa-redo"
    }
  }

  if (!currentTrack) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center border-t border-gray-700">
        <p className="text-gray-400">Pilih lagu untuk diputar</p>
      </div>
    )
  }

  return (
    <>
      <audio ref={audioRef} preload="metadata" />
      {/* Player - Layout asli Spotify */}
      <div className="bg-gray-800 rounded-lg border-t border-gray-700 flex items-center justify-between px-4 py-3">
        {/* Left Section - Track Info */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <img
            src={currentTrack.cover || "/placeholder.svg?height=56&width=56"}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0">
            <div className="font-normal text-white text-sm truncate">{currentTrack.title}</div>
            <div className="text-xs text-gray-400 truncate">{currentTrack.artist}</div>
          </div>
          <button
            onClick={toggleLike}
            className={`p-2 transition-colors ${isLiked ? "text-green-500" : "text-gray-400 hover:text-white"}`}
          >
            <i className={isLiked ? "fas fa-heart" : "far fa-heart"}></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-external-link-alt"></i>
          </button>
        </div>

        {/* Center Section - Controls */}
        <div className="flex flex-col items-center gap-2 flex-2 max-w-2xl">
          {/* Control Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={toggleShuffle}
              className={`p-2 transition-colors ${isShuffled ? "text-green-500" : "text-gray-400 hover:text-white"}`}
            >
              <i className="fas fa-random"></i>
            </button>
            <button onClick={previousTrack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-step-backward"></i>
            </button>
            <button
              onClick={togglePlay}
              className="w-8 h-8 bg-white rounded-full flex items-center justify-center text-black hover:scale-105 transition-transform"
            >
              <i className={`${isPlaying ? "fas fa-pause" : "fas fa-play"} text-sm`}></i>
            </button>
            <button onClick={nextTrack} className="p-2 text-gray-400 hover:text-white transition-colors">
              <i className="fas fa-step-forward"></i>
            </button>
            <button
              onClick={toggleRepeat}
              className={`p-2 transition-colors relative ${
                repeatMode > 0 ? "text-green-500" : "text-gray-400 hover:text-white"
              }`}
            >
              <i className="fas fa-redo"></i>
              {repeatMode === 2 && (
                <span className="absolute -top-1 -right-1 text-xs bg-green-500 text-black rounded-full w-3 h-3 flex items-center justify-center text-[10px]">
                  1
                </span>
              )}
            </button>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-3 w-full">
            <span className="text-xs text-gray-400 min-w-[40px] text-center font-normal">
              {formatTime(currentTime)}
            </span>
            <div
              className="flex-1 h-1 bg-gray-600 rounded-full cursor-pointer group relative"
              onClick={handleProgressClick}
            >
              <div
                className="h-full bg-white rounded-full group-hover:bg-green-500 transition-colors"
                style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${duration ? (currentTime / duration) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 min-w-[40px] text-center font-normal">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right Section - Volume & Controls */}
        <div className="flex items-center gap-4 flex-1 justify-end">
          <button
            onClick={() => setShowLyrics(!showLyrics)}
            className={`p-2 transition-colors ${showLyrics ? "text-green-500" : "text-gray-400 hover:text-white"}`}
          >
            <i className="fas fa-microphone-alt"></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-list"></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-desktop"></i>
          </button>
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setVolume(volume === 0 ? 1 : 0)}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <i className={getVolumeIcon()}></i>
            </button>
            <div
              className="w-24 h-1 bg-gray-600 rounded-full cursor-pointer group relative"
              onClick={handleVolumeClick}
            >
              <div
                className="h-full bg-white rounded-full group-hover:bg-green-500 transition-colors"
                style={{ width: `${volume * 100}%` }}
              />
              <div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ left: `${volume * 100}%` }}
              />
            </div>
          </div>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <i className="fas fa-expand"></i>
          </button>
        </div>
      </div>
    </>
  )
}

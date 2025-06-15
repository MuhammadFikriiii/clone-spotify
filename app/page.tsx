"use client"

import { useState, useEffect } from "react"
import Sidebar from "@/components/Sidebar"
import MainContent from "@/components/MainContent"
import Player from "@/components/Player"
import LyricsPanel from "@/components/LyricsPanel"
import CreatePlaylistModal from "@/components/CreatePlaylistModal"
import { useSpotifyStore } from "@/hooks/useSpotifyStore"

export default function SpotifyClone() {
  const [isMobile, setIsMobile] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { initializeStore } = useSpotifyStore()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    initializeStore()

    return () => window.removeEventListener("resize", checkMobile)
  }, [initializeStore])

  return (
    <div className="h-screen bg-black text-white overflow-hidden">
      {/* Mobile Header */}
      {isMobile && (
        <div className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 bg-gray-900 border-b border-gray-800">
          <button onClick={() => setSidebarOpen(true)} className="text-white hover:text-green-500 transition-colors">
            <i className="fas fa-bars text-xl"></i>
          </button>
          <div className="flex items-center gap-3">
            <i className="fab fa-spotify text-green-500 text-2xl"></i>
            <span className="text-xl font-bold">Spotify Clone</span>
          </div>
          <button className="text-white hover:text-green-500 transition-colors">
            <i className="fas fa-search text-xl"></i>
          </button>
        </div>
      )}

      {/* Main Layout - Grid seperti aslinya */}
      <div
        className={`grid h-full gap-2 p-2 bg-black ${
          isMobile ? "pt-20 grid-rows-[1fr_90px] grid-cols-1" : "grid-cols-[240px_1fr] grid-rows-[1fr_90px]"
        }`}
      >
        {/* Sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} isMobile={isMobile} />

        {/* Main Content */}
        <MainContent />

        {/* Player - span full width */}
        <div className={`${isMobile ? "col-span-1" : "col-span-2"}`}>
          <Player />
        </div>
      </div>

      <LyricsPanel />
      <CreatePlaylistModal />
    </div>
  )
}

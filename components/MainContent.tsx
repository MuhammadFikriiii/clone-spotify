"use client"

import Image from "next/image"
import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import HomePage from "../components/HomePage"
import SearchPage from "../components/SearchPage"
import LibraryPage from "../components/LibraryPage"
import LikedPage from "../components/LikedPage"
import PlaylistPage from "../components/PlaylistPage"

export default function MainContent() {
  const { currentPage } = useSpotifyStore()

  const renderPage = () => {
    if (currentPage.startsWith("playlist-")) {
      const playlistId = currentPage.replace("playlist-", "")
      return <PlaylistPage playlistId={playlistId} />
    }

    switch (currentPage) {
      case "home":
        return <HomePage />
      case "search":
        return <SearchPage />
      case "library":
        return <LibraryPage />
      case "liked":
        return <LikedPage />
      default:
        return <HomePage />
    }
  }

  return (
    <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg overflow-hidden flex flex-col">
      {/* Header - seperti Spotify asli */}
      <div className="flex justify-between items-center p-4 bg-gray-900 bg-opacity-80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex gap-4">
          <button className="w-8 h-8 rounded-full bg-black bg-opacity-70 text-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-all duration-200 disabled:opacity-60">
            <i className="fas fa-chevron-left"></i>
          </button>
          <button className="w-8 h-8 rounded-full bg-black bg-opacity-70 text-white flex items-center justify-center hover:bg-white hover:bg-opacity-10 transition-all duration-200 disabled:opacity-60">
            <i className="fas fa-chevron-right"></i>
          </button>
        </div>
        <button className="flex items-center gap-2 bg-black bg-opacity-70 rounded-full px-2 py-1 hover:bg-white hover:bg-opacity-10 transition-all duration-200">
          <div className="relative w-7 h-7">
            <Image
              src="/profil/pp.png"
              alt="Profile"
              layout="fill"
              objectFit="cover"
              className="rounded-full"
            />
          </div>
          <span className="font-semibold text-sm hidden sm:block">User</span>
          <i className="fas fa-chevron-down text-sm"></i>
        </button>
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin">{renderPage()}</div>
    </div>
  )
}

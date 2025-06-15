"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import { useState } from "react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  isMobile: boolean
}

export default function Sidebar({ isOpen, onClose, isMobile }: SidebarProps) {
  const { currentPage, setCurrentPage, playlists, setShowCreatePlaylistModal, deletePlaylist } = useSpotifyStore()

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const navItems = [
    { id: "home", label: "Beranda", icon: "fas fa-home" },
    { id: "search", label: "Cari", icon: "fas fa-search" },
    { id: "library", label: "Pustaka Anda", icon: "fas fa-book" },
  ]

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId)
    if (isMobile) onClose()
  }

  const handleDeletePlaylist = (playlistId: string) => {
    deletePlaylist(playlistId)
    setShowDeleteConfirm(null)
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />}

      {/* Sidebar - Warna asli Spotify */}
      <div
        className={`
        ${isMobile ? "fixed top-0 left-0 h-full w-72 z-50" : "relative"}
        bg-gray-900 rounded-lg flex flex-col overflow-hidden
        transition-transform duration-300 ease-in-out
        ${isMobile && !isOpen ? "-translate-x-full" : "translate-x-0"}
      `}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="p-6 flex-shrink-0">
            <div className="flex justify-between items-center mb-8">
              <div className="flex items-center gap-3">
                <i className="fab fa-spotify text-green-500 text-2xl"></i>
                <span className="text-2xl font-bold">Spotify</span>
              </div>
              {isMobile && (
                <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                  <i className="fas fa-times text-xl"></i>
                </button>
              )}
            </div>

            {/* Navigation */}
            <nav className="mb-6">
              <ul className="space-y-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => handleNavClick(item.id)}
                      className={`
                        flex items-center gap-4 w-full p-3 rounded text-sm font-medium transition-all duration-200
                        hover:text-white
                        ${currentPage === item.id ? "text-white" : "text-gray-400"}
                      `}
                    >
                      <i className={`${item.icon} text-2xl w-6`}></i>
                      <span>{item.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Playlist Section */}
          <div className="flex-1 px-3 pb-6 overflow-hidden flex flex-col">
            <div className="mb-6 space-y-2">
              <button
                onClick={() => setShowCreatePlaylistModal(true)}
                className="flex items-center gap-4 w-full p-3 text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                <i className="fas fa-plus text-2xl w-6"></i>
                <span>Buat Playlist</span>
              </button>
              <button
                onClick={() => handleNavClick("liked")}
                className="flex items-center gap-4 w-full p-3 text-gray-400 hover:text-white transition-colors text-sm font-medium"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-purple-600 to-blue-400 rounded flex items-center justify-center">
                  <i className="fas fa-heart text-white text-sm"></i>
                </div>
                <span>Lagu yang Disukai</span>
              </button>
            </div>

            {/* Playlists */}
            <div className="border-t border-gray-700 pt-4 flex-1 overflow-hidden">
              <div className="overflow-y-auto flex-1 pr-1 scrollbar-thin">
                {playlists.map((playlist) => (
                  <div key={playlist.id} className="group relative">
                    <button
                      onClick={() => handleNavClick(`playlist-${playlist.id}`)}
                      className="flex items-center gap-3 w-full p-2 rounded text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-10 transition-all duration-200 text-sm"
                    >
                      <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center flex-shrink-0">
                        <i className="fas fa-music text-white text-xs"></i>
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="font-normal truncate">{playlist.name}</div>
                        <div className="text-xs text-gray-500 truncate">Playlist • {playlist.songs.length} lagu</div>
                      </div>
                    </button>

                    {/* Delete button */}
                    <button
                      onClick={() => setShowDeleteConfirm(playlist.id)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all duration-200 p-1"
                    >
                      <i className="fas fa-trash text-xs"></i>
                    </button>

                    {/* Delete confirmation */}
                    {showDeleteConfirm === playlist.id && (
                      <div className="absolute right-0 top-0 bg-gray-800 rounded p-2 shadow-lg z-10">
                        <p className="text-xs mb-2">Hapus playlist?</p>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleDeletePlaylist(playlist.id)}
                            className="px-2 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700"
                          >
                            Ya
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-2 py-1 bg-gray-600 text-white text-xs rounded hover:bg-gray-700"
                          >
                            Batal
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

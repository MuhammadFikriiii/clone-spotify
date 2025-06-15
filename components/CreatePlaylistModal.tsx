"use client"

import type React from "react"

import { useState } from "react"
import { useSpotifyStore } from "@/hooks/useSpotifyStore"

export default function CreatePlaylistModal() {
  const { showCreatePlaylistModal, setShowCreatePlaylistModal, createPlaylist } = useSpotifyStore()

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [coverPreview, setCoverPreview] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    createPlaylist({
      name: name.trim(),
      description: description.trim() || "Playlist pribadi",
      cover: coverPreview || "/placeholder.svg?height=300&width=300",
    })

    // Reset form
    setName("")
    setDescription("")
    setCoverPreview(null)
    setShowCreatePlaylistModal(false)
  }

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCoverPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleClose = () => {
    setName("")
    setDescription("")
    setCoverPreview(null)
    setShowCreatePlaylistModal(false)
  }

  if (!showCreatePlaylistModal) return null

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-gray-800 rounded-lg p-8 w-full max-w-md animate-slideInUp">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Buat Playlist</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-white transition-colors p-2">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Upload */}
          <div>
            <label className="block text-sm font-semibold mb-2">Cover Playlist</label>
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center overflow-hidden">
                {coverPreview ? (
                  <img src={coverPreview || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
                ) : (
                  <i className="fas fa-music text-black text-2xl"></i>
                )}
              </div>
              <div>
                <label className="cursor-pointer px-4 py-2 border border-gray-400 rounded hover:border-white transition-colors text-sm">
                  Pilih foto
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
                <p className="text-xs text-gray-400 mt-2">Minimal 300 x 300 piksel</p>
              </div>
            </div>
          </div>

          {/* Name Input */}
          <div>
            <label htmlFor="playlistName" className="block text-sm font-semibold mb-2">
              Nama Playlist
            </label>
            <input
              type="text"
              id="playlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Playlist Saya"
              className="w-full p-3 bg-gray-700 border-2 border-transparent rounded focus:border-green-500 focus:bg-gray-600 outline-none transition-all"
              required
            />
          </div>

          {/* Description Input */}
          <div>
            <label htmlFor="playlistDescription" className="block text-sm font-semibold mb-2">
              Deskripsi
            </label>
            <textarea
              id="playlistDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan deskripsi opsional"
              rows={3}
              className="w-full p-3 bg-gray-700 border-2 border-transparent rounded focus:border-green-500 focus:bg-gray-600 outline-none transition-all resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 border border-gray-400 rounded-full hover:border-white transition-all hover:scale-105"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-all hover:scale-105"
            >
              Buat
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

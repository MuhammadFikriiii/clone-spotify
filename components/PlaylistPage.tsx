"use client"

import { useSpotifyStore } from "@/hooks/useSpotifyStore"
import TrackList from "./TrackList"
import { useState } from "react"

interface PlaylistPageProps {
  playlistId: string
}

export default function PlaylistPage({ playlistId }: PlaylistPageProps) {
  const { playlists, tracks, playTrack, updatePlaylist, addSongToPlaylist, removeSongFromPlaylist } = useSpotifyStore()

  const [showAddSongs, setShowAddSongs] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState("")
  const [editDescription, setEditDescription] = useState("")

  const playlist = playlists.find((p) => p.id === playlistId)

  if (!playlist) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Playlist tidak ditemukan</h2>
        <p className="text-gray-400">Playlist yang Anda cari mungkin telah dihapus.</p>
      </div>
    )
  }

  const playlistTracks = tracks.filter((track) => playlist.songs.includes(track.id))
  const availableTracks = tracks.filter((track) => !playlist.songs.includes(track.id))

  const handlePlayAll = () => {
    if (playlistTracks.length > 0) {
      const firstTrackIndex = tracks.indexOf(playlistTracks[0])
      playTrack(firstTrackIndex)
    }
  }

  const handleEditPlaylist = () => {
    if (isEditing) {
      updatePlaylist(playlistId, {
        name: editName || playlist.name,
        description: editDescription || playlist.description,
      })
    } else {
      setEditName(playlist.name)
      setEditDescription(playlist.description)
    }
    setIsEditing(!isEditing)
  }

  const handleAddSong = (trackId: number) => {
    addSongToPlaylist(playlistId, trackId)
  }

  const handleRemoveSong = (trackId: number) => {
    removeSongFromPlaylist(playlistId, trackId)
  }

  return (
    <div className="animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 p-8 pb-0">
        <div className="w-48 h-48 md:w-58 md:h-58 bg-gradient-to-br from-green-500 to-green-600 rounded flex items-center justify-center flex-shrink-0 animate-slideInUp">
          <i className="fas fa-music text-6xl md:text-8xl text-black"></i>
        </div>
        <div className="text-center md:text-left flex-1 animate-slideInUp" style={{ animationDelay: "0.1s" }}>
          <p className="text-xs font-semibold uppercase text-white mb-2">PLAYLIST</p>
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="text-3xl md:text-5xl font-bold bg-transparent border-b border-gray-400 focus:border-white outline-none"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-gray-400 bg-transparent border-b border-gray-400 focus:border-white outline-none resize-none"
                rows={2}
              />
            </div>
          ) : (
            <>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{playlist.name}</h1>
              <p className="text-gray-400 mb-2">{playlist.description}</p>
              <p className="text-gray-400">{playlistTracks.length} lagu</p>
            </>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4 p-8 animate-slideInUp" style={{ animationDelay: "0.2s" }}>
        <button
          onClick={handlePlayAll}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-black hover:scale-105 transition-all duration-200 hover:bg-green-400"
          disabled={playlistTracks.length === 0}
        >
          <i className="fas fa-play text-xl"></i>
        </button>
        <button
          onClick={handleEditPlaylist}
          className="px-4 py-2 border border-gray-400 rounded-full text-sm font-semibold hover:border-white transition-colors"
        >
          {isEditing ? "Simpan" : "Edit"}
        </button>
        <button
          onClick={() => setShowAddSongs(!showAddSongs)}
          className="px-4 py-2 border border-gray-400 rounded-full text-sm font-semibold hover:border-white transition-colors"
        >
          {showAddSongs ? "Tutup" : "Tambah Lagu"}
        </button>
      </div>

      {/* Add Songs Section */}
      {showAddSongs && (
        <div className="px-8 mb-8 animate-slideInUp">
          <h3 className="text-xl font-bold mb-4">Tambah Lagu ke Playlist</h3>
          <div className="space-y-2">
            {availableTracks.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center justify-between p-3 hover:bg-white/10 rounded transition-colors animate-fadeIn"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center gap-3">
                  <img src={track.cover || "/placeholder.svg"} alt={track.title} className="w-10 h-10 rounded" />
                  <div>
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-gray-400">{track.artist}</div>
                  </div>
                </div>
                <button
                  onClick={() => handleAddSong(track.id)}
                  className="w-8 h-8 rounded-full border border-gray-400 flex items-center justify-center hover:border-white hover:bg-white/10 transition-all"
                >
                  <i className="fas fa-plus text-sm"></i>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track List */}
      <div className="px-8 pb-8 animate-slideInUp" style={{ animationDelay: "0.3s" }}>
        {playlistTracks.length > 0 ? (
          <TrackList tracks={playlistTracks} showRemoveButton={true} onRemove={handleRemoveSong} />
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-music text-6xl text-gray-600 mb-4"></i>
            <h3 className="text-xl font-semibold mb-2">Playlist kosong</h3>
            <p className="text-gray-400">Tambahkan lagu untuk mulai mendengarkan</p>
          </div>
        )}
      </div>
    </div>
  )
}

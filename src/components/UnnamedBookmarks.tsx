import React, { useState, useEffect } from 'react'
import { Bookmark, deleteBookmark, reorderBookmarks } from '../services/bookmarkService'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Edit, X, Move, Check } from 'lucide-react'
import { motion, AnimatePresence } from "framer-motion"

interface UnnamedBookmarksProps {
  bookmarks: Bookmark[]
  onBookmarksChange: () => void
}

const INITIAL_DISPLAY_COUNT = 12

export const UnnamedBookmarks: React.FC<UnnamedBookmarksProps> = ({ 
  bookmarks, 
  onBookmarksChange
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [displayedBookmarks, setDisplayedBookmarks] = useState<Bookmark[]>([])
  const [draggedBookmark, setDraggedBookmark] = useState<Bookmark | null>(null)
  const [faviconSources, setFaviconSources] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setDisplayedBookmarks(isExpanded ? bookmarks : bookmarks.slice(0, INITIAL_DISPLAY_COUNT))
  }, [bookmarks, isExpanded])

  useEffect(() => {
    const loadFavicons = async () => {
      const sources: {[key: string]: string} = {}
      for (const bookmark of displayedBookmarks) {
        sources[bookmark.id] = await getFaviconOrInitials(bookmark.url)
      }
      setFaviconSources(sources)
    }
    loadFavicons()
  }, [displayedBookmarks])

  const getFaviconOrInitials = async (url: string): Promise<string> => {
    try {
      const response = await fetch(`https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=128`)
      if (response.ok) {
        return `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=128`
      }
    } catch (error) {
      console.error("Error fetching favicon:", error)
    }
    
    const domain = new URL(url).hostname
    const initials = domain.split('.')[0].slice(0, 2).toUpperCase()
    return `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" fill="%23${Math.floor(Math.random()*16777215).toString(16)}"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family="Arial" font-size="64" fill="white">${initials}</text></svg>`
  }

  const handleDragStart = (bookmark: Bookmark) => {
    setDraggedBookmark(bookmark)
  }

  const handleDragOver = (e: React.DragEvent, targetBookmark: Bookmark) => {
    e.preventDefault()
    if (draggedBookmark && draggedBookmark.id !== targetBookmark.id) {
      const newBookmarks = displayedBookmarks.filter(b => b.id !== draggedBookmark.id)
      const targetIndex = newBookmarks.findIndex(b => b.id === targetBookmark.id)
      newBookmarks.splice(targetIndex, 0, draggedBookmark)
      setDisplayedBookmarks(newBookmarks)
    }
  }

  const handleDragEnd = () => {
    setDraggedBookmark(null)
  }

  const handleSaveEdit = async () => {
    try {
      await reorderBookmarks(displayedBookmarks)
      setIsEditing(false)
      onBookmarksChange()
    } catch (error) {
      console.error("Error saving edits:", error)
      // You might want to show an error message to the user here
    }
  }

  const handleCancelEdit = () => {
    setDisplayedBookmarks(isExpanded ? bookmarks : bookmarks.slice(0, INITIAL_DISPLAY_COUNT))
    setIsEditing(false)
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteBookmark(id)
      setDisplayedBookmarks(displayedBookmarks.filter(b => b.id !== id))
      onBookmarksChange()
    } catch (error) {
      console.error("Error deleting bookmark:", error)
      // You might want to show an error message to the user here
    }
  }

  return (
    <div className="mb-6 relative">
      {isEditing ? (
        <div className="absolute right-0 top-0 z-10 space-x-2">
          <Button variant="ghost" size="sm" onClick={handleSaveEdit}>
            <Check size={16} className="mr-1" /> Save
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
            <X size={16} className="mr-1" /> Cancel
          </Button>
        </div>
      ) : (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="absolute right-0 top-0 z-10"
        >
          <Edit size={16} className="mr-1" /> Edit
        </Button>
      )}
      <AnimatePresence>
        <motion.div layout className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 mt-8">
          {displayedBookmarks.map((bookmark) => (
            <motion.div
              key={bookmark.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
              className={`flex flex-col items-center justify-center p-4 rounded-lg ${isEditing ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} transition-colors duration-200 cursor-pointer relative shadow-md`}
              onClick={() => !isEditing && chrome.tabs.create({ url: bookmark.url })}
              draggable={isEditing}
              onDragStart={() => handleDragStart(bookmark)}
              onDragOver={(e) => handleDragOver(e, bookmark)}
              onDragEnd={handleDragEnd}
            >
              <img
                src={faviconSources[bookmark.id] || ''}
                alt=""
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover"
              />
              <span className="text-xs text-center truncate w-full mt-2 hidden sm:block">
                {new URL(bookmark.url).hostname}
              </span>
              {isEditing && (
                <>
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full shadow-lg"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(bookmark.id)
                    }}
                  >
                    <X size={12} />
                  </Button>
                  <Move size={16} className="absolute top-1 left-1 text-gray-400" />
                </>
              )}
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      {bookmarks.length > INITIAL_DISPLAY_COUNT && (
        <div className="flex justify-center mt-4">
          <Button
            variant="ghost"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="mr-2" size={16} />
                Show Less
              </>
            ) : (
              <>
                <ChevronDown className="mr-2" size={16} />
                Show More ({bookmarks.length - INITIAL_DISPLAY_COUNT})
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
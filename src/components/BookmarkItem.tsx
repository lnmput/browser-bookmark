// src/components/BookmarkItem.tsx

import React, { useState, useEffect } from 'react'
import { Bookmark } from '../services/bookmarkService'
import { Button } from "@/components/ui/button"
import { Edit, Trash2 } from 'lucide-react'
import { FolderIcon } from './FolderIcon'

interface BookmarkItemProps {
  bookmark: Bookmark
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
  level: number
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  onEdit,
  onDelete,
  level
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [favicon, setFavicon] = useState('')

  useEffect(() => {
    if (bookmark.url) {
      const img = new Image()
      img.onload = () => setFavicon(`https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.url}`)
      img.onerror = () => setFavicon('default-icon.png') // 使用一个默认图标
      img.src = `https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.url}`
    }
  }, [bookmark.url])

  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (bookmark.children && bookmark.children.length > 0) {
      setIsExpanded(!isExpanded)
    }
  }

  const handleClick = () => {
    if (bookmark.url) {
      chrome.tabs.create({ url: bookmark.url })
    } else {
      toggleExpand({ preventDefault: () => {}, stopPropagation: () => {} } as React.MouseEvent)
    }
  }

  const isSystemFolder = level === 0 && !bookmark.url
  const bookmarkCount = bookmark.children ? bookmark.children.length : 0

  if (bookmark.url && (!bookmark.title || bookmark.title.trim() === '')) {
    return null
  }

  return (
    <div>
      <div 
        className={`flex items-center p-2 rounded-lg transition-all duration-300 ease-in-out cursor-pointer
                    ${isHovered ? 'bg-white/10' : 'hover:bg-white/5'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
      >
        {bookmark.children && bookmark.children.length > 0 ? (
          <FolderIcon className={`w-4 h-4 mr-2 ${isExpanded ? 'text-yellow-400' : 'text-gray-400'}`} />
        ) : (
          <img 
            src={favicon || 'default-icon.png'}
            alt="" 
            className="w-4 h-4 mr-2"
          />
        )}
        <span className="truncate flex-grow">{bookmark.title}</span>
        {bookmark.children && (
          <span className="text-sm text-gray-400 mr-2">{bookmarkCount}</span>
        )}
        {!isSystemFolder && (
          <div 
            className={`flex transition-opacity duration-300 ease-in-out 
                        ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onEdit(bookmark)
              }}
              className="mr-1"
            >
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(bookmark.id)
              }}
            >
              <Trash2 size={16} />
            </Button>
          </div>
        )}
      </div>
      {isExpanded && bookmark.children && (
        <div className="ml-4 transition-all duration-300 ease-in-out">
          {bookmark.children.map((child) => (
            <BookmarkItem
              key={child.id}
              bookmark={child}
              onEdit={onEdit}
              onDelete={onDelete}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
// src/components/BookmarkTree.tsx

import React, { useState, useMemo } from 'react'
import { Bookmark } from '../services/bookmarkService'
import { BookmarkItem } from './BookmarkItem'
import { UnnamedBookmarks } from './UnnamedBookmarks'
import { SearchBar } from './SearchBar'
import { Card, CardContent } from "@/components/ui/card"

interface BookmarkTreeProps {
  bookmarks: Bookmark[]
  onEdit: (bookmark: Bookmark) => void
  onDelete: (id: string) => void
}

export const BookmarkTree: React.FC<BookmarkTreeProps> = ({
  bookmarks,
  onEdit,
  onDelete
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const specialFolder = bookmarks[0]

  const flattenBookmarks = (items: Bookmark[]): Bookmark[] => {
    return items.reduce((acc: Bookmark[], item) => {
      if (item.url) {
        acc.push(item)
      }
      if (item.children) {
        acc.push(...flattenBookmarks(item.children))
      }
      return acc
    }, [])
  }

  const allBookmarks = useMemo(() => flattenBookmarks(specialFolder.children || []), [specialFolder])

  const filteredBookmarks = useMemo(() => {
    if (!searchQuery) return []
    return allBookmarks.filter(bookmark => 
      (bookmark.title && bookmark.title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (bookmark.url && bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }, [allBookmarks, searchQuery])

  const unnamedBookmarks = useMemo(() => {
    return allBookmarks.filter(bookmark => !bookmark.title || bookmark.title.trim() === '')
  }, [allBookmarks])

  const [firstFolder, ...otherFolders] = specialFolder.children || []

  const allFolders = [
    ...(firstFolder?.children?.filter(item => item.children) || []),
    ...otherFolders
  ]

  const directBookmarks = firstFolder?.children?.filter(item => item.url) || []

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 dark:from-gray-800 dark:to-gray-900 backdrop-blur-lg border-none shadow-lg">
      <CardContent className="p-4">
        <SearchBar onSearch={setSearchQuery} />
        {!searchQuery && <UnnamedBookmarks bookmarks={unnamedBookmarks} />}
        
        {searchQuery ? (
          filteredBookmarks.map((bookmark) => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={onEdit}
              onDelete={onDelete}
              level={0}
            />
          ))
        ) : (
          <>
            {allFolders.map((folder) => (
              <BookmarkItem
                key={folder.id}
                bookmark={folder}
                onEdit={onEdit}
                onDelete={onDelete}
                level={0}
              />
            ))}
            {directBookmarks.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onEdit={onEdit}
                onDelete={onDelete}
                level={0}
              />
            ))}
          </>
        )}
      </CardContent>
    </Card>
  )
}
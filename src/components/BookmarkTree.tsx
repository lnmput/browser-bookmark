// src/components/BookmarkTree.tsx

import React from 'react'
import { Bookmark } from '../services/bookmarkService'
import { BookmarkItem } from './BookmarkItem'
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
  // 过滤掉顶层文件夹，只显示其子项
  const flattenedBookmarks = bookmarks.flatMap(bookmark => bookmark.children || [])

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-none shadow-lg">
      <CardContent className="p-4">
        {flattenedBookmarks.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        ))}
      </CardContent>
    </Card>
  )
}
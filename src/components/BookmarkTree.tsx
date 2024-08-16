// src/components/BookmarkTree.tsx

import React from 'react'
import { Bookmark } from '../services/bookmarkService'
import { BookmarkItem } from './BookmarkItem'
import { UnnamedBookmarks } from './UnnamedBookmarks'
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
  // 假设第一个书签是我们要特殊处理的顶层文件夹
  const [specialFolder, ...otherFolders] = bookmarks

  // 收集所有无名称的书签
  const unnamedBookmarks: Bookmark[] = []

  const collectUnnamedBookmarks = (bookmark: Bookmark) => {
    if (bookmark.children) {
      bookmark.children.forEach(child => {
        if (child.url && (!child.title || child.title.trim() === '')) {
          unnamedBookmarks.push(child)
        } else if (child.children) {
          collectUnnamedBookmarks(child)
        }
      })
    }
  }

  bookmarks.forEach(collectUnnamedBookmarks)

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-none shadow-lg">
      <CardContent className="p-4">
        <UnnamedBookmarks bookmarks={unnamedBookmarks} />
        {specialFolder.children?.map((bookmark) => (
          <BookmarkItem
            key={bookmark.id}
            bookmark={bookmark}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        ))}
        {otherFolders.map((folder) => (
          <BookmarkItem
            key={folder.id}
            bookmark={folder}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        ))}
      </CardContent>
    </Card>
  )
}
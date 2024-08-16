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
  // 假设 bookmarks 是一个只包含一个顶层文件夹的数组
  const specialFolder = bookmarks[0]

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

  collectUnnamedBookmarks(specialFolder)

  // 特殊处理 specialFolder 下的第一个文件夹
  const [firstFolder, ...otherSpecialFolders] = specialFolder.children || []

  // 合并 firstFolder 的子文件夹和 otherSpecialFolders
  const allFolders = [
    ...otherSpecialFolders,
    ...(firstFolder?.children?.filter(item => item.children) || [])
  ]

  // 获取 firstFolder 下的直接书签
  const directBookmarks = firstFolder?.children?.filter(item => item.url) || []

  return (
    <Card className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg border-none shadow-lg">
      <CardContent className="p-4">
        <UnnamedBookmarks bookmarks={unnamedBookmarks} />
        
        {/* 展示所有文件夹 */}
        {allFolders.map((folder) => (
          <BookmarkItem
            key={folder.id}
            bookmark={folder}
            onEdit={onEdit}
            onDelete={onDelete}
            level={0}
          />
        ))}

        {/* 展示 firstFolder 下的直接书签 */}
        {directBookmarks.map((bookmark) => (
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
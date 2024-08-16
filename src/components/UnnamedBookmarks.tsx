// src/components/UnnamedBookmarks.tsx

import React from 'react'
import { Bookmark } from '../services/bookmarkService'

interface UnnamedBookmarksProps {
  bookmarks: Bookmark[]
}

export const UnnamedBookmarks: React.FC<UnnamedBookmarksProps> = ({ bookmarks }) => {
  return (
    <div className="grid grid-cols-6 gap-4 mb-6">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
          onClick={() => chrome.tabs.create({ url: bookmark.url })}
        >
          <img
            src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.url}`}
            alt=""
            className="w-8 h-8 mb-2"
          />
          <span className="text-xs text-center truncate w-full">{new URL(bookmark.url).hostname}</span>
        </div>
      ))}
    </div>
  )
}
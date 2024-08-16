import React, { useState } from 'react'
import { Bookmark } from '../services/bookmarkService'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from 'lucide-react'

interface UnnamedBookmarksProps {
  bookmarks: Bookmark[]
}

const INITIAL_DISPLAY_COUNT = 12

export const UnnamedBookmarks: React.FC<UnnamedBookmarksProps> = ({ bookmarks }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const displayedBookmarks = isExpanded ? bookmarks : bookmarks.slice(0, INITIAL_DISPLAY_COUNT)

  return (
    <div className="mb-6">
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
        {displayedBookmarks.map((bookmark) => (
          <div
            key={bookmark.id}
            className="flex flex-col items-center justify-center p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors duration-200 cursor-pointer"
            onClick={() => chrome.tabs.create({ url: bookmark.url })}
          >
            <img
              src={`https://s2.googleusercontent.com/s2/favicons?domain_url=${bookmark.url}&sz=128`}
              alt=""
              className="w-8 h-8 sm:w-12 sm:h-12"
            />
            <span className="text-xs text-center truncate w-full mt-2 hidden sm:block">
              {new URL(bookmark.url).hostname}
            </span>
          </div>
        ))}
      </div>
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
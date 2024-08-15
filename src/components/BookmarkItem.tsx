// src/components/BookmarkItem.tsx

import React from 'react';
import { Bookmark } from '../services/bookmarkService';

interface BookmarkItemProps {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = ({
  bookmark,
  onEdit,
  onDelete
}) => {
  return (
    <div className="flex items-center justify-between p-2 hover:bg-gray-100">
      <div className="flex items-center overflow-hidden">
        {bookmark.url ? (
          <img src={`chrome://favicon/${bookmark.url}`} alt="" className="w-4 h-4 mr-2 flex-shrink-0" />
        ) : (
          <svg className="w-4 h-4 mr-2 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
          </svg>
        )}
        <span className="truncate">{bookmark.title}</span>
      </div>
      <div className="flex-shrink-0">
        <button
          onClick={() => onEdit(bookmark)}
          className="text-blue-500 hover:text-blue-700 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(bookmark.id)}
          className="text-red-500 hover:text-red-700"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
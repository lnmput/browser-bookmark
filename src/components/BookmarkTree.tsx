import React from 'react';
import { Bookmark } from '../services/bookmarkService';
import { BookmarkItem } from './BookmarkItem';

interface BookmarkTreeProps {
  bookmarks: Bookmark[];
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

export const BookmarkTree: React.FC<BookmarkTreeProps> = ({
  bookmarks,
  onEdit,
  onDelete
}) => {
  const renderBookmarks = (bookmarks: Bookmark[]) => {
    return bookmarks.map((bookmark) => (
      <div key={bookmark.id} className="ml-4">
        <BookmarkItem bookmark={bookmark} onEdit={onEdit} onDelete={onDelete} />
        {bookmark.children && bookmark.children.length > 0 && (
          <div className="ml-4">{renderBookmarks(bookmark.children)}</div>
        )}
      </div>
    ));
  };

  return <div className="p-4">{renderBookmarks(bookmarks)}</div>;
};
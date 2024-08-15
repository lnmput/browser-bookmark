import React from 'react';
import "./styles/globals.css"
import { BookmarkTree } from './components/BookmarkTree';
import { useBookmarks } from './hooks/useBookmarks';
import { updateBookmark, deleteBookmark } from './services/bookmarkService';


const Sidepanel: React.FC = () => {
  const { bookmarks, loading, error } = useBookmarks();

  const handleEdit = async (bookmark) => {
    const newTitle = prompt('Enter new title', bookmark.title);
    if (newTitle) {
      try {
        await updateBookmark(bookmark.id, { title: newTitle });
        // In a real app, you'd want to update the state here
        alert('Bookmark updated successfully');
      } catch (error) {
        console.error('Failed to update bookmark', error);
        alert('Failed to update bookmark');
      }
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this bookmark?')) {
      try {
        await deleteBookmark(id);
        // In a real app, you'd want to update the state here
        alert('Bookmark deleted successfully');
      } catch (error) {
        console.error('Failed to delete bookmark', error);
        alert('Failed to delete bookmark');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="h-screen w-full overflow-auto bg-white">
      <h1 className="text-2xl font-bold p-4">Bookmarks</h1>
      <BookmarkTree bookmarks={bookmarks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  );
};

export default Sidepanel;
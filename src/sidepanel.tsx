import React from 'react'
import "./styles/globals.css"
import { BookmarkTree } from './components/BookmarkTree'
import { useBookmarks } from './hooks/useBookmarks'
import { updateBookmark, deleteBookmark } from './services/bookmarkService'

const Sidepanel: React.FC = () => {
  const { bookmarks, loading, error } = useBookmarks()

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

  if (loading) return <div className="p-4 text-white">Loading...</div>
  if (error) return (
    <div className="p-4 text-red-500">
      Error: {error.message}
      <br />
      Please make sure you've granted the necessary permissions and are running this in a valid extension context.
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-500 p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Bookmarks</h1>
      <BookmarkTree bookmarks={bookmarks} onEdit={handleEdit} onDelete={handleDelete} />
    </div>
  )
}

export default Sidepanel
// src/hooks/useBookmarks.ts

import { useState, useEffect } from 'react';
import { Bookmark, getBookmarks } from '../services/bookmarkService';

export const useBookmarks = () => {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const result = await getBookmarks();
        setBookmarks(result);
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return { bookmarks, loading, error };
};
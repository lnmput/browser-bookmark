// src/components/SearchBar.tsx

import React, { useState, useCallback } from 'react'
import { Input } from "src/components/ui/input"
import { Search } from 'lucide-react'

interface SearchBarProps {
  onSearch: (query: string) => void
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState('')

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)
    onSearch(newQuery)
  }, [onSearch])

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search bookmarks..."
        value={query}
        onChange={handleChange}
        className="pl-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
    </div>
  )
}
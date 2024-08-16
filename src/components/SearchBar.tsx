import React, { useState, useCallback } from 'react'
import { Input } from "src/components/ui/input"
import { Search, X } from 'lucide-react'
import { Button } from "@/components/ui/button"

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

  const handleClear = useCallback(() => {
    setQuery('')
    onSearch('')
  }, [onSearch])

  return (
    <div className="relative mb-4">
      <Input
        type="text"
        placeholder="Search bookmarks..."
        value={query}
        onChange={handleChange}
        className="pl-10 pr-10"
      />
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
      {query && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2"
          onClick={handleClear}
        >
          <X size={18} />
        </Button>
      )}
    </div>
  )
}
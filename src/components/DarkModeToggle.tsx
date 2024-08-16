// src/components/DarkModeToggle.tsx

import React from 'react'
import { Button } from "@/components/ui/button"
import { Moon, Sun } from 'lucide-react'

interface DarkModeToggleProps {
  isDarkMode: boolean
  toggleDarkMode: () => void
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ isDarkMode, toggleDarkMode }) => {
  return (
    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </Button>
  )
}
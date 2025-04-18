"use client";

import React, { createContext, useContext, useEffect } from 'react';

type ThemeContextType = {
  theme: 'dark';
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Appliquer le thème sombre au chargement
  useEffect(() => {
    document.documentElement.classList.add('dark');
  }, []);

  const value = {
    theme: 'dark' as const
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme doit être utilisé à l\'intérieur d\'un ThemeProvider');
  }
  return context;
} 
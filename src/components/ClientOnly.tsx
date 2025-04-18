'use client';

import { useEffect, useState, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
}

/**
 * Composant qui ne rend son contenu que côté client
 * Utile pour éviter les erreurs d'hydratation avec les composants qui
 * nécessitent des API du navigateur comme localStorage, window, etc.
 */
export function ClientOnly({ children }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return <>{children}</>;
} 
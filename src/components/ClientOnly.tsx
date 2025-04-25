"use client";

import { useState, useEffect, ReactNode } from 'react';

interface ClientOnlyProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Composant qui assure que son contenu est rendu uniquement côté client
 * Solution efficace pour éviter les erreurs d'hydration avec Next.js
 */
export const ClientOnly = ({ children, fallback = null }: ClientOnlyProps) => {
  // État pour suivre si on est côté client ou non
  const [isMounted, setIsMounted] = useState(false);

  // useEffect s'exécute uniquement côté client après le rendu initial
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Pendant le rendu SSR ou le premier rendu côté client, on affiche un fallback ou rien
  if (!isMounted) {
    return <>{fallback}</>;
  }

  // Une fois monté (côté client uniquement), on affiche les enfants
  return <>{children}</>;
};

export default ClientOnly; 
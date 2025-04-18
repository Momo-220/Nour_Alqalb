"use client";

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FaMosque } from 'react-icons/fa';

// Composant de chargement pour le Suspense
function LoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-[#12090080] backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="relative">
          {/* Cercle externe avec motif islamique */}
          <div className="w-16 h-16 rounded-full border-4 border-amber-500/50 animate-spin border-dashed"></div>
          {/* Icône centrale */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <FaMosque className="text-amber-400 text-2xl" />
          </div>
        </div>
        <p className="mt-4 text-amber-300 font-amiri text-lg">Chargement...</p>
      </div>
    </div>
  );
}

// Composant qui gère le contenu de la page
function PageTransitionContent({
  children
}: {
  children: React.ReactNode;
}) {
  // On affiche directement le contenu sans animation
  return <>{children}</>;
}

// Composant exporté avec Suspense
export default function PageTransition({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <PageTransitionContent children={children} />
    </Suspense>
  );
} 
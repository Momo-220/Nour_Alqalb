"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaRegCopy, FaShare } from 'react-icons/fa';
import { Dua } from '@/types';
import EmptyState from './EmptyState';

interface FavoritesDuasProps {
  favorites: Dua[];
  onRemoveFavorite: (dua: Dua) => void;
}

// Fonction utilitaire pour formater la source
const formatSource = (source: any): string => {
  if (!source) return "Source non spécifiée";
  if (typeof source === 'string') return source;
  if (typeof source === 'object' && source.reference) return source.reference;
  return JSON.stringify(source);
};

export default function FavoritesDuas({ favorites, onRemoveFavorite }: FavoritesDuasProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        // Feedback visuel de succès (optionnel)
        alert('Texte copié dans le presse-papier');
      })
      .catch(err => {
        console.error('Erreur lors de la copie: ', err);
      });
  };
  
  if (!favorites || favorites.length === 0) {
    return (
      <EmptyState 
        type="favoris"
        action={{
          text: "Explorer les du'as",
          href: "/"
        }}
      />
    );
  }
  
  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
        className="grid grid-cols-1 gap-6"
      >
        {favorites.map((dua, index) => (
          <motion.div
            key={`${dua.id || index}-${dua.translation?.substring(0, 20)}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
            className="bg-[#1B0E02] rounded-xl overflow-hidden border border-amber-900/20 shadow-md"
          >
            <div className="p-6">
              <div className="mb-4 text-right">
                <p className="text-xl font-amiri text-amber-100 leading-relaxed">{dua.arabicText}</p>
              </div>
              
              {dua.transliteration && (
                <div className="mb-4 italic text-amber-200/80">
                  "{dua.transliteration}"
                </div>
              )}
              
              <div className="mb-4 text-amber-100">
                <p>{dua.translation}</p>
              </div>
              
              {dua.source && (
                <div className="text-sm text-amber-400/70 mt-2">
                  Source: {formatSource(dua.source)}
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-between px-6 py-3 bg-[#120800] border-t border-amber-900/20">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => copyToClipboard(`${dua.arabicText}\n\n${dua.translation}`)}
                  className="p-2 text-amber-400/80 hover:text-amber-400 transition-colors"
                  aria-label="Copier"
                >
                  <FaRegCopy />
                </button>
                <button 
                  className="p-2 text-amber-400/80 hover:text-amber-400 transition-colors"
                  aria-label="Partager"
                >
                  <FaShare />
                </button>
              </div>
              
              <button 
                onClick={() => onRemoveFavorite(dua)}
                className="p-2 text-amber-400/80 hover:text-red-400 transition-colors"
                aria-label="Supprimer des favoris"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
} 
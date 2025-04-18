"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaTrash } from 'react-icons/fa';
import { Dua } from '@/types';
import { adaptDuaToDuaData } from '@/components/DuaAdapter';
import DuaCard from '@/components/DuaCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<Dua[]>([]);
  const [mounted, setMounted] = useState(false);
  // État pour la simulation du texte animé
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    try {
      // Récupérer les favoris du localStorage
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const parsedFavorites = JSON.parse(storedFavorites);
        setFavorites(parsedFavorites);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des favoris:", error);
    }
  }, []);

  const removeFavorite = (duaId: string) => {
    try {
      const updatedFavorites = favorites.filter(dua => dua.id !== duaId);
      setFavorites(updatedFavorites);
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    } catch (error) {
      console.error("Erreur lors de la suppression du favori:", error);
    }
  };

  // Détecter si c'est le côté client
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-[#0C0600] to-[#1A0D00]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        {/* Étoiles scintillantes */}
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-playfair text-amber-400 mb-4">
            Vos Duas Favorites
          </h1>
          
          <div className="flex justify-center items-center mb-6">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <div className="mx-3 text-amber-500 relative">
              <FaStar className="text-amber-500 rotate-45 absolute -top-2 -left-2 opacity-30 text-xs" />
              <span>✧</span>
              <FaStar className="text-amber-500 rotate-12 absolute -bottom-2 -right-2 opacity-30 text-xs" />
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          
          <p className="text-amber-200/80 max-w-2xl mx-auto">
            Retrouvez ici toutes les invocations que vous avez sauvegardées pour y accéder facilement.
          </p>
        </motion.div>
        
        <div className="max-w-5xl mx-auto">
          {favorites.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-900/10 flex items-center justify-center">
                <FaHeart className="text-amber-400/30" size={32} />
              </div>
              <h3 className="text-xl text-amber-300 mb-2">Aucune dua favorite</h3>
              <p className="text-amber-200/60">
                Ajoutez des invocations à vos favoris en cliquant sur l'icône de cœur lors de votre navigation.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 gap-8">
              {favorites.map((dua, index) => (
                <motion.div
                  key={dua.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  <button
                    onClick={() => removeFavorite(dua.id)}
                    className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-red-900/20 hover:bg-red-900/40 text-red-400 transition-colors"
                    title="Retirer des favoris"
                  >
                    <FaTrash size={14} />
                  </button>
                  
                  <DuaCard
                    dua={adaptDuaToDuaData(dua)}
                    typingText=""
                    isTyping={false}
                    isFavorite={true}
                    onToggleFavorite={() => removeFavorite(dua.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
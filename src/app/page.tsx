"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import Link from "next/link";
import { FaBookmark, FaSearch, FaRegCopy, FaShare } from "react-icons/fa";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { ClientOnly } from '@/components/ClientOnly';
import { getRandomDailyDua } from "@/utils/dailyDuas";
import { Dua } from "@/types";
import dynamic from 'next/dynamic';
import { adaptDuaToDuaData } from "@/components/DuaAdapter";

// Lazy load heavy components
const DuaCard = dynamic(() => import('@/components/DuaCard'), { ssr: false });
const Footer = dynamic(() => import('@/components/Footer'), { ssr: false });

// Chargement dynamique du SplashScreen avec fallback
const SplashScreen = dynamic(() => import('@/components/SplashScreen'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )
});

// Suggestions communes mémorisées
const commonSuggestions = [
  "Protection contre le mal",
  "Demande de pardon",
  "Succès dans les études",
  "Guidance divine",
  "Protection de la famille",
  "Apaisement du cœur",
  "Guérison",
  "Facilité dans les épreuves"
];

// Fonction debounce typée
function debounce<T extends (...args: any[]) => void>(
  func: T, 
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function HomePage() {
  const [prompt, setPrompt] = useState('');
  const [dua, setDua] = useState<Dua | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(false);
  const [activeTab, setActiveTab] = useState("populaires");
  const [favorites, setFavorites] = useLocalStorage<Dua[]>('favorites', []);
  const [hasSeenSplash, setHasSeenSplash] = useLocalStorage<boolean>('hasSeenSplash', false);
  const translationRef = useRef<string>("");
  const typingIndexRef = useRef(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const [showSplash, setShowSplash] = useState(false);
  const [dailyDua, setDailyDua] = useState<any>(null);

  // Mémorisation de la dua quotidienne
  const memoizedDailyDua = useMemo(() => {
    return getRandomDailyDua();
  }, []);

  // Animation de texte optimisée
  const typeText = useCallback(async (text: string) => {
    if (!text) return;
    
    setIsTyping(true);
    let currentText = '';
    
    // Approche plus efficace pour l'animation de frappe
    const chunkSize = 3; // Taper plusieurs caractères à la fois
    for (let i = 0; i < text.length; i += chunkSize) {
      const chunk = text.substring(i, Math.min(i + chunkSize, text.length));
      currentText += chunk;
      setTypingText(currentText);
      await new Promise(resolve => setTimeout(resolve, 10));
    }
    
    setIsTyping(false);
  }, []);

  // Génération à partir de l'URL
  const generateFromURL = useCallback(async (decodedIntention: string) => {
    setIsLoading(true);
    setError(null);
    setDua(null);
    setTypingText('');

    try {
      const response = await fetch('/api/generate-dua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: decodedIntention.trim()
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération de la dua');
      }

      const data = await response.json();
      
      if (!data.dua) {
        throw new Error('Format de réponse invalide');
      }
      
      setDua(data.dua);
      typeText(data.dua.translation);
    } catch (err) {
      const error = err as Error;
      setError(error?.message || "Une erreur s'est produite lors de la génération de la dua. Veuillez réessayer.");
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [typeText]);

  // Génération de dua optimisée
  const generateDua = useCallback(async () => {
    if (!prompt.trim()) {
      setError("Veuillez entrer une intention ou un sujet pour la dua.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setDua(null);
    setTypingText('');

    try {
      // Utilisation d'AbortController pour les requêtes
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const response = await fetch('/api/generate-dua', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: prompt.trim()
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la génération de la dua');
      }

      const data = await response.json();
      
      if (!data.dua) {
        throw new Error('Format de réponse invalide');
      }
      
      setDua(data.dua);
      typeText(data.dua.translation);
    } catch (err: unknown) {
      const error = err as Error;
      if (error.name === 'AbortError') {
        setError("La requête a pris trop de temps. Veuillez réessayer.");
      } else {
        setError(error.message || "Une erreur s'est produite lors de la génération de la dua. Veuillez réessayer.");
      }
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [prompt, typeText]);

  // Gestion des favoris optimisée
  const toggleFavorite = useCallback((dua: Dua) => {
    const isFavorite = favorites.some(
      (fav) => fav.arabicText === dua.arabicText && fav.translation === dua.translation
    );

    if (isFavorite) {
      setFavorites(favorites.filter(
        (fav) => !(fav.arabicText === dua.arabicText && fav.translation === dua.translation)
      ));
    } else {
      setFavorites([...favorites, dua]);
    }
  }, [favorites, setFavorites]);

  const isFavorite = useCallback((dua: Dua) => {
    return favorites.some(
      (fav) => fav.arabicText === dua.arabicText && fav.translation === dua.translation
    );
  }, [favorites]);

  // Fonctions pour la dua quotidienne
  const addDailyDuaToFavorites = useCallback(() => {
    if (!dailyDua) return;
    
    // Convertir la Du'a du jour en format Dua pour les favoris
    const duaToAdd: Dua = {
      id: dailyDua.id,
      arabicText: dailyDua.arabicText,
      transliteration: dailyDua.transliteration,
      translation: dailyDua.translation,
      source: dailyDua.source,
      category: "Du'a du jour",
      context: {
        description: dailyDua.context,
        benefits: dailyDua.benefits
      }
    };
    
    if (!isFavorite(duaToAdd)) {
      setFavorites([...favorites, duaToAdd]);
      alert("Du'a ajoutée aux favoris!");
    } else {
      alert("Cette Du'a est déjà dans vos favoris.");
    }
  }, [dailyDua, isFavorite, favorites, setFavorites]);

  const copyDailyDua = useCallback(() => {
    if (!dailyDua) return;
    
    const textToCopy = `${dailyDua.arabicText}\n\n${dailyDua.transliteration}\n\n${dailyDua.translation}\n\nSource: ${dailyDua.source}`;
    
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        alert("Du'a copiée dans le presse-papier!");
      })
      .catch(err => {
        console.error("Erreur lors de la copie: ", err);
      });
  }, [dailyDua]);

  const shareDailyDua = useCallback(() => {
    if (!dailyDua) return;
    
    if (navigator.share) {
      navigator.share({
        title: "Du'a du Jour - Nour Al-Qalb",
        text: `${dailyDua.arabicText}\n\n${dailyDua.transliteration}\n\n${dailyDua.translation}\n\nSource: ${dailyDua.source}`,
        url: window.location.href
      })
      .catch(err => {
        console.error("Erreur lors du partage: ", err);
      });
    } else {
      alert("Le partage n'est pas supporté par votre navigateur.");
    }
  }, [dailyDua]);

  // Gestion de la fin de l'animation de démarrage
  const handleSplashFinished = useCallback(() => {
    setHasSeenSplash(true);
    
    // Préchargement optimisé des ressources
    const preloadResources = async () => {
      const resources = [
        '/images/mosque-silhouette.png',
        '/images/geometric-pattern.png',
        '/icon.svg'
      ];

      try {
        await Promise.all(resources.map(src => {
          return new Promise<boolean>((resolve) => {
            const img = document.createElement("img");
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = src;
          });
        }));
      } catch (e) {
        console.warn('Resource preloading partially failed:', e);
      }

      setShowSplash(false);
      
      // Animation progressive du contenu principal
      setTimeout(() => {
        const mainContent = document.querySelector('main');
        if (mainContent) {
          mainContent.classList.add('animate-fadeIn');
        }
      }, 100);
    };

    preloadResources();
  }, [setHasSeenSplash]);

  // Gestion des suggestions
  const handleSuggestionClick = useCallback((suggestion: string) => {
    setPrompt(suggestion);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, []);

  // Effet pour le montage initial
  useEffect(() => {
    if (mounted) {
      setShowSplash(!hasSeenSplash);
      
      const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const intentionParam = params?.get('intention');
      
      if (intentionParam) {
        const decodedIntention = decodeURIComponent(intentionParam);
        setPrompt(decodedIntention);
        
        setTimeout(() => {
          generateFromURL(decodedIntention);
        }, 300);
      }

      setDailyDua(memoizedDailyDua);
    }
  }, [mounted, hasSeenSplash, memoizedDailyDua, generateFromURL]);

  // Effet pour l'animation de parallaxe
  useEffect(() => {
    if (!heroRef.current) return;
    
    const handleScroll = debounce(() => {
      if (heroRef.current) {
        const scrollPosition = window.scrollY;
        heroRef.current.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
      }
    }, 10);
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // État de montage
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Placeholder pendant le chargement
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
        <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <>
      <ClientOnly>
        {showSplash && (
          <SplashScreen 
            onFinished={handleSplashFinished}
            duration={10000}
          />
        )}
      </ClientOnly>
      
      <motion.main 
        className="min-h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: showSplash ? 0 : 1 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
      {/* Hero Section avec animation */}
      <section 
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center justify-center bg-gradient-to-b from-[#140C00] via-[#1A0D00] to-[#160900] overflow-visible"
      >
        {/* Background Pattern - Optimisé pour les performances */}
        <div className="absolute inset-0 bg-[url('/images/mosque-silhouette.png')] bg-no-repeat bg-bottom opacity-20 will-change-transform"></div>
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.png')] bg-repeat opacity-5"></div>
        
        {/* Animation d'étoiles - Réduite pour de meilleures performances */}
        <div className="absolute inset-0">
          {Array.from({ length: 15 }).map((_, i) => (
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
        
        <div className="container mx-auto px-4 z-10 text-center py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-7xl font-playfair text-white mb-4">
              <span className="text-amber-400 font-bold">Nour</span> Al-Qalb
            </h1>
            <p className="text-xl md:text-2xl text-amber-100 font-light mb-8 max-w-2xl mx-auto">
              Trouvez les mots pour parler à Allah, à tout moment
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-xl mx-auto mb-12"
          >
            <form onSubmit={(e) => { e.preventDefault(); generateDua(); }} className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Rechercher une du'a ou une intention..."
                className="w-full px-6 py-4 rounded-full bg-black/30 backdrop-blur-md text-white border border-amber-500/30 shadow-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r from-amber-600 to-amber-400 text-black"
              >
                <FaSearch className="text-black" />
              </button>
            </form>
            
            {/* Suggestions sous forme de boutons */}
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap justify-center gap-2 mt-4"
            >
              {commonSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 bg-[#271403]/80 backdrop-blur-sm border border-amber-600/30 rounded-full text-amber-300 text-sm hover:bg-amber-900/40 transition-colors shadow-sm"
                >
                  {suggestion}
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
          
          {/* Résultat de recherche conditionnel - Optimisé pour les performances */}
          {dua && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="mt-8 mb-32 max-w-4xl mx-auto"
            >
              <div className="bg-[#11080080] backdrop-blur-sm p-6 rounded-2xl border border-amber-700/30 shadow-xl">
              <h2 className="text-3xl font-playfair font-semibold text-amber-500 mb-8 text-center relative">
                Résultat de votre recherche
                <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
              </h2>
                {/* Rendu conditionnel de DuaCard pour les performances */}
                {mounted && dua && (
              <DuaCard 
                dua={adaptDuaToDuaData(dua)} 
                typingText={typingText}
                isTyping={isTyping}
              />
                )}
              </div>
            </motion.div>
          )}
          
          {/* Verset du jour - ne s'affiche que si pas de résultat de recherche */}
          {!dua && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="absolute bottom-8 left-0 right-0 mx-auto text-center max-w-xl"
          >
            <p className="text-amber-300 italic font-amiri text-lg">"Et votre Seigneur dit: Appelez-Moi, Je vous répondrai."</p>
            <p className="text-amber-200/70 text-sm">- Sourate Ghafir, verset 60</p>
          </motion.div>
          )}
        </div>
      </section>
      
      {/* Section des collections - Optimisée pour les performances */}
      <section id="collections" className="py-16 bg-[#180D00] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.png')] bg-repeat opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-12">
            <h2 className="inline-block text-3xl font-playfair font-semibold text-amber-500 mb-4 relative">
              Collections de Du'as
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
            </h2>
            <p className="text-amber-300/80 max-w-2xl mx-auto">
              Explorer notre sélection de du'as authentiques organisées par catégories
            </p>
          </div>
          
          {/* Du'a du jour - avec optimisations de performance */}
          {dailyDua && (
            <div className="mb-16">
              <div className="text-center mb-8">
                <h3 className="inline-block text-2xl font-playfair font-medium text-amber-400 mb-2 relative">
                  Du'a du Jour
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-400/70 to-transparent"></div>
                </h3>
                <p className="text-amber-300/70 text-sm">Renouvelée à chaque visite</p>
          </div>
          
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-[#1B0E02] rounded-xl overflow-hidden border border-amber-900/20 shadow-xl max-w-3xl mx-auto"
                    >
                <div className="p-6 md:p-8">
                  <div className="mb-6 text-right">
                    <p className="text-2xl font-amiri text-amber-100 leading-relaxed">{dailyDua.arabicText}</p>
                </div>
                  
                  <div className="mb-4 italic text-amber-200/80">
                    "{dailyDua.transliteration}"
        </div>
                  
                  <div className="mb-6 text-amber-100">
                    <p>{dailyDua.translation}</p>
          </div>
          
                  <div className="text-sm text-amber-400/70 border-t border-amber-900/20 pt-4 mt-4">
                    <p><span className="font-medium">Source:</span> {dailyDua.source}</p>
                    <p className="mt-2"><span className="font-medium">Contexte:</span> {dailyDua.context}</p>
                    <div className="mt-2">
                      <span className="font-medium">Bienfaits:</span>
                      <ul className="list-disc list-inside mt-1 ml-2">
                        {dailyDua.benefits.map((benefit: string, index: number) => (
                          <li key={index} className="text-amber-300/80">{benefit}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#120800] px-6 py-4 flex justify-between items-center">
                  <div className="flex space-x-3">
                    <button 
                      onClick={copyDailyDua}
                      className="px-4 py-1.5 bg-amber-900/30 hover:bg-amber-900/50 transition-colors text-amber-300 rounded-full text-sm flex items-center gap-2"
                    >
                      <FaRegCopy className="text-xs" /> Copier
                    </button>
                    <button 
                      onClick={shareDailyDua}
                      className="px-4 py-1.5 bg-amber-900/30 hover:bg-amber-900/50 transition-colors text-amber-300 rounded-full text-sm flex items-center gap-2"
                    >
                      <FaShare className="text-xs" /> Partager
                    </button>
                  </div>
                  <button 
                    onClick={addDailyDuaToFavorites}
                    className="px-4 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 transition-colors text-amber-400 rounded-full text-sm flex items-center gap-2"
                  >
                    <FaBookmark className="text-xs" /> Ajouter aux favoris
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </section>
      
      {/* Rendu conditionnel du footer */}
      {mounted && <Footer />}
      </motion.main>
    </>
  );
}
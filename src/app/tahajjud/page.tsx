"use client";

import React, { useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaCalculator, FaMoon, FaSun, FaClock, FaStar, FaRegMoon } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/Logo';

export default function TahajjudPage() {
  // État pour le menu mobile
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // États pour les animations et le chargement
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  // États pour les résultats du calcul
  const [lastThirdTime, setLastThirdTime] = useState<string>('');
  const [middleTime, setMiddleTime] = useState<string>('');
  const [thirdDuration, setThirdDuration] = useState<string>('');
  
  // Références DOM pour les inputs
  const ishaInputRef = useRef<HTMLInputElement>(null);
  const fajrInputRef = useRef<HTMLInputElement>(null);

  // Charger les valeurs sauvegardées depuis localStorage
  useEffect(() => {
    try {
      const savedIsha = localStorage.getItem('ishaTime');
      const savedFajr = localStorage.getItem('fajrTime');
      
      if (savedIsha && ishaInputRef.current) {
        ishaInputRef.current.value = savedIsha;
      }
      
      if (savedFajr && fajrInputRef.current) {
        fajrInputRef.current.value = savedFajr;
      }
      
      // Si nous avons déjà les deux valeurs, calculer automatiquement
      if (savedIsha && savedFajr) {
        const storedResults = localStorage.getItem('tahajjudResults');
        if (storedResults) {
          const { lastThird, middle, duration } = JSON.parse(storedResults);
          setLastThirdTime(lastThird);
          setMiddleTime(middle);
          setThirdDuration(duration);
          setShowResults(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors du chargement des données:", error);
    }
  }, []);

  // Fonction pour sauvegarder les valeurs dans localStorage
  const saveTimeToStorage = (type: 'isha' | 'fajr', value: string) => {
    try {
      localStorage.setItem(type === 'isha' ? 'ishaTime' : 'fajrTime', value);
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
    }
  };
  
  // Fonction améliorée pour calculer précisément les tiers de la nuit
  const calculateTahajjud = async () => {
    if (!ishaInputRef.current || !fajrInputRef.current) return;
    
    const ishaValue = ishaInputRef.current.value;
    const fajrValue = fajrInputRef.current.value;
    
    if (!ishaValue || !fajrValue) {
      alert('Veuillez saisir les heures de Isha et Fajr');
      return;
    }
    
    // Activer l'animation de chargement
    setIsCalculating(true);
    // Masquer les résultats pendant le calcul
    setShowResults(false);
    
    // Simuler une opération asynchrone pour l'animation
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Obtenir la date actuelle pour le format correct
      const today = new Date();
      const formattedDate = today.toISOString().split('T')[0]; // Format YYYY-MM-DD
      
      // Calcul des temps avec dates complètes
      const isha = new Date(`${formattedDate}T${ishaValue}:00`);
      let fajr = new Date(`${formattedDate}T${fajrValue}:00`);
      
      // Si Fajr est avant Isha, ajouter 24 heures (jour suivant)
      if (fajr.getTime() <= isha.getTime()) {
        fajr = new Date(fajr.getTime() + 24 * 60 * 60 * 1000);
      }
      
      // Calcul précis des tiers (en millisecondes pour éviter les erreurs d'arrondi)
      const totalNightMs = fajr.getTime() - isha.getTime();
      const thirdDurationMs = totalNightMs / 3;
      
      // Convertir la durée du tiers en heures et minutes
      const thirdDurationMinutes = Math.floor(thirdDurationMs / (1000 * 60));
      const hours = Math.floor(thirdDurationMinutes / 60);
      const minutes = thirdDurationMinutes % 60;
      
      // Calculer les heures de début exactes pour chaque tiers
      const middleThirdStart = new Date(isha.getTime() + thirdDurationMs);
      const lastThirdStart = new Date(isha.getTime() + 2 * thirdDurationMs);
      
      // Formatage amélioré de l'heure (HH:MM)
      const formatTime = (date: Date): string => {
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes}`;
      };
      
      // Mettre à jour les états avec les résultats formatés
      const formattedLastThird = formatTime(lastThirdStart);
      const formattedMiddle = formatTime(middleThirdStart);
      const formattedDuration = `${hours}h ${minutes}min`;
      
      setLastThirdTime(formattedLastThird);
      setMiddleTime(formattedMiddle);
      setThirdDuration(formattedDuration);
      
      // Sauvegarder les résultats dans localStorage
      localStorage.setItem('tahajjudResults', JSON.stringify({
        lastThird: formattedLastThird,
        middle: formattedMiddle,
        duration: formattedDuration
      }));
      
      // Afficher les résultats avec animation
      setShowResults(true);
    } catch (error) {
      console.error('Erreur de calcul:', error);
      alert('Une erreur est survenue lors du calcul. Veuillez vérifier les heures saisies.');
    } finally {
      // Désactiver l'animation de chargement
      setIsCalculating(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-[#0C0600] to-[#1A0D00]">
      {/* Arrière-plan avec motifs et étoiles */}
      <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 z-0"></div>
      
      {/* Étoiles scintillantes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
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
      
      <header className="py-6 border-b border-amber-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-all"
            >
              <FaArrowLeft size={14} />
              <span className="font-medium">Retour</span>
            </Link>
            
            <div className="flex justify-center">
              <Logo size="lg" />
            </div>
            
            <div className="w-[110px]"></div>
          </div>
        </div>
      </header>

      <main className="pt-12 pb-16 container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-amiri text-amber-400 mb-3">
            صلاة التهجد
          </h1>
          
          <div className="flex justify-center items-center mb-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <div className="mx-3 text-amber-500 relative">
              <FaStar className="text-amber-500 rotate-45 absolute -top-2 -left-2 opacity-30 text-xs" />
              <span>✧</span>
              <FaStar className="text-amber-500 rotate-12 absolute -bottom-2 -right-2 opacity-30 text-xs" />
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          
          <h2 className="text-3xl text-amber-400 mb-6 font-playfair">
            Calcul du Temps de Tahajjud
          </h2>
          
          <p className="text-amber-200/90 max-w-md mx-auto leading-relaxed">
            Le Tahajjud est une prière surérogatoire effectuée pendant le dernier tiers de la nuit.
            Utilisez cet outil pour calculer les meilleurs moments.
          </p>
        </motion.div>

        {/* Citation du Prophète Muhammad (paix et salut sur lui) */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto mb-12 px-6 py-5 rounded-lg border border-amber-900/30 bg-gradient-to-b from-[#1a0f02]/70 to-[#120800]/70 backdrop-blur-sm"
        >
          <div className="flex items-start">
            <div className="text-amber-500 mr-3 mt-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <div>
              <blockquote className="font-amiri text-amber-300/90 italic text-lg leading-relaxed">
                "Notre Seigneur, béni et exalté soit-Il, descend chaque nuit au ciel le plus bas quand il reste le dernier tiers de la nuit, et Il dit : 'Qui M'invoque que Je lui réponde ? Qui Me demande que Je lui donne ? Qui implore Mon pardon que Je lui pardonne ?'"
              </blockquote>
              <div className="flex justify-between items-center mt-4">
                <cite className="text-amber-400 not-italic font-medium">
                  Prophète Muhammad ﷺ
                </cite>
                <div className="text-amber-500/70 text-sm">
                  Rapporté par Al-Bukhari et Muslim
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-lg mx-auto"
        >
          <div className="relative rounded-xl p-10 shadow-lg border border-amber-900/50 overflow-hidden">
            {/* Overlay pour effet de profondeur */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F02] to-[#0A0500] opacity-95 z-0"></div>
            
            {/* Coins décorés */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-700/40 rounded-tl-sm z-10"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-700/40 rounded-tr-sm z-10"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-700/40 rounded-bl-sm z-10"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-700/40 rounded-br-sm z-10"></div>
            
            <div className="relative z-20">
              <div className="grid grid-cols-1 gap-8 mb-8">
                <div className="text-center relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 bg-gradient-to-r from-[#130A00] via-[#1A0F02] to-[#130A00]">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center"
                    >
                      <FaMoon className="text-amber-400 inline-block mr-2" />
                      <label className="text-amber-300 font-medium">Heure de Isha</label>
                    </motion.div>
                  </div>
                  <input
                    ref={ishaInputRef}
                    type="time"
                    defaultValue=""
                    onChange={(e) => saveTimeToStorage('isha', e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 text-center text-xl transition-all"
                  />
                </div>
                
                <div className="text-center relative">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 bg-gradient-to-r from-[#130A00] via-[#1A0F02] to-[#130A00]">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center"
                    >
                      <FaSun className="text-amber-400 inline-block mr-2" />
                      <label className="text-amber-300 font-medium">Heure de Fajr</label>
                    </motion.div>
                  </div>
                  <input
                    ref={fajrInputRef}
                    type="time"
                    defaultValue=""
                    onChange={(e) => saveTimeToStorage('fajr', e.target.value)}
                    className="w-full p-4 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 text-center text-xl transition-all"
                  />
                </div>
              </div>

              <motion.button
                onClick={calculateTahajjud}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                disabled={isCalculating}
                className="w-full py-4 px-6 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 rounded-lg text-amber-50 font-medium shadow-lg hover:shadow-amber-900/20 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-opacity-50 transition-all disabled:opacity-70"
              >
                <span className="flex items-center justify-center">
                  {isCalculating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin mr-2"></div>
                      Calcul en cours...
                    </>
                  ) : (
                    <>
                      <FaCalculator className="w-4 h-4 mr-2" />
                      Calculer
                    </>
                  )}
                </span>
              </motion.button>
              
              {/* Résultats avec animation */}
              <AnimatePresence mode="wait">
                {showResults && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, y: 10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    transition={{ type: "spring", damping: 20, stiffness: 200 }}
                    className="mt-8 p-6 bg-[#0C0700] border border-amber-800/30 rounded-lg overflow-hidden"
                  >
                    <motion.h3 
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="text-amber-500 text-xl font-medium mb-6 text-center"
                    >
                      Périodes optimales de Tahajjud
                    </motion.h3>
                    
                    <div className="space-y-6">
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#271403] flex items-center justify-center text-amber-500 relative overflow-hidden">
                          <motion.div 
                            initial={{ scale: 0.8 }}
                            animate={{ scale: [0.8, 1.2, 1] }}
                            transition={{ duration: 1, delay: 0.4 }}
                          >
                            <FaMoon size={20} />
                          </motion.div>
                          <motion.div 
                            className="absolute inset-0 rounded-full"
                            animate={{ 
                              boxShadow: ["0 0 0px 0px rgba(217, 119, 6, 0)", "0 0 15px 2px rgba(217, 119, 6, 0.3)", "0 0 0px 0px rgba(217, 119, 6, 0)"] 
                            }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-amber-400 font-medium">Dernier tiers de la nuit</h4>
                          <p className="text-amber-300/80 flex items-center mt-1">
                            <FaClock className="mr-2 text-amber-500/70" />
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-amber-300 font-medium"
                            >
                              {lastThirdTime}
                            </motion.span>
                            <span className="mx-1 text-amber-500/50">→</span>
                            <span>Fajr</span>
                            <motion.span 
                              initial={{ opacity: 0, x: 5 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.6 }}
                              className="ml-2 px-2 py-0.5 bg-amber-500/10 rounded text-xs text-amber-400/80"
                            >
                              Recommandé
                            </motion.span>
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-center"
                      >
                        <div className="w-12 h-12 rounded-full bg-[#271403] flex items-center justify-center text-amber-500/80">
                          <FaRegMoon size={18} />
                        </div>
                        <div className="ml-4">
                          <h4 className="text-amber-400/90 font-medium">Milieu de la nuit</h4>
                          <p className="text-amber-300/70 flex items-center mt-1">
                            <FaClock className="mr-2 text-amber-500/60" />
                            <motion.span 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                              className="text-amber-300/80"
                            >
                              {middleTime}
                            </motion.span>
                          </p>
                        </div>
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="pt-4 border-t border-amber-900/20"
                      >
                        <p className="text-center text-amber-300/80">
                          Durée de chaque tiers : <span className="text-amber-400 font-medium">{thirdDuration}</span>
                        </p>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="mt-10 text-center">
            <Link 
              href="/"
              className="text-amber-500 hover:text-amber-400 transition-all font-medium flex items-center justify-center gap-2 group"
            >
              <span className="border-b border-amber-800/40 group-hover:border-amber-600/60 pb-px">Retour à l'accueil</span>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
} 
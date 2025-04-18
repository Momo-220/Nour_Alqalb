import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMoon, FaStar, FaMosque } from 'react-icons/fa';
import Logo from './Logo';

// Collection étendue de citations religieuses
const religiousQuotes = [
  {
    text: "La patience est la clé du réconfort.",
    author: "Prophète Muhammad ﷺ",
    source: "Hadith"
  },
  {
    text: "Celui qui s'en remet à Allah, Allah lui suffit.",
    author: "Coran",
    source: "65:3"
  },
  {
    text: "La foi n'est pas une espérance, c'est une certitude.",
    author: "Imam Ali",
    source: "Nahj al-Balagha"
  },
  {
    text: "Le Paradis se trouve sous les pieds des mères.",
    author: "Prophète Muhammad ﷺ",
    source: "Sunan an-Nasa'i"
  },
  {
    text: "Allah n'impose à aucune âme une charge supérieure à sa capacité.",
    author: "Coran",
    source: "2:286"
  },
  {
    text: "Les actes ne valent que par leurs intentions.",
    author: "Prophète Muhammad ﷺ",
    source: "Sahih al-Bukhari"
  },
  {
    text: "Invoquez-Moi, Je vous répondrai.",
    author: "Coran",
    source: "40:60"
  },
  {
    text: "Le sourire à l'égard de ton frère est une aumône.",
    author: "Prophète Muhammad ﷺ",
    source: "Jami` at-Tirmidhi"
  },
  {
    text: "Quiconque emprunte un chemin à la recherche du savoir, Allah lui facilite le chemin vers le Paradis.",
    author: "Prophète Muhammad ﷺ",
    source: "Sahih Muslim"
  },
  {
    text: "La meilleure des personnes est celle qui est la plus utile aux autres.",
    author: "Prophète Muhammad ﷺ",
    source: "Hadith"
  }
];

interface SplashScreenProps {
  onFinished: () => void;
  duration?: number;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ 
  onFinished, 
  duration = 8500 // Durée augmentée à 8.5 secondes pour permettre un chargement complet
}) => {
  const [quote, setQuote] = useState(religiousQuotes[0]);
  const [visible, setVisible] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  // Sélectionner et changer périodiquement les citations
  useEffect(() => {
    // Sélection aléatoire initiale
    const randomIndex = Math.floor(Math.random() * religiousQuotes.length);
    setCurrentQuoteIndex(randomIndex);
    setQuote(religiousQuotes[randomIndex]);
    
    // Changer la citation toutes les 4 secondes
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % religiousQuotes.length;
        setQuote(religiousQuotes[newIndex]);
        return newIndex;
      });
    }, 4000);
    
    // Configurer la minuterie pour masquer le splash screen
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration - 1000); // Prévoir du temps pour l'animation de sortie
    
    // Déclencher le callback de fin lorsque l'animation de sortie est terminée
    const finishTimer = setTimeout(() => {
      onFinished();
    }, duration);
    
    // Animer la progression du chargement
    const startTime = Date.now();
    const loadingInterval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(100, (elapsed / (duration - 1000)) * 100);
      setLoadingProgress(progress);
      
      if (progress >= 100) {
        clearInterval(loadingInterval);
      }
    }, 50);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(finishTimer);
      clearInterval(loadingInterval);
      clearInterval(quoteInterval);
    };
  }, [duration, onFinished]);

  // Variantes pour les animations framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.3 
      }
    },
    exit: { 
      opacity: 0,
      transition: { 
        duration: 0.8,
        staggerChildren: 0.15,
        staggerDirection: -1
      }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-[#0C0600] to-[#1A0D00] overflow-hidden"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Arrière-plan avec motifs */}
          <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5"></div>
          
          {/* Étoiles scintillantes avec plus de diversité */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {Array.from({ length: 40 }).map((_, i) => {
              const size = Math.random() > 0.7 ? 2 : 1; // Tailles variées
              return (
                <motion.div
                  key={i}
                  className={`absolute rounded-full bg-amber-200`}
                  style={{
                    top: `${10 + Math.random() * 80}%`,
                    left: `${Math.random() * 100}%`,
                    width: `${size}px`,
                    height: `${size}px`,
                    opacity: Math.random() * 0.5 + 0.1,
                  }}
                  animate={{
                    opacity: [0.1, 0.6, 0.1],
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 4,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              );
            })}
          </div>
          
          {/* Croissant de lune qui flotte */}
          <motion.div 
            className="absolute text-amber-500/20"
            style={{ 
              top: '10%',
              right: '10%',
              transform: 'rotate(20deg)'
            }}
            animate={{
              y: [0, -15, 0],
              opacity: [0.2, 0.3, 0.2],
              rotate: [20, 25, 20]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <FaMoon size={70} />
          </motion.div>
          
          {/* Petit dôme de mosquée flottant */}
          <motion.div 
            className="absolute text-amber-500/15"
            style={{ 
              bottom: '15%',
              left: '12%',
            }}
            animate={{
              y: [0, -10, 0],
              opacity: [0.15, 0.25, 0.15],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2
            }}
          >
            <FaMosque size={50} />
          </motion.div>
          
          {/* Logo animé avec effet de lumière */}
          <motion.div 
            className="mb-10 relative"
            variants={itemVariants}
          >
            <motion.div
              className="absolute inset-0 rounded-full"
              animate={{ 
                boxShadow: ["0 0 0px 0px rgba(217, 119, 6, 0)", "0 0 30px 5px rgba(217, 119, 6, 0.2)", "0 0 0px 0px rgba(217, 119, 6, 0)"] 
              }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 1 }}
            />
            <Logo size="lg" variant="light" />
          </motion.div>
          
          {/* Titre de l'application */}
          <motion.h1
            className="text-amber-400 text-3xl mb-10 font-amiri"
            variants={itemVariants}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Application Islamique de Du'as
          </motion.h1>
          
          {/* Conteneur de citation avec transition fluide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuoteIndex}
              className="max-w-md px-8 py-6 rounded-lg border border-amber-800/30 backdrop-blur-sm bg-gradient-to-b from-amber-900/10 to-amber-950/10"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                {/* Icônes décoratives */}
                <FaStar className="absolute -top-1 -left-1 text-amber-500/20 text-xs" />
                <FaStar className="absolute -bottom-1 -right-1 text-amber-500/20 text-xs" />
                
                <motion.blockquote 
                  className="text-center mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8 }}
                >
                  <p className="text-amber-300 text-xl font-medium font-amiri italic leading-relaxed">
                    "{quote.text}"
                  </p>
                </motion.blockquote>
                
                <motion.div 
                  className="flex items-center justify-center text-amber-400 text-sm gap-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                >
                  <span className="font-semibold">{quote.author}</span>
                  {quote.source && (
                    <>
                      <span className="text-amber-500/50">•</span>
                      <span className="text-amber-500/80">{quote.source}</span>
                    </>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Loader animé avec progression */}
          <motion.div 
            className="mt-16"
            variants={itemVariants}
            transition={{ delay: 0.8 }}
          >
            <div className="relative">
              <div className="w-48 h-1.5 bg-amber-900/30 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-amber-500"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
              <div className="mt-2 text-center text-amber-500/60 text-xs font-medium">
                {loadingProgress < 30 ? (
                  "Chargement des ressources..."
                ) : loadingProgress < 60 ? (
                  "Préparation de l'application..."
                ) : loadingProgress < 90 ? (
                  "Finalisation..."
                ) : (
                  "Prêt !"
                )}
              </div>
            </div>
          </motion.div>
          
          {/* Texte de chargement */}
          <motion.div
            className="absolute bottom-8 text-center text-amber-400/50 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Nour Al-Qalb | La lumière du cœur
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen; 
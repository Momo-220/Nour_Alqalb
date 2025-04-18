"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuran } from 'react-icons/fa';

// Composant de chargement pour le Suspense
function LoadingFallback() {
  return (
    <div className="fixed inset-0 z-50 bg-[#12090080] backdrop-blur-md flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-lg animate-spin">
          <FaQuran className="text-[#0A0500] text-xl" />
        </div>
        <p className="mt-4 text-amber-300 font-amiri text-lg">Chargement...</p>
      </div>
    </div>
  );
}

// Composant qui utilise useSearchParams
function PageTransitionContent({
  children
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [key, setKey] = useState('');

  // Vérifier si on est sur le SplashScreen
  const isSplashScreen = pathname === '/' && !searchParams?.toString();

  // Mettre à jour la clé quand le chemin ou les paramètres de recherche changent
  useEffect(() => {
    setKey(`${pathname}${searchParams}`);
    
    // Ne pas afficher l'animation sur le SplashScreen
    if (!isSplashScreen) {
      setIsLoading(true);
      
      // Simuler un temps de chargement minimal pour l'animation
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 800);
      
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams, isSplashScreen]);

  // Variantes pour les animations
  const overlayVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
        delay: 0.1
      }
    },
    exit: { 
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && !isSplashScreen && (
          <motion.div
            key="overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 bg-[#12090080] backdrop-blur-md flex items-center justify-center"
          >
            <div className="flex flex-col items-center">
              {/* Animation simplifiée */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ 
                  scale: 1,
                  opacity: 1,
                  rotate: 360,
                  transition: { 
                    scale: { duration: 0.3 },
                    opacity: { duration: 0.3 },
                    rotate: { 
                      duration: 1.5, 
                      ease: "linear", 
                      repeat: Infinity 
                    }
                  }
                }}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-lg"
              >
                <FaQuran className="text-[#0A0500] text-xl" />
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.3 } }}
                className="mt-4 text-amber-300 font-amiri text-lg"
              >
                Chargement...
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        key={key}
        variants={contentVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </>
  );
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
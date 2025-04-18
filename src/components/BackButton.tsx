"use client";

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Ne pas afficher le bouton sur la page d'accueil
  if (pathname === '/') {
    return null;
  }
  
  const handleGoBack = () => {
    router.back();
  };
  
  return (
    <motion.button
      onClick={handleGoBack}
      className="fixed left-4 top-24 z-30 w-10 h-10 flex items-center justify-center rounded-full bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 transition-colors shadow-md backdrop-blur-sm"
      aria-label="Retour"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaArrowLeft className="text-sm" />
    </motion.button>
  );
} 
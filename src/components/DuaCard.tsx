"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { FaShare, FaHeart, FaQuran, FaBook, FaUserGraduate, FaRegHeart, FaCopy, FaCheck } from "react-icons/fa";
import RelatedDuas from "./RelatedDuas";
import { DuaData } from './DuaAdapter';

interface DuaCardProps {
  dua: DuaData;
  typingText: string;
  isTyping: boolean;
  onSuggestionClick?: (suggestion: string) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (dua: DuaData) => void;
  onSaveToFavorites?: (dua: DuaData) => void;
}

// Définition du type Source pour le composant
interface SourceObject {
  type: string;
  reference: string;
  details?: string;
}

// Supprimer les suggestions de secours, elles ne sont pas utilisées
// const fallbackSuggestions: DuaSuggestion[] = [
//   { title: "Protection", dua: "Invocation pour la protection" },
//   { title: "Guidance", dua: "Invocation pour la guidance" }
// ];

// Ajoutons un composant de bouton d'action pour réutiliser le style
interface ActionButtonProps {
  onClick: () => void;
  title: string;
  label: string;
  icon: React.ReactNode;
  showCheck?: boolean;
}

const ActionButton = ({ onClick, title, label, icon, showCheck = false }: ActionButtonProps) => (
  <motion.button
    onClick={onClick}
    className="relative group"
    title={title}
    whileHover={{ scale: 1.15 }}
    whileTap={{ scale: 0.9 }}
  >
    <span className="absolute inset-0 rounded-full bg-amber-800/10 scale-0 group-hover:scale-100 transition-transform duration-300"></span>
    <span className="absolute inset-0 rounded-full bg-[url('/images/arabesque-pattern.svg')] bg-contain opacity-0 group-hover:opacity-10 transition-opacity"></span>
    <span className="relative flex items-center justify-center w-9 h-9 rounded-full bg-amber-900/20 border border-amber-700/30 text-amber-500 group-hover:text-amber-400 group-hover:border-amber-600/50 transition-all overflow-hidden">
      <span className="relative z-10">{showCheck ? <FaCheck className="h-4 w-4" /> : icon}</span>
      <span className="absolute inset-0 bg-gradient-to-br from-amber-800/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>
    </span>
    <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-xs text-amber-500/80 opacity-0 group-hover:opacity-100 transition-opacity">
      {label}
    </span>
  </motion.button>
);

// Ajoutons un composant pour les boutons de copie dans les sections
interface CopyButtonProps {
  onClick: () => void;
  title: string;
  showCheck: boolean;
}

const CopyButton = ({ onClick, title, showCheck }: CopyButtonProps) => (
  <motion.button
    onClick={onClick}
    className="absolute top-2 right-2 group"
    title={title}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
  >
    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-900/10 border border-amber-800/20 text-amber-600/40 group-hover:text-amber-500/80 group-hover:bg-amber-900/20 group-hover:border-amber-700/30 transition-all overflow-hidden">
      <span className="absolute inset-0 bg-[url('/images/star-pattern.svg')] bg-center bg-no-repeat bg-contain opacity-0 group-hover:opacity-10 transition-opacity"></span>
      {showCheck ? (
        <FaCheck className="h-3.5 w-3.5 relative z-10" />
      ) : (
        <FaCopy className="h-3.5 w-3.5 relative z-10" />
      )}
    </span>
  </motion.button>
);

export default function DuaCard({ 
  dua, 
  typingText, 
  isTyping, 
  onSuggestionClick,
  isFavorite = false,
  onToggleFavorite,
  onSaveToFavorites
}: DuaCardProps) {
  const [isClient, setIsClient] = useState(false);
  const [copyStatus, setCopyStatus] = useState<{ show: boolean; success: boolean; text: string }>({ show: false, success: false, text: '' });
  const [localIsFavorite, setLocalIsFavorite] = useState(isFavorite);
  const duaCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
    // Vérifier si ce dua est dans les favoris
    if (!isFavorite) {
      try {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        const isFav = Array.isArray(favorites) && favorites.some((fav) => fav.id === dua.id);
      setLocalIsFavorite(isFav);
      } catch (error) {
        console.error('Erreur lors de la lecture des favoris:', error);
      }
    }
  }, [dua.id, isFavorite]);

  // Met à jour l'état local quand la prop change
  useEffect(() => {
    setLocalIsFavorite(isFavorite);
  }, [isFavorite]);

  useEffect(() => {
    if (copyStatus.show) {
      const timer = setTimeout(() => {
        setCopyStatus({ show: false, success: false, text: '' });
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [copyStatus]);

  const copyToClipboard = async (text: string, type: string) => {
    if (!navigator.clipboard) {
      alert("Clipboard API not available");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopyStatus({ show: true, success: true, text: type });
      setTimeout(() => {
        setCopyStatus({ show: false, success: false, text: '' });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
      setCopyStatus({ show: true, success: false, text: type });
    }
  };

  const shareDua = async () => {
    if (!navigator.share) {
      alert("Web Share API not supported");
      return;
    }

    try {
      await navigator.share({
        title: "Dua Partagée",
        text: `${dua.arabicText || ''}\n\n${dua.transliteration || ''}\n\n${dua.translation || ''}`,
        url: window.location.href,
      });
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const getSourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "quran":
        return <FaQuran className="text-amber-600" />;
      case "hadith":
        return <FaBook className="text-amber-600" />;
      case "sunnah":
        return <FaUserGraduate className="text-amber-600" />;
      default:
        return null;
    }
  };

  // Fonction pour gérer la sélection d'une dua connexe
  const handleRelatedDuaClick = (relatedDua: any) => {
    if (onSuggestionClick) {
      // Utiliser le titre ou le texte de la dua connexe comme suggestion
      onSuggestionClick(relatedDua.title || relatedDua.translation || '');
    }
  };

  // Fonction de gestion des favoris
  const handleToggleFavorite = () => {
    // Mettre à jour l'état local immédiatement pour une UI réactive
    setLocalIsFavorite(!localIsFavorite);
    
    // Si une fonction de rappel est fournie, l'appeler
    if (onToggleFavorite) {
      onToggleFavorite(dua);
    } else if (onSaveToFavorites) {
      // Ancienne API de sauvegarde
      if (!localIsFavorite) {
        onSaveToFavorites(dua);
      }
    } else {
      try {
      // Comportement par défaut pour enregistrer dans localStorage
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      
      if (localIsFavorite) {
        // Supprimer des favoris
        const updatedFavorites = favorites.filter((fav: any) => fav.id !== dua.id);
        localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      } else {
        // Ajouter aux favoris
        localStorage.setItem('favorites', JSON.stringify([...favorites, dua]));
        }
      } catch (error) {
        console.error('Erreur lors de la manipulation des favoris:', error);
      }
    }
  };

  // Fonction utilitaire pour accéder aux propriétés de manière sécurisée
  const safeStr = (str: string | undefined): string => {
    return str || '';
  };

  // Fonction utilitaire pour accéder de manière sécurisée au contexte
  const safeContext = () => {
    return {
      context: dua.context || '',
      benefits: Array.isArray(dua.benefits) ? dua.benefits : [],
      occasions: Array.isArray(dua.occasions) ? dua.occasions : [],
    };
  };
  
  // Fonction sécurisée pour obtenir les données mot par mot
  const getWordByWord = () => {
    return Array.isArray(dua.wordByWord) 
      ? dua.wordByWord.map((word) => ({
      word: word.word || '',
      transliteration: word.transliteration || '',
      translation: word.translation || '',
      explanation: word.explanation || '',
      }))
      : [];
  };

  // S'assurer que relatedDuas est toujours un tableau
  const getRelatedDuas = () => {
    return Array.isArray(dua.relatedDuas) ? dua.relatedDuas : [];
  };

  // Nouvelle fonction pour générer des titres avec des motifs islamiques plus élaborés
  const renderOrnateTitle = (title: string) => (
    <div className="relative flex items-center justify-center my-5 overflow-hidden">
      {/* Bordure décorative gauche */}
      <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-28 h-10 overflow-hidden opacity-70">
        <svg viewBox="0 0 100 40" className="w-full h-full text-amber-600">
          <path d="M0,20 C20,5 40,0 60,0 C80,0 90,10 100,20 C90,30 80,40 60,40 C40,40 20,35 0,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100,20 C90,15 80,10 60,10 C40,10 20,15 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100,20 C90,25 80,30 60,30 C40,30 20,25 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="40" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="20" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="80" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </svg>
      </div>
      
      {/* Titre central */}
      <h3 className="relative text-center text-amber-500 text-xl font-playfair px-8 py-1">
        <span className="relative z-10">{title}</span>
        {/* Calligraphie décorative derrière le texte */}
        <span className="absolute inset-0 flex items-center justify-center opacity-10">
          <svg viewBox="0 0 100 20" className="w-full h-full text-amber-600">
            <path d="M10,10 C20,0 30,0 40,5 C50,10 60,15 70,10 C80,5 90,5 95,10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M5,15 C15,5 25,5 35,10 C45,15 55,20 65,15 C75,10 85,10 90,15" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        </span>
        {/* Soulignement élégant */}
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-600/60 to-transparent"></span>
      </h3>
      
      {/* Bordure décorative droite */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-28 h-10 overflow-hidden opacity-70 scale-x-[-1]">
        <svg viewBox="0 0 100 40" className="w-full h-full text-amber-600">
          <path d="M0,20 C20,5 40,0 60,0 C80,0 90,10 100,20 C90,30 80,40 60,40 C40,40 20,35 0,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M100,20 C90,15 80,10 60,10 C40,10 20,15 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <path d="M100,20 C90,25 80,30 60,30 C40,30 20,25 0,20" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="60" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="40" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="20" cy="20" r="2" fill="none" stroke="currentColor" strokeWidth="0.7" />
          <circle cx="80" cy="20" r="3" fill="none" stroke="currentColor" strokeWidth="0.7" />
        </svg>
      </div>
    </div>
  );

  // Remplacer renderLargeSectionTitle par une fonction plus élaborée
  const renderLargeSectionTitle = (title: string, iconType: 'diamond' | 'circle' | 'star' | 'flower' = 'diamond') => {
    return renderOrnateTitle(title);
  };

  // Un séparateur plus élaboré avec motifs islamiques
  const renderDecoSeparator = () => (
    <div className="my-8 relative">
      <div className="flex items-center justify-center">
        <div className="w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
        <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 flex items-center justify-center">
          <div className="w-12 h-12 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/70">
              <defs>
                <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="rgba(180, 83, 9, 0.8)" />
                  <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
                  <stop offset="100%" stopColor="rgba(180, 83, 9, 0.8)" />
                </linearGradient>
              </defs>
              {/* Motif géométrique islamic */}
              <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="2" />
              <path d="M50,20 L80,50 L50,80 L20,50 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1.5" />
              <path d="M50,30 L70,50 L50,70 L30,50 Z" fill="none" stroke="url(#goldGradient)" strokeWidth="1" />
              <circle cx="50" cy="50" r="10" fill="none" stroke="url(#goldGradient)" strokeWidth="0.7" />
              <circle cx="50" cy="50" r="5" fill="none" stroke="url(#goldGradient)" strokeWidth="0.5" />
              <circle cx="50" cy="50" r="2" fill="url(#goldGradient)" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );

  // Remplacer renderElegantDivider par une version plus élaborée
  const renderElegantDivider = () => renderDecoSeparator();

  // Nouvelle fonction de rendu pour le header avec ornements islamiques plus élaborés
  const renderElegantHeader = () => (
    <div className="relative border-b border-amber-900/30 pb-4 mb-6">
      {/* Coins ornementés */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-600/70 rounded-tl-sm"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-600/70 rounded-tr-sm"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-600/70 opacity-40 rounded-bl-sm"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-600/70 opacity-40 rounded-br-sm"></div>
      
      {/* Motif géométrique islamique enrichi */}
      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-12 h-12 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
          <defs>
            <linearGradient id="headerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(180, 83, 9, 0.8)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
              <stop offset="100%" stopColor="rgba(180, 83, 9, 0.8)" />
            </linearGradient>
          </defs>
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="url(#headerGradient)" strokeWidth="2" />
          <path d="M25,25 L75,25 L75,75 L25,75 Z" fill="none" stroke="url(#headerGradient)" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="url(#headerGradient)" strokeWidth="2" />
          <path d="M50,30 C60,40 60,60 50,70 C40,60 40,40 50,30" fill="none" stroke="url(#headerGradient)" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-1/2 right-0 transform -translate-y-1/2 w-12 h-12 opacity-40">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
          <defs>
            <linearGradient id="headerGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgba(180, 83, 9, 0.8)" />
              <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
              <stop offset="100%" stopColor="rgba(180, 83, 9, 0.8)" />
            </linearGradient>
          </defs>
          <path d="M50,10 L90,50 L50,90 L10,50 Z" fill="none" stroke="url(#headerGradient2)" strokeWidth="2" />
          <path d="M25,25 L75,25 L75,75 L25,75 Z" fill="none" stroke="url(#headerGradient2)" strokeWidth="2" />
          <circle cx="50" cy="50" r="20" fill="none" stroke="url(#headerGradient2)" strokeWidth="2" />
          <path d="M50,30 C60,40 60,60 50,70 C40,60 40,40 50,30" fill="none" stroke="url(#headerGradient2)" strokeWidth="1" />
        </svg>
      </div>
      
      {/* Nouveau fond décoratif pour le titre */}
      <div className="absolute inset-0 opacity-5 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/arabesque-pattern.svg')] bg-repeat opacity-30"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700/0 via-amber-600/30 to-amber-700/0"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-amber-700/0 via-amber-600/30 to-amber-700/0"></div>
      </div>
      
      <div className="flex justify-between items-center px-5 relative z-10">
        <h2 className="text-2xl font-playfair text-amber-500 py-2 relative">
          <span className="relative">
          {dua.title || "Dua"}
          <span className="absolute -bottom-3 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600/40 via-amber-500/70 to-amber-600/40"></span>
          </span>
          {/* Calligraphie décorative derrière le titre */}
          <span className="absolute -bottom-1 left-0 right-0 text-center opacity-20 text-xs">
            ﷽
          </span>
        </h2>
        <div className="flex space-x-4">
          <ActionButton
            onClick={() => copyToClipboard(`${safeStr(dua.arabicText)}\n\n${safeStr(dua.transliteration)}\n\n${safeStr(dua.translation)}`, 'all')}
            title="Copier tout le contenu"
            label="Copier"
            icon={<FaCopy className="h-4 w-4" />}
            showCheck={copyStatus.show && copyStatus.text === 'all' && copyStatus.success}
          />
          
          <ActionButton
            onClick={shareDua}
            title="Partager cette du'a"
            label="Partager"
            icon={<FaShare className="h-4 w-4" />}
          />
          
          <ActionButton
            onClick={handleToggleFavorite}
            title={localIsFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            label={localIsFavorite ? "Retirer" : "Favori"}
            icon={localIsFavorite ? <FaHeart className="h-4 w-4 text-amber-500" /> : <FaRegHeart className="h-4 w-4" />}
          />
        </div>
      </div>
    </div>
  );
  
  // Amélioré: rendu de la section arabe avec cadre décoratif
  const renderArabicSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative mb-6"
    >
      {renderLargeSectionTitle('Texte Arabe', 'flower')}
      <div className="relative p-6 bg-[#0D0800] rounded-lg border border-amber-800/20 shadow-inner">
        {/* Motifs d'angle arabesque */}
        <div className="absolute top-0 left-0 w-12 h-12 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <path d="M0,0 C30,10 40,30 50,50 C60,30 70,10 100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute top-0 right-0 w-12 h-12 opacity-20 transform scale-x-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <path d="M0,0 C30,10 40,30 50,50 C60,30 70,10 100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-12 h-12 opacity-20 transform scale-y-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <path d="M0,0 C30,10 40,30 50,50 C60,30 70,10 100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        <div className="absolute bottom-0 right-0 w-12 h-12 opacity-20 transform scale-x-[-1] scale-y-[-1]">
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600">
            <path d="M0,0 C30,10 40,30 50,50 C60,30 70,10 100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
        
        <motion.p 
          className="text-2xl md:text-3xl leading-relaxed text-center font-arabic text-amber-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {safeStr(dua.arabicText)}
        </motion.p>
        <CopyButton
          onClick={() => copyToClipboard(safeStr(dua.arabicText), 'arabic')}
          title="Copier le texte arabe"
          showCheck={copyStatus.show && copyStatus.text === 'arabic' && copyStatus.success}
        />
      </div>
    </motion.div>
  );
  
  // Amélioré: rendu de la section translittération
  const renderTransliterationSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
      className="relative mb-6"
    >
      {renderLargeSectionTitle('Translitération', 'flower')}
      <div className="relative p-5 bg-[#0D0800] rounded-lg border border-amber-800/20 shadow-inner">
        {/* Bordure décorative subtile */}
        <div className="absolute inset-0 border-2 border-amber-800/10 rounded-lg pointer-events-none"></div>
        
        <p className="text-lg text-center text-amber-300/90 italic px-4 py-2">
          {safeStr(dua.transliteration)}
        </p>
        <CopyButton
          onClick={() => copyToClipboard(safeStr(dua.transliteration), 'transliteration')}
          title="Copier la translitération"
          showCheck={copyStatus.show && copyStatus.text === 'transliteration' && copyStatus.success}
        />
      </div>
    </motion.div>
  );
  
  // Remplacer renderTranslationSection avec une animation pendant la génération
  const renderTranslationSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
      className="relative mb-6"
    >
      {renderLargeSectionTitle('Traduction', 'flower')}
      <div className="relative p-5 bg-[#0D0800] rounded-lg border border-amber-800/20 shadow-inner">
        {/* Bordure calligraphique */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-700/20 to-transparent"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-amber-700/20 to-transparent"></div>
        
        {isTyping ? (
          <div className="py-4 flex flex-col items-center">
            <div className="loading-animation relative w-full h-16 mb-2">
              {/* Animation géométrique islamique */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16"
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "linear" 
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/70">
                  <polygon points="50,5 61,20 80,25 65,40 70,60 50,50 30,60 35,40 20,25 39,20" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="1" 
                    strokeLinejoin="round"
                  />
                  <polygon points="50,15 57,25 70,28 60,38 63,50 50,45 37,50 40,38 30,28 43,25" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.7" 
                    strokeLinejoin="round"
                  />
                  <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3,3" />
                </svg>
              </motion.div>
              
              {/* Cercles concentriques animés */}
              <motion.div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20"
                animate={{ 
                  rotate: -360,
                  opacity: [0.3, 0.7, 0.3]
                }}
                transition={{ 
                  duration: 6, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              >
                <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/40">
                  <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.7" />
                  <path 
                    d="M50,30 C60,40 60,60 50,70 C40,60 40,40 50,30" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.7"
                  />
                  <path 
                    d="M30,50 C40,40 60,40 70,50 C60,60 40,60 30,50" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="0.7"
                  />
                  <circle cx="50" cy="50" r="3" fill="currentColor" />
                </svg>
              </motion.div>
              
              {/* Points d'encre calligraphiques */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
                <motion.div 
                  className="mx-1 w-2 h-2 rounded-full bg-amber-600/80"
                  animate={{ 
                    y: [-10, 0, -10],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: 0,
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="mx-1 w-2 h-2 rounded-full bg-amber-600/80"
                  animate={{ 
                    y: [-10, 0, -10],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: 0.3,
                    ease: "easeInOut" 
                  }}
                />
                <motion.div 
                  className="mx-1 w-2 h-2 rounded-full bg-amber-600/80"
                  animate={{ 
                    y: [-10, 0, -10],
                    opacity: [0.4, 1, 0.4]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    delay: 0.6,
                    ease: "easeInOut" 
                  }}
                />
              </div>
            </div>
            
            {/* Texte en cours de génération avec effet de machine à écrire */}
            <div className="text-center relative overflow-hidden">
              <motion.p 
                className="text-lg text-amber-300/90"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {typingText}
              </motion.p>
              
              {/* Indication subtile de chargement */}
              <motion.div 
                className="absolute bottom-0 left-0 h-0.5 bg-amber-600/40"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ 
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
              />
              
              {/* Calligraphie ornementale comme arrière-plan */}
              <div className="absolute -bottom-6 left-0 w-full text-center opacity-10 pointer-events-none">
                <span className="text-2xl text-amber-500 font-arabic">﷽</span>
              </div>
            </div>
            
            <div className="mt-4 text-center text-amber-500/60 text-xs">
              Génération de l'invocation en cours...
            </div>
          </div>
        ) : (
        <p className="text-lg text-center text-amber-200 px-4 py-2">
            {safeStr(dua.translation)}
        </p>
        )}
        
        <CopyButton
          onClick={() => copyToClipboard(safeStr(dua.translation), 'translation')}
          title="Copier la traduction"
          showCheck={copyStatus.show && copyStatus.text === 'translation' && copyStatus.success}
        />
      </div>
    </motion.div>
  );
  
  // Amélioré: rendu de la section source
  const renderSourceSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5 }}
      className="text-center mt-4 mb-8"
    >
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D0800] rounded-full border border-amber-900/20 relative">
        {/* Décoration de la source */}
        <span className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-amber-700/40 rounded-full"></span>
        <span className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-amber-700/40 rounded-full"></span>
        
        {dua.source && getSourceIcon(dua.source.type)}
        <span className="text-amber-400/90 text-sm">
          {dua.source ? dua.source.reference : "Source inconnue"}
        </span>
      </div>
      
      {/* Affichage détaillé de la source si c'est un hadith */}
      {dua.source && dua.source.type === "hadith" && dua.source.reference && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-3 text-center"
        >
          <div className="inline-flex flex-col items-center">
            <div className="flex items-center">
              <span className="px-2 py-1 bg-amber-900/20 text-amber-400/80 text-xs rounded-full border border-amber-800/20">
                <span className="mr-1 inline-block">•</span>
                {dua.source.reference.includes("Sahih") ? "Authentique" : 
                 dua.source.reference.includes("Hassan") || dua.source.reference.includes("Hasan") ? "Bon" : 
                 dua.source.reference.includes("Daif") || dua.source.reference.includes("Da'if") ? "Faible" : ""}
              </span>
            </div>
            {(dua.source as SourceObject).details && (
              <span className="mt-2 text-xs text-amber-500/70 italic">
                {(dua.source as SourceObject).details}
              </span>
            )}
      </div>
        </motion.div>
      )}
    </motion.div>
  );

  // Amélioré: rendu de la section bienfaits
  const renderBenefitsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.7 }}
      className="mt-10 mb-8"
    >
      <div className="border-t border-amber-900/20 pt-6 relative">
        {/* Nouveaux ornements latéraux avec motifs islamiques */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 opacity-30">
          <svg viewBox="0 0 100 25" className="w-full h-full text-amber-600">
            <path d="M50,0 C60,10 70,15 100,15 L100,25 L0,25 L0,15 C30,15 40,10 50,0 Z" fill="currentColor" />
            <path d="M30,15 C35,10 40,5 50,5 C60,5 65,10 70,15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="50" cy="5" r="3" fill="currentColor" />
            <circle cx="30" cy="15" r="2" fill="currentColor" />
            <circle cx="70" cy="15" r="2" fill="currentColor" />
          </svg>
        </div>
        
        {renderLargeSectionTitle('Bienfaits', 'flower')}
        
        <div className="relative px-4 py-3 rounded-lg bg-gradient-to-b from-[#0D0800] to-black/80 border border-amber-900/20">
          {/* Nouveaux motifs décoratifs aux coins */}
          <div className="absolute top-0 left-0 w-16 h-16 opacity-20 pointer-events-none">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
              <path d="M0,0 L40,0 C30,10 20,20 10,30 C5,35 0,40 0,40 Z" fill="currentColor" />
              <path d="M5,0 C15,15 25,20 40,25" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,5 C15,15 20,25 25,40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="5" cy="5" r="2" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 w-16 h-16 opacity-20 pointer-events-none transform scale-x-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
              <path d="M0,0 L40,0 C30,10 20,20 10,30 C5,35 0,40 0,40 Z" fill="currentColor" />
              <path d="M5,0 C15,15 25,20 40,25" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,5 C15,15 20,25 25,40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="5" cy="5" r="2" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-0 left-0 w-16 h-16 opacity-20 pointer-events-none transform scale-y-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
              <path d="M0,0 L40,0 C30,10 20,20 10,30 C5,35 0,40 0,40 Z" fill="currentColor" />
              <path d="M5,0 C15,15 25,20 40,25" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,5 C15,15 20,25 25,40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="5" cy="5" r="2" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          <div className="absolute bottom-0 right-0 w-16 h-16 opacity-20 pointer-events-none transform scale-x-[-1] scale-y-[-1]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
              <path d="M0,0 L40,0 C30,10 20,20 10,30 C5,35 0,40 0,40 Z" fill="currentColor" />
              <path d="M5,0 C15,15 25,20 40,25" fill="none" stroke="currentColor" strokeWidth="1" />
              <path d="M0,5 C15,15 20,25 25,40" fill="none" stroke="currentColor" strokeWidth="1" />
              <circle cx="5" cy="5" r="2" fill="currentColor" />
              <circle cx="10" cy="10" r="1.5" fill="currentColor" />
              <circle cx="15" cy="15" r="1" fill="currentColor" />
            </svg>
          </div>
          
          <ul className="space-y-2 relative z-10">
            {safeContext().benefits.map((benefit, index) => (
              <li key={index} className="flex items-start group transition-all duration-300 pl-2 hover:bg-amber-900/10 rounded-lg">
                <span className="text-amber-500 mr-3 mt-0.5 transform group-hover:rotate-45 transition-transform">
                  {/* Nouveau motif décoratif pour les puces */}
                  <svg viewBox="0 0 100 100" className="w-4 h-4">
                    <path d="M50,10 L50,90 M10,50 L90,50" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                    <path d="M30,30 L70,70 M70,30 L30,70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="15" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-amber-200/80">{benefit}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );

  // Amélioré: rendu de la section occasions
  const renderOccasionsSection = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="mt-10 mb-8"
    >
      <div className="border-t border-amber-900/20 pt-6 relative">
        {/* Nouveaux ornements latéraux */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-24 h-6 opacity-30">
          <svg viewBox="0 0 100 25" className="w-full h-full text-amber-600">
            <path d="M0,15 C30,15 40,0 50,0 C60,0 70,15 100,15 L100,25 L0,25 Z" fill="currentColor" />
            <path d="M20,15 C30,5 40,5 50,10 C60,5 70,5 80,15" fill="none" stroke="currentColor" strokeWidth="1" />
            <circle cx="20" cy="15" r="2" fill="currentColor" />
            <circle cx="50" cy="10" r="3" fill="currentColor" />
            <circle cx="80" cy="15" r="2" fill="currentColor" />
          </svg>
        </div>
        
        {renderLargeSectionTitle('Occasions', 'flower')}
        
        <div className="relative px-4 py-3 rounded-lg bg-gradient-to-b from-[#0D0800] to-black/80 border border-amber-900/20">
          {/* Nouveaux motifs décoratifs centraux */}
          <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64">
              <svg viewBox="0 0 200 200" className="w-full h-full text-amber-500/50">
                <defs>
                  <pattern id="occasionPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M0,10 L20,10 M10,0 L10,20" stroke="currentColor" strokeWidth="0.5" />
                    <path d="M5,5 L15,15 M15,5 L5,15" stroke="currentColor" strokeWidth="0.3" />
                  </pattern>
                </defs>
                <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="100" cy="100" r="90" fill="url(#occasionPattern)" />
                <path d="M100,20 C140,40 160,60 180,100 C160,140 140,160 100,180 C60,160 40,140 20,100 C40,60 60,40 100,20 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                <path d="M100,40 C130,55 145,70 160,100 C145,130 130,145 100,160 C70,145 55,130 40,100 C55,70 70,55 100,40 Z" fill="none" stroke="currentColor" strokeWidth="0.7" />
              </svg>
            </div>
          </div>
          
          <ul className="space-y-2 relative z-10">
            {safeContext().occasions.map((occasion, index) => (
              <li key={index} className="flex items-start group transition-all duration-300 pl-2 hover:bg-amber-900/10 rounded-lg">
                <span className="text-amber-500 mr-3 mt-0.5 transform group-hover:rotate-45 transition-transform">
                  {/* Nouveau motif pour les puces */}
                  <svg viewBox="0 0 100 100" className="w-4 h-4">
                    <path d="M50,10 L50,90 M10,50 L90,50" stroke="currentColor" strokeWidth="12" strokeLinecap="round" />
                    <path d="M30,30 L70,70 M70,30 L30,70" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
                    <circle cx="50" cy="50" r="15" fill="currentColor" />
                  </svg>
                </span>
                <span className="text-amber-200/80">{occasion}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );

  // Nouvelle section: Références historiques 
  const renderHistoricalReferencesSection = () => {
    // Vérifier si nous avons des données historiques à afficher
    const hasHistoricalData = dua.historicalReferences || 
      (dua.source && dua.source.type === "hadith") || 
      (safeContext().context && safeContext().context.length > 10);
    
    if (!hasHistoricalData) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="mt-10 mb-8"
      >
        <div className="border-t border-amber-900/20 pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
          
          {renderLargeSectionTitle('Références Historiques', 'flower')}
          
          <div className="relative px-4 py-3 rounded-lg bg-[#0D0800]/60 border border-amber-900/10">
            {dua.historicalReferences ? (
              <p className="text-amber-200/80 leading-relaxed">{dua.historicalReferences}</p>
            ) : dua.source && dua.source.type === "hadith" ? (
              <div className="space-y-3">
                <p className="text-amber-200/80 leading-relaxed">
                  Cette invocation est rapportée dans un hadith authentique. Les hadiths sont les paroles et actions 
                  du Prophète Muhammad ﷺ, transmises par ses compagnons et compilées par des savants musulmans.
                </p>
                <p className="text-amber-200/80 leading-relaxed">
                  {`La référence précise est: ${dua.source.reference}. ${(dua.source as SourceObject).details || ''}`}
                </p>
              </div>
            ) : safeContext().context ? (
              <p className="text-amber-200/80 leading-relaxed">{safeContext().context}</p>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  };

  // Nouvelle section: Usage quotidien
  const renderDailyUsageSection = () => {
    // Nous créons cette section même sans données spécifiques car elle est toujours utile
    const occasions = safeContext().occasions || [];
    const benefits = safeContext().benefits || [];
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="mt-10 mb-8"
      >
        <div className="border-t border-amber-900/20 pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
          
          {renderLargeSectionTitle('Usage Quotidien', 'flower')}
          
          <div className="relative px-4 py-3 rounded-lg bg-[#0D0800]/60 border border-amber-900/10">
            <div className="space-y-4">
              <p className="text-amber-200/80 leading-relaxed">
                Cette invocation peut être récitée:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20">
                  <h4 className="text-amber-400 mb-2 flex items-center">
                    <span className="mr-2">
                      <svg viewBox="0 0 100 100" className="w-4 h-4">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" />
                        <circle cx="50" cy="50" r="20" fill="currentColor" />
                      </svg>
                    </span>
                    Fréquence
                  </h4>
                  <p className="text-amber-200/80 text-sm">
                    {dua.frequency || (
                      occasions.length > 0 
                        ? "Spécifiquement dans les occasions mentionnées ci-dessus."
                        : "Autant que possible, particulièrement dans les moments de besoin spirituel."
                    )}
                  </p>
                </div>
                
                <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20">
                  <h4 className="text-amber-400 mb-2 flex items-center">
                    <span className="mr-2">
                      <svg viewBox="0 0 100 100" className="w-4 h-4">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" />
                        <circle cx="50" cy="50" r="20" fill="currentColor" />
                      </svg>
                    </span>
                    Intention
                  </h4>
                  <p className="text-amber-200/80 text-sm">
                    Réciter avec sincérité et concentration, en comprenant le sens des mots.
                  </p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20 mt-3">
                <h4 className="text-amber-400 mb-2 flex items-center">
                  <span className="mr-2">
                    <svg viewBox="0 0 100 100" className="w-4 h-4">
                      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="10" />
                      <circle cx="50" cy="50" r="20" fill="currentColor" />
                    </svg>
                  </span>
                  Préparation conseillée
                </h4>
                <p className="text-amber-200/80 text-sm">
                  {dua.preparation || "Être en état de pureté (wudu) si possible. Se tourner vers la Qibla. Élever les mains au niveau de la poitrine."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Nouvelle section: Vertus spirituelles
  const renderSpiritualVirtuesSection = () => {
    const benefits = safeContext().benefits || [];
    if (benefits.length === 0 && !dua.spiritualVirtues) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
        className="mt-10 mb-8"
      >
        <div className="border-t border-amber-900/20 pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
          
          {renderLargeSectionTitle('Vertus Spirituelles', 'flower')}
          
          <div className="relative px-4 py-3 rounded-lg">
            {dua.spiritualVirtues ? (
              <p className="text-amber-200/80 leading-relaxed">{dua.spiritualVirtues}</p>
            ) : benefits.length > 0 ? (
              <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20">
                <p className="text-amber-200/80 mb-3">
                  La récitation de cette invocation avec sincérité et compréhension contribue à:
                </p>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <span className="text-amber-500 mr-2 mt-0.5">•</span>
                      <span className="text-amber-200/80">{benefit}</span>
                    </li>
                  ))}
                  <li className="flex items-start text-sm mt-2">
                    <span className="text-amber-500 mr-2 mt-0.5">•</span>
                    <span className="text-amber-200/80">Renforcer votre connexion spirituelle avec Allah.</span>
                  </li>
                  <li className="flex items-start text-sm">
                    <span className="text-amber-500 mr-2 mt-0.5">•</span>
                    <span className="text-amber-200/80">Cultiver la patience et la gratitude dans votre cœur.</span>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </motion.div>
    );
  };

  // Nouvelle section: Guide de prononciation
  const renderPronunciationGuideSection = () => {
    if (!dua.transliteration) return null;
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
        className="mt-10 mb-8"
      >
        <div className="border-t border-amber-900/20 pt-6 relative">
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
          
          {renderLargeSectionTitle('Guide de Prononciation', 'flower')}
          
          <div className="relative px-4 py-3 rounded-lg bg-[#0D0800]/60 border border-amber-900/10">
            <p className="text-amber-200/80 mb-4">
              Pour réciter cette invocation correctement, suivez la translittération tout en écoutant attentivement la prononciation arabe. 
              Voici quelques conseils pour une meilleure prononciation:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20">
                <h4 className="text-amber-400 mb-2 text-sm font-medium">Consonnes spécifiques</h4>
                <ul className="space-y-1 text-xs">
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">'</span>
                    <span className="text-amber-200/80">Coup de glotte (arrêt court)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">ḥ</span>
                    <span className="text-amber-200/80">H aspiré (plus fort que h)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">dh</span>
                    <span className="text-amber-200/80">Comme "the" en anglais</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">kh</span>
                    <span className="text-amber-200/80">Comme "ch" allemand</span>
                  </li>
                </ul>
              </div>
              
              <div className="p-3 rounded-lg border border-amber-800/20 bg-black/20">
                <h4 className="text-amber-400 mb-2 text-sm font-medium">Voyelles longues</h4>
                <ul className="space-y-1 text-xs">
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">ā</span>
                    <span className="text-amber-200/80">a long (comme "aa")</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">ī</span>
                    <span className="text-amber-200/80">i long (comme "ee")</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-amber-300 font-semibold">ū</span>
                    <span className="text-amber-200/80">ou long (comme "oo")</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <p className="text-amber-200/80 text-xs mt-4 italic">
              Suggestion: Écoutez des enregistrements de cette invocation par des récitateurs qualifiés pour perfectionner votre prononciation.
            </p>
          </div>
        </div>
      </motion.div>
    );
  };

  // Ajouter également une animation générique pour les chargements
  const LoadingAnimation = () => (
    <div className="flex flex-col items-center justify-center py-10">
      <div className="relative w-24 h-24">
        {/* Étoile islamique rotative */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            rotate: 360,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity,
            ease: "linear" 
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/60">
            <defs>
              <linearGradient id="loadingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(180, 83, 9, 0.4)" />
                <stop offset="50%" stopColor="rgba(245, 158, 11, 0.6)" />
                <stop offset="100%" stopColor="rgba(180, 83, 9, 0.4)" />
              </linearGradient>
            </defs>
            <path 
              d="M50,10 L58,35 L85,35 L64,51 L72,76 L50,60 L28,76 L36,51 Z" 
              fill="none" 
              stroke="url(#loadingGradient)" 
              strokeWidth="1.5"
            />
            <path 
              d="M50,20 L55,35 L70,35 L58,45 L63,60 L50,50 L37,60 Z" 
              fill="none" 
              stroke="url(#loadingGradient)" 
              strokeWidth="1"
            />
            <circle cx="50" cy="50" r="35" fill="none" stroke="url(#loadingGradient)" strokeWidth="0.5" strokeDasharray="5,5" />
            <circle cx="50" cy="50" r="5" fill="none" stroke="url(#loadingGradient)" strokeWidth="1" />
          </svg>
        </motion.div>
        
        {/* Rosette intérieure rotative */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            rotate: -180,
            scale: [1, 0.95, 1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity,
            ease: "easeInOut" 
          }}
        >
          <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500/40">
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.7" />
            <path 
              d="M50,30 C60,40 60,60 50,70 C40,60 40,40 50,30" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.7"
            />
            <path 
              d="M30,50 C40,40 60,40 70,50 C60,60 40,60 30,50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.7"
            />
            <circle cx="50" cy="50" r="3" fill="currentColor" />
          </svg>
        </motion.div>
      </div>
      
      <div className="mt-6 text-amber-500/80 text-sm text-center">
        Préparation de l'invocation
        <div className="flex justify-center mt-1">
          <motion.span 
            className="w-1.5 h-1.5 mx-0.5 rounded-full bg-amber-600/60"
            animate={{ 
              y: [-3, 0, -3],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              delay: 0
            }}
          />
          <motion.span 
            className="w-1.5 h-1.5 mx-0.5 rounded-full bg-amber-600/60"
            animate={{ 
              y: [-3, 0, -3],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              delay: 0.2
            }}
          />
          <motion.span 
            className="w-1.5 h-1.5 mx-0.5 rounded-full bg-amber-600/60"
            animate={{ 
              y: [-3, 0, -3],
              opacity: [0.4, 1, 0.4]
            }}
            transition={{ 
              duration: 1.2, 
              repeat: Infinity,
              delay: 0.4
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div 
      ref={duaCardRef}
      className="bg-[#0C0700] rounded-xl shadow-xl overflow-hidden border border-amber-900/40 relative"
    >
      {/* Motif de fond subtil */}
      <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-[0.03] pointer-events-none"></div>
      
      {/* Coins ornementés du cadre principal */}
      <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/30">
          <path d="M0,0 L100,0 L100,20 C80,20 20,20 20,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,0 L20,0 C20,40 60,80 100,80 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none transform scale-x-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/30">
          <path d="M0,0 L100,0 L100,20 C80,20 20,20 20,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,0 L20,0 C20,40 60,80 100,80 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 left-0 w-20 h-20 pointer-events-none transform scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/30">
          <path d="M0,0 L100,0 L100,20 C80,20 20,20 20,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,0 L20,0 C20,40 60,80 100,80 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none transform scale-x-[-1] scale-y-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full text-amber-600/30">
          <path d="M0,0 L100,0 L100,20 C80,20 20,20 20,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M0,0 L20,0 C20,40 60,80 100,80 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </div>
      
      <div className="p-8 relative z-10">
        {renderElegantHeader()}
        
        {renderElegantDivider()}
        
        {renderArabicSection()}
        
        {renderElegantDivider()}
        
        {renderTransliterationSection()}
        
        {renderElegantDivider()}
        
        {renderTranslationSection()}
        
        {renderSourceSection()}
        
        {/* Contexte si disponible */}
        {safeContext().context && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-10 mb-8"
          >
            <div className="border-t border-amber-900/20 pt-6 relative">
              {/* Ornements latéraux - Mise à jour pour correspondre à la section Occasions */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
              
              {renderLargeSectionTitle('Contexte', 'flower')}
              
              <div className="relative p-5 bg-[#0D0800]/60 rounded-lg border border-amber-900/10">
                <p className="text-amber-200/80 leading-relaxed">
                  {safeContext().context}
                </p>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Bienfaits si disponibles */}
        {safeContext().benefits && safeContext().benefits.length > 0 && (
          renderBenefitsSection()
        )}
        
        {/* Occasions si disponibles */}
        {safeContext().occasions && safeContext().occasions.length > 0 && (
          renderOccasionsSection()
        )}

        {/* Nouvelles sections instructives */}
        {renderHistoricalReferencesSection()}
        
        {renderDailyUsageSection()}
        
        {renderSpiritualVirtuesSection()}
        
        {renderPronunciationGuideSection()}
        
        {/* Analyse mot par mot si disponible */}
        {getWordByWord().length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 mb-8"
          >
            <div className="border-t border-amber-900/20 pt-6 relative">
              {/* Ornements latéraux - Mise à jour pour correspondre à la section Occasions */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
              
              {renderLargeSectionTitle('Analyse Mot par Mot', 'flower')}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {getWordByWord().map((wordAnalysis, index) => (
                  <div key={index} className="bg-[#0D0800] p-3 rounded border border-amber-900/20 hover:border-amber-700/40 transition-all group relative overflow-hidden">
                    {/* Motif d'arrière-plan */}
                    <div className="absolute inset-0 bg-gradient-to-br from-amber-900/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {/* Ornements d'angle */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-amber-700/30 rounded-tl"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-amber-700/30 rounded-tr"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-amber-700/30 rounded-bl"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-amber-700/30 rounded-br"></div>
                    
                    <div className="text-right mb-1">
                      <span className="text-xl text-amber-400 font-arabic group-hover:text-amber-300 transition-colors">{wordAnalysis.word}</span>
                    </div>
                    <div className="text-sm text-amber-300/90 italic mb-1 group-hover:text-amber-200 transition-colors">{wordAnalysis.transliteration}</div>
                    <div className="text-sm text-amber-200/80 group-hover:text-amber-100 transition-colors">{wordAnalysis.translation}</div>
                    {wordAnalysis.explanation && (
                      <div className="mt-1 text-xs text-amber-400/60 italic group-hover:text-amber-400/80 transition-colors">
                        {wordAnalysis.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Duas connexes si disponibles */}
        {(dua.relatedDuas && dua.relatedDuas.length > 0) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="mt-12"
          >
            <div className="border-t border-amber-900/20 pt-6 relative">
              {/* Ornements latéraux - Mise à jour pour correspondre à la section Occasions */}
              <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
              
              {renderLargeSectionTitle('Duas Connexes', 'flower')}
              
              <RelatedDuas 
                relatedDuas={getRelatedDuas()} 
                onSelectDua={handleRelatedDuaClick}
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 
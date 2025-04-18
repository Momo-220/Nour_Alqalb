"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaSearch, FaQuran, FaBookOpen, FaMosque } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import IslamicChatbot from '@/components/IslamicChatbot';
import { ThemeProvider } from '@/context/ThemeContext';

// Données des ressources
const resourceCards = [
  {
    title: "Coran en ligne",
    description: "Accédez au Coran avec traduction et tafsir",
    icon: "📖",
    link: "https://quran.com/fr"
  },
  {
    title: "Collection de Hadiths",
    description: "Explorez les enseignements du Prophète (SAW)",
    icon: "🔍",
    link: "https://sunnah.com/"
  },
  {
    title: "Guides de prière",
    description: "Apprenez les différentes prières en Islam",
    icon: "🕌",
    link: "https://myislam.org/prayer-times/"
  },
  {
    title: "Calendrier islamique",
    description: "Dates importantes du calendrier musulman",
    icon: "📅",
    link: "https://www.islamicfinder.org/islamic-calendar/"
  },
  {
    title: "Cours d'arabe",
    description: "Apprenez l'arabe pour mieux comprendre les textes",
    icon: "🔤",
    link: "https://www.bayyinah.tv/"
  },
  {
    title: "Bibliothèque islamique",
    description: "Accédez à une vaste collection de livres islamiques",
    icon: "📚",
    link: "https://www.kalamullah.com/"
  }
];

// Citations inspirantes
const quotations = [
  {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    translation: "En vérité, avec la difficulté il y a une facilité.",
    source: "Sourate Al-Inshirah (94:6)"
  },
  {
    arabic: "فَاذْكُرُونِي أَذْكُرْكُمْ",
    translation: "Souvenez-vous de Moi, Je me souviendrai de vous.",
    source: "Sourate Al-Baqarah (2:152)"
  },
  {
    arabic: "وَإِذَا سَأَلَكَ عِبَادِي عَنِّي فَإِنِّي قَرِيبٌ",
    translation: "Et quand Mes serviteurs t'interrogent sur Moi, alors Je suis tout proche.",
    source: "Sourate Al-Baqarah (2:186)"
  },
  {
    arabic: "لا إِكْرَاهَ فِي الدِّينِ",
    translation: "Nulle contrainte en religion.",
    source: "Sourate Al-Baqarah (2:256)"
  }
];

const ExplorerPage = () => {
  const [activeTab, setActiveTab] = useState<'chatbot' | 'resources' | 'references'>('chatbot');

  // Animation de transition entre les onglets
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  // Rendu du contenu en fonction de l'onglet actif
  const renderContent = () => {
    switch (activeTab) {
      case 'chatbot':
        return (
          <motion.div
            key="chatbot"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="w-full"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-playfair text-amber-500 mb-2">Assistant Islamique</h2>
              <p className="text-amber-300/70 max-w-2xl mx-auto text-sm">
                Posez vos questions sur l'Islam, les pratiques religieuses et la spiritualité.
                Notre assistant s'appuie sur des sources fiables pour vous guider.
              </p>
            </div>
            <IslamicChatbot />
          </motion.div>
        );
      
      case 'resources':
        return (
          <motion.div
            key="resources"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="w-full"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-playfair text-amber-500 mb-2">Ressources Islamiques</h2>
              <p className="text-amber-300/70 max-w-2xl mx-auto text-sm">
                Collections de ressources islamiques fiables pour approfondir votre compréhension.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Cartes de ressources */}
              {resourceCards.map((resource, index) => (
                <div 
                  key={index}
                  className="bg-[#0D0800] rounded-lg border border-amber-900/30 overflow-hidden group hover:border-amber-700/40 transition-all shadow-md"
                >
                  <div className="h-40 overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-amber-900/10 to-black/40"></div>
                    <div className="absolute inset-0 bg-[url('/images/arabesque-pattern.svg')] bg-repeat opacity-5"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-4xl text-amber-500/60">{resource.icon}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-medium text-amber-400 mb-2">{resource.title}</h3>
                    <p className="text-amber-200/70 text-sm mb-3">{resource.description}</p>
                    <a 
                      href={resource.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block px-4 py-2 bg-amber-900/20 text-amber-400 text-sm rounded-full border border-amber-800/30 hover:bg-amber-900/30 transition-colors"
                    >
                      Explorer
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
      
      case 'references':
        return (
          <motion.div
            key="references"
            initial="hidden"
            animate="visible"
            variants={tabVariants}
            className="w-full"
          >
            <div className="mb-6 text-center">
              <h2 className="text-2xl font-playfair text-amber-500 mb-2">Références et Citations</h2>
              <p className="text-amber-300/70 max-w-2xl mx-auto text-sm">
                Collection de citations inspirantes du Coran et des hadiths.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto space-y-6">
              {quotations.map((quote, index) => (
                <div 
                  key={index}
                  className="bg-[#0D0800] rounded-lg border border-amber-900/30 p-5 relative group hover:border-amber-700/40 transition-all"
                >
                  {/* Motif décoratif */}
                  <div className="absolute top-0 right-0 w-20 h-20 opacity-10 pointer-events-none">
                    <svg viewBox="0 0 100 100" className="w-full h-full text-amber-500">
                      <path d="M0,0 C30,10 40,30 50,50 C60,30 70,10 100,0 L100,100 L0,100 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    </svg>
                  </div>
                  
                  <div className="mb-3 text-right">
                    <p className="text-xl font-arabic text-amber-300">{quote.arabic}</p>
                  </div>
                  
                  <div className="mb-3">
                    <p className="text-amber-200/90 italic">{quote.translation}</p>
                  </div>
                  
                  <div className="text-amber-500/70 text-sm text-right">
                    <p>{quote.source}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        );
        
      default:
        return <div>Contenu non disponible</div>;
    }
  };

  return (
    <div className="min-h-screen bg-[#080400] text-amber-50 flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6">
        {/* Grand titre décoratif */}
        <div className="text-center mb-8 relative">
          <div className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-px bg-gradient-to-r from-transparent via-amber-800/30 to-transparent"></div>
          <h1 className="relative inline-block text-3xl md:text-4xl font-playfair text-amber-500 px-8 py-2 bg-[#080400]">
            Explorer l'Islam
            <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-600/0 via-amber-600/40 to-amber-600/0"></div>
          </h1>
        </div>
        
        {/* Barre de navigation entre les onglets */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-full bg-[#0C0700] border border-amber-900/30 p-1 shadow-inner shadow-black/20">
            <button
              onClick={() => setActiveTab('chatbot')}
              className={`px-5 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                activeTab === 'chatbot' 
                  ? 'bg-amber-900/30 text-amber-400'
                  : 'text-amber-500/70 hover:text-amber-400/80'
              }`}
            >
              <FaSearch className="text-sm" />
              <span>Assistant</span>
            </button>
            
            <button
              onClick={() => setActiveTab('resources')}
              className={`px-5 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                activeTab === 'resources' 
                  ? 'bg-amber-900/30 text-amber-400'
                  : 'text-amber-500/70 hover:text-amber-400/80'
              }`}
            >
              <FaBookOpen className="text-sm" />
              <span>Ressources</span>
            </button>
            
            <button
              onClick={() => setActiveTab('references')}
              className={`px-5 py-2 rounded-full flex items-center space-x-2 transition-colors ${
                activeTab === 'references' 
                  ? 'bg-amber-900/30 text-amber-400'
                  : 'text-amber-500/70 hover:text-amber-400/80'
              }`}
            >
              <FaQuran className="text-sm" />
              <span>Citations</span>
            </button>
          </div>
        </div>
        
        {/* Contenu principal avec suppressHydrationWarning pour éviter les erreurs d'hydratation */}
        <div suppressHydrationWarning>
          {renderContent()}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

// Wrapper avec ThemeProvider
const ExplorerPageWithTheme = () => {
  return (
    <ThemeProvider>
      <ExplorerPage />
    </ThemeProvider>
  );
};

export default ExplorerPageWithTheme; 
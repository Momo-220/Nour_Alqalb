import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { RelatedDua } from '../types';
import { FaBookOpen } from 'react-icons/fa';

interface RelatedDuasProps {
  relatedDuas: RelatedDua[] | undefined;
  title?: string;
  onSelectDua: (dua: RelatedDua) => void;
}

// Motif islamique en arabesque
const renderArabesquePattern = () => (
  <svg width="120" height="30" viewBox="0 0 120 30" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-40">
    <path d="M0,15 C10,5 20,25 30,15 C40,5 50,25 60,15 C70,5 80,25 90,15 C100,5 110,25 120,15" 
      stroke="var(--gold)" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
    <path d="M0,15 C10,25 20,5 30,15 C40,25 50,5 60,15 C70,25 80,5 90,15 C100,25 110,5 120,15" 
      stroke="var(--gold)" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
  </svg>
);

// Motif islamique en étoile
const renderIslamicStar = () => (
  <svg width="24" height="24" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-50">
    <path d="M60 0L72.2 47.8L120 60L72.2 72.2L60 120L47.8 72.2L0 60L47.8 47.8L60 0Z" fill="var(--gold)" fillOpacity="0.6" />
    <path d="M60 20L67.1 47.9L95 55L67.1 62.1L60 90L52.9 62.1L25 55L52.9 47.9L60 20Z" fill="black" />
    <path d="M60 30L64.7 47.9L82.5 52.5L64.7 57.1L60 75L55.3 57.1L37.5 52.5L55.3 47.9L60 30Z" fill="var(--gold)" fillOpacity="0.8" />
  </svg>
);

// Cadre islamique pour le titre
const renderTitleFrame = () => (
  <div className="relative w-full mx-auto max-w-md mb-8">
    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-30">
      {renderIslamicStar()}
    </div>
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 opacity-30">
      {renderIslamicStar()}
    </div>
    <div className="h-px w-full bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-30"></div>
  </div>
);

const RelatedDuas: React.FC<RelatedDuasProps> = ({ 
  relatedDuas, 
  title = "Invocations similaires",
  onSelectDua
}) => {
  // S'assurer que relatedDuas est un tableau
  const safeRelatedDuas = Array.isArray(relatedDuas) ? relatedDuas : [];
  
  if (safeRelatedDuas.length === 0) {
    return null;
  }

  return (
    <div className="pb-6 relative">
      {/* Cadre décoratif islamique pour la section entière */}
      <div className="absolute top-0 left-0 w-12 h-12 border-t border-l border-[var(--gold)] border-opacity-20 rounded-tl-lg"></div>
      <div className="absolute top-0 right-0 w-12 h-12 border-t border-r border-[var(--gold)] border-opacity-20 rounded-tr-lg"></div>
      <div className="absolute bottom-0 left-0 w-12 h-12 border-b border-l border-[var(--gold)] border-opacity-20 rounded-bl-lg"></div>
      <div className="absolute bottom-0 right-0 w-12 h-12 border-b border-r border-[var(--gold)] border-opacity-20 rounded-br-lg"></div>
      
      <h3 className="text-center text-[var(--gold)] text-xl mb-2 font-serif">
        {title}
      </h3>
      
      {renderTitleFrame()}
      
      {/* Arabesque décorative sous le titre */}
      <div className="flex justify-center mb-4">
        {renderArabesquePattern()}
      </div>
      
      <p className="text-center text-gray-400 text-sm mb-8 max-w-lg mx-auto">
        Découvrez d'autres invocations qui pourraient vous intéresser
      </p>
      
      <div className="grid grid-cols-1 gap-4">
        {safeRelatedDuas.map((relatedDua, index) => (
          <motion.div
            key={relatedDua.id || `related-dua-${index}`}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onSelectDua(relatedDua)}
            className="bg-[#0D0800] p-4 rounded-lg border border-amber-900/20 cursor-pointer hover:bg-[#0F0A02] hover:border-amber-800/30 transition-all group"
          >
            <div className="flex flex-col md:flex-row justify-between">
              <div className="flex-1">
                <h4 className="text-amber-400 mb-2 font-medium group-hover:text-amber-300 transition-colors">
                  {relatedDua.title}
                </h4>
                <p className="text-sm text-amber-300/80 mb-1 font-arabic text-right group-hover:text-amber-300 transition-colors line-clamp-1">
                  {relatedDua.arabicText}
                </p>
                <p className="text-sm text-amber-200/80 mb-1 italic group-hover:text-amber-200 transition-colors line-clamp-1">
                  {relatedDua.transliteration}
                </p>
                <p className="text-sm text-amber-100/70 group-hover:text-amber-100 transition-colors line-clamp-2">
                  {relatedDua.translation}
                </p>
              </div>
              
              <div className="flex items-center mt-3 md:mt-0 md:ml-4">
                <motion.div
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-900/10 border border-amber-800/20 text-amber-600/40 group-hover:text-amber-500/80 group-hover:bg-amber-900/20 group-hover:border-amber-700/30 transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </motion.div>
              </div>
            </div>
            
            {relatedDua.source && (
              <div className="mt-2 text-right">
                <span className="text-xs text-amber-500/50 italic">
                  Source: {relatedDua.source}
                </span>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {/* Arabesque décorative en bas de section */}
      <div className="flex justify-center mt-10">
        {renderArabesquePattern()}
      </div>
    </div>
  );
};

export default RelatedDuas; 
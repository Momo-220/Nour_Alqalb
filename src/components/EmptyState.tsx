import React from 'react';
import { motion } from 'framer-motion';
import { FaBookmark, FaSearch } from 'react-icons/fa';
import Link from 'next/link';

interface EmptyStateProps {
  type: 'favoris' | 'recherche' | 'général';
  message?: string;
  action?: {
    text: string;
    href: string;
  };
}

export default function EmptyState({ type, message, action }: EmptyStateProps) {
  let icon;
  let defaultMessage;
  
  switch (type) {
    case 'favoris':
      icon = <FaBookmark className="text-4xl text-amber-500/50" />;
      defaultMessage = "Vous n'avez pas encore de du'as favorites";
      break;
    case 'recherche':
      icon = <FaSearch className="text-4xl text-amber-500/50" />;
      defaultMessage = "Aucun résultat trouvé pour votre recherche";
      break;
    default:
      icon = <div className="w-12 h-12 rounded-full border-2 border-amber-500/30"></div>;
      defaultMessage = "Aucun contenu à afficher pour le moment";
  }
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center p-8 bg-[#0F0700]/50 rounded-lg border border-amber-900/20 text-center my-8"
    >
      <div className="bg-[#1A0D00] rounded-full p-6 mb-4">
        {icon}
      </div>
      
      <h3 className="text-xl font-medium text-amber-400 mb-2">
        {message || defaultMessage}
      </h3>
      
      <p className="text-amber-300/70 mb-6 max-w-md">
        {type === 'favoris' 
          ? "Explorez notre collection et ajoutez des du'as à vos favoris pour y accéder facilement."
          : type === 'recherche'
          ? "Essayez d'autres mots-clés ou explorez nos catégories de du'as."
          : "Revenez bientôt pour découvrir du nouveau contenu."
        }
      </p>
      
      {action && (
        <Link 
          href={action.href}
          className="px-6 py-2 bg-amber-900/30 hover:bg-amber-900/50 transition-colors text-amber-300 rounded-full"
        >
          {action.text}
        </Link>
      )}
    </motion.div>
  );
} 
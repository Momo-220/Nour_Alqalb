import React from 'react';
import Link from 'next/link';
import { FaHeart } from 'react-icons/fa';
import { IoMdMoon } from 'react-icons/io';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#0A0500] text-amber-300/70 border-t border-amber-900/20">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-center">
          {/* Logo et Description */}
          <div className="space-y-4 max-w-2xl text-center">
            <div className="flex items-center justify-center">
              <div className="mr-2">
                <IoMdMoon className="text-amber-400 text-2xl" />
              </div>
              <h2 className="font-playfair text-xl text-amber-400">
                <span className="font-bold">Nour</span> Al-Qalb
              </h2>
            </div>
            <p className="text-sm">
              Une ressource pour les musulmans cherchant des invocations authentiques adaptées à différentes situations.
            </p>
          </div>
        </div>
        
        <div className="border-t border-amber-900/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <div className="mb-4 md:mb-0">
            <p>© {currentYear} Duas Islamiques. Tous droits réservés.</p>
          </div>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/privacy" className="hover:text-amber-400 transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="hover:text-amber-400 transition-colors">
              Conditions d'utilisation
            </Link>
            <span className="flex items-center">
              Développé avec <FaHeart className="mx-1 text-amber-500" /> par L'équipe Nour Al-Qalb
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
} 
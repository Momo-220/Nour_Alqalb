"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaHeart, FaCalculator, FaInfoCircle, FaQuran, FaSearch, FaSun, FaMoon } from "react-icons/fa";
import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { useTheme } from '@/context/ThemeContext';

// Import dynamique du composant MobileNav
const MobileNav = dynamic(() => import('./MobileNav'), {
  loading: () => <div className="w-6 h-6 animate-pulse bg-amber-600/20 rounded-full"></div>,
  ssr: false
});

// Composant de navigation
function NavLinks({ pathname }: { pathname: string }) {
  const navItems = [
    { href: "/", label: "Accueil", icon: FaQuran },
    { href: "/search", label: "Explorer", icon: FaSearch },
    { href: "/favorites", label: "Favoris", icon: FaHeart },
    { href: "/tahajjud", label: "Calcul Tahajjud", icon: FaCalculator },
    { href: "/about", label: "À propos", icon: FaInfoCircle },
  ];

  return (
    <nav>
      <ul className="flex space-x-6">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link 
              href={item.href} 
              className={`flex items-center px-2 py-1 rounded-md transition-colors relative ${
                pathname === item.href 
                  ? "text-amber-400" 
                  : "text-white/90 hover:text-amber-300"
              }`}
            >
              <item.icon className="mr-1.5" size={14} />
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname() || '';
  const { theme, toggleTheme } = useTheme();

  // Effet pour détecter le défilement
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  return (
    <header 
      className={`fixed top-0 w-full z-40 transition-all duration-300 ${
        scrolled 
          ? "bg-[#0C060080] backdrop-blur-md shadow-lg" 
          : "bg-transparent"
       }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Logo />
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks pathname={pathname} />
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Bouton de basculement de thème */}
            <button
              onClick={toggleTheme}
              aria-label="Basculer le thème"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-amber-900/20 text-amber-400 hover:bg-amber-900/30 transition-colors"
            >
              {theme === 'dark' ? <FaSun /> : <FaMoon />}
            </button>
            
            <button
              onClick={toggleMenu}
              className={`md:hidden w-10 h-10 relative focus:outline-none z-50 ${isMenuOpen ? 'text-white' : 'text-amber-400'}`}
              aria-label={isMenuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            >
              <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'rotate-45 translate-y-1.5' : '-translate-y-1'}`} />
              <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block absolute h-0.5 w-6 bg-current transform transition duration-300 ease-in-out ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : 'translate-y-1'}`} />
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && <MobileNav pathname={pathname} toggleMenu={toggleMenu} />}
    </header>
  );
} 
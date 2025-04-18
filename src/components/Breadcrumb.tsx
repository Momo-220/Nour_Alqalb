"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaChevronRight } from 'react-icons/fa';

interface BreadcrumbItem {
  label: string;
  path: string;
  isActive?: boolean;
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items = [], className = '' }: BreadcrumbProps) {
  const pathname = usePathname();
  
  // Générer automatiquement le fil d'Ariane à partir du chemin si aucun élément n'est fourni
  const breadcrumbItems: BreadcrumbItem[] = items.length > 0 
    ? items 
    : generateBreadcrumbFromPath(pathname);

  if (breadcrumbItems.length === 0) return null;

  return (
    <nav 
      className={`breadcrumb-container flex items-center py-3 mb-6 text-sm text-gray-400 ${className}`} 
      aria-label="Fil d'Ariane"
    >
      <ol className="flex items-center space-x-1 md:space-x-2 flex-wrap">
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            className="inline-flex items-center text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
            aria-label="Accueil"
          >
            <FaHome className="mr-2" />
            <span>Nour Al-Qalb</span>
          </Link>
        </li>
        
        {breadcrumbItems.map((item, index) => (
          <li key={index} className="inline-flex items-center">
            <FaChevronRight className="mx-2 text-[var(--gold-dark)] text-xs" aria-hidden="true" />
            {item.isActive ? (
              <span className="text-[var(--gold)] font-medium" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link 
                href={item.path}
                className="inline-flex items-center text-[var(--gold)] hover:text-[var(--gold-light)] transition-colors"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Fonction pour générer automatiquement le fil d'Ariane à partir du chemin
function generateBreadcrumbFromPath(pathname: string | null): BreadcrumbItem[] {
  if (!pathname || pathname === '/') return [];
  
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbItems: BreadcrumbItem[] = [];
  
  const pathMap: Record<string, string> = {
    'tahajjud': 'Tahajjud',
    'about': 'À propos',
    'contact': 'Contact',
    'resources': 'Ressources',
    'faq': 'FAQ',
    'duas-collection': 'Collection de Duas',
    'saved': 'Favoris',
    'settings': 'Paramètres',
    'quran': 'Quran',
    'hadith': 'Hadiths',
    'daily-prayers': 'Prières Quotidiennes',
    'islamic-calendar': 'Calendrier Islamique',
    'books': 'Livres & Références',
    'community': 'Communauté',
  };
  
  let currentPath = '';
  
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    const isLast = index === segments.length - 1;
    
    breadcrumbItems.push({
      label: pathMap[segment] || segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      path: currentPath,
      isActive: isLast
    });
  });
  
  return breadcrumbItems;
} 
 
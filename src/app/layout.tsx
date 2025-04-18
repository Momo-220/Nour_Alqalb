import type { Metadata } from 'next';
import { Inter, Lora, Amiri } from 'next/font/google';
import './globals.css';
import { ReactNode } from 'react';
import Header from '@/components/Header';
import '@/styles/globals.css';
import localFont from 'next/font/local';
import { Playfair_Display } from 'next/font/google';
import { ClientOnly } from '@/components/ClientOnly';
import { ThemeProvider } from "@/context/ThemeContext";
import PageTransition from "@/components/PageTransition";
import BackButton from "@/components/BackButton";

// Optimisation des polices avec préchargement pour améliorer les performances
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-inter',
});

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-lora',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-playfair',
});

const amiri = Amiri({
  subsets: ['arabic'],
  weight: ['400', '700'],
  display: 'swap',
  variable: '--font-amiri',
});

// Métadonnées optimisées pour le SEO et les performances
export const metadata: Metadata = {
  title: {
    template: '%s | Nour Al-Qalb - Application Islamique de Duas',
    default: 'Nour Al-Qalb - Application Islamique de Duas',
  },
  description: 'Découvrez des invocations (duas) islamiques authentiques avec leurs explications, bienfaits et contextes. Une ressource spirituelle complète pour les musulmans.',
  keywords: ['islam', 'dua', 'invocation', 'prière', 'coran', 'hadith', 'spiritualité musulmane', 'application islamique'],
  authors: [{ name: 'Équipe Nour Al-Qalb' }],
  creator: 'Nour Al-Qalb',
  publisher: 'Nour Al-Qalb',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://nour-al-qalb.app'),
  alternates: {
    canonical: '/',
    languages: {
      'fr': '/',
      'en-US': '/en',
      'ar': '/ar',
    },
  },
  openGraph: {
    title: 'Nour Al-Qalb - Application Islamique de Duas',
    description: 'Découvrez des invocations (duas) islamiques authentiques avec leurs explications, bienfaits et contextes.',
    url: 'https://nour-al-qalb.app',
    siteName: 'Nour Al-Qalb',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Nour Al-Qalb Logo',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Nour Al-Qalb - Application Islamique de Duas',
    description: 'Découvrez des invocations (duas) islamiques authentiques avec leurs explications, bienfaits et contextes.',
    images: ['/images/twitter-image.jpg'],
    creator: '@nouralqalb',
    site: '@nouralqalb',
  },
  verification: {
    google: 'google-site-verification-code',
  },
  category: 'religion',
  applicationName: 'Nour Al-Qalb',
  manifest: '/manifest.json',
};

// Optimisation des variables CSS pour la performance
const rootVariables = {
  '--gold': '#D4AF37',
  '--gold-light': '#E6C458',
  '--gold-dark': '#B18C1E',
  '--bg-primary': '#080400',
  '--bg-secondary': '#0D0800',
  '--text-primary': '#E6C458',
  '--color-primary': '#FFC107',
  '--color-primary-dark': '#FF8F00', 
  '--color-background': '#0F0800',
  '--color-text': '#FFF8E1',
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html 
      lang="fr" 
      className={`${inter.variable} ${lora.variable} ${playfair.variable} ${amiri.variable} scroll-smooth`}
      style={rootVariables as React.CSSProperties}
    >
      <head>
        {/* Préchargement des ressources critiques pour l'affichage initial */}
        <link rel="preload" href="/images/geometric-pattern.svg" as="image" />
        <link rel="preload" href="/fonts/AmiriQuran-Regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/images/mosque-silhouette.png" as="image" />
        <link rel="preload" href="/images/geometric-pattern.png" as="image" />
        
        {/* DNS prefetch pour améliorer les performances réseau */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Préconnexion aux domaines externes pour accélérer le chargement */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Meta-tags pour optimiser le rendu mobile */}
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no, viewport-fit=cover" />
        <meta name="theme-color" content="#080400" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-[#080400] text-amber-50 font-sans">
        <ThemeProvider>
          <div id="root" className="min-h-screen flex flex-col">
        <Header />
            <BackButton />
            <PageTransition>
              <main className="flex-grow pt-20">
            {children}
              </main>
            </PageTransition>
          </div>
        </ThemeProvider>
        
        {/* Script d'optimisation de performance */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Amélioration du First Input Delay (FID)
              document.addEventListener('DOMContentLoaded', function() {
                // Fonction pour améliorer l'interaction initiale
                const passiveSupported = false;
                try {
                  window.addEventListener("test", null, { 
                    get passive() { passiveSupported = true; return false; }
                  });
                } catch(e) {}
                
                // Optimiser la réactivité des évènements tactiles
                const wheelOpt = passiveSupported ? { passive: true } : false;
                const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
                document.addEventListener(wheelEvent, function() {}, wheelOpt);
                document.addEventListener('touchstart', function() {}, wheelOpt);
              });
              
              // Préchargement des images
              const imagesToPreload = [
                '/images/geometric-pattern.svg',
                '/images/mosque-silhouette.png',
                '/images/geometric-pattern.png',
                '/icon.svg',
                '/images/tahajjud-bg.jpg'
              ];
              
              // Préchargeur d'images
              window.addEventListener('load', function() {
                imagesToPreload.forEach(src => {
                  const img = new Image();
                  img.src = src;
                });
              });
              
              // Optimisation du chargement des images
              if ('loading' in HTMLImageElement.prototype) {
                const images = document.querySelectorAll('img[loading="lazy"]');
                images.forEach(img => {
                  img.src = img.dataset.src;
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}

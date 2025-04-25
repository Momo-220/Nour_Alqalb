"use client";

import React, { useState, useCallback, memo, lazy, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Breadcrumb from "@/components/Breadcrumb";
import { FaArrowLeft, FaQuestion, FaPlus, FaMinus } from "react-icons/fa";

// Composant FAQ mémorisé pour éviter les re-rendus inutiles
const FAQItem = memo(({ question, answer }: { question: string; answer: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Utilisation de useCallback pour optimiser les performances
  const toggleOpen = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  return (
    <div className="mb-6 border border-amber-900/50 rounded-lg overflow-hidden shadow-md will-change-transform">
      <button
        onClick={toggleOpen}
        className="w-full p-4 text-left bg-gradient-to-r from-amber-900/30 to-amber-800/20 flex justify-between items-center"
        style={{ 
          willChange: 'background-color',
          transition: 'background-color 0.2s ease'
        }}
      >
        <div className="flex items-center">
          <FaQuestion className="text-amber-500 mr-3" />
          <h3 className="text-lg font-semibold text-amber-400 font-playfair">{question}</h3>
        </div>
        {isOpen ? (
          <FaMinus className="text-amber-500 transform transition-transform" />
        ) : (
          <FaPlus className="text-amber-500 transform transition-transform" />
        )}
      </button>
      <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.3,
              ease: [0.04, 0.62, 0.23, 0.98] // Courbe de bézier pour une animation plus fluide
            }}
          className="p-6 bg-[#1A0F02]"
            style={{ willChange: 'height, opacity' }}
        >
          <div className="prose max-w-none text-amber-200/90">{answer}</div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  );
});

FAQItem.displayName = 'FAQItem';

// Données des FAQ préchargées
const faqItems = [
  {
    question: "Qu'est-ce qu'une dua (invocation) ?",
    answer: (
      <>
        <p>
          Une dua est une forme de supplication ou prière dans l'Islam où un musulman demande directement à Allah (Dieu) pour obtenir guidance, miséricorde, pardon ou tout autre besoin. Les duas sont un moyen intime de communiquer avec Allah et représentent une partie essentielle de la foi musulmane.
        </p>
        <p>
          Le Prophète Muhammad (paix et bénédictions sur lui) a enseigné de nombreuses duas pour différentes occasions et situations de la vie quotidienne.
        </p>
      </>
    ),
  },
  {
    question: "Comment cette application génère-t-elle des duas ?",
    answer: (
      <>
        <p>
          Notre application utilise l'intelligence artificielle pour générer des explications détaillées des duas traditionnelles. Nous nous basons sur des sources islamiques authentiques, notamment les hadiths et les enseignements du Prophète Muhammad (paix et bénédictions sur lui).
        </p>
        <p>
          L'IA analyse le contexte de votre demande et fournit des duas pertinentes avec leur texte arabe, translittération, traduction, et des explications sur leur contexte, bienfaits et occasions appropriées pour les réciter.
        </p>
      </>
    ),
  },
  {
    question: "Les duas générées sont-elles authentiques ?",
    answer: (
      <>
        <p>
          Oui, les duas présentées dans notre application sont authentiques et proviennent de sources islamiques fiables. Nous nous assurons que chaque dua correspond à celles enseignées par le Prophète Muhammad (paix et bénédictions sur lui) ou mentionnées dans le Coran.
        </p>
        <p>
          Les explications et contextes fournis sont générés par IA mais basés sur des interprétations traditionnelles et des enseignements islamiques reconnus.
        </p>
      </>
    ),
  },
  {
    question: "Comment puis-je mémoriser une dua efficacement ?",
    answer: (
      <>
        <p>
          Pour mémoriser une dua efficacement :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-amber-200/90">
          <li>Commencez par comprendre sa signification</li>
          <li>Récitez-la régulièrement, de préférence à des moments fixes</li>
          <li>Divisez les longues duas en sections plus petites</li>
          <li>Utilisez notre fonction "mot par mot" pour comprendre chaque partie</li>
          <li>Pratiquez la récitation à voix haute</li>
          <li>Utilisez la fonction de favori pour garder les duas que vous souhaitez mémoriser facilement accessibles</li>
        </ul>
      </>
    ),
  },
  {
    question: "Quelle est l'importance de la récitation correcte en arabe ?",
    answer: (
      <>
        <p>
          La récitation correcte des duas en arabe est importante car elle préserve l'authenticité et la baraka (bénédiction) des paroles originales du Prophète Muhammad (paix et bénédictions sur lui). L'arabe est la langue du Coran et maintenir la précision phonétique honore l'intention originelle de ces invocations.
        </p>
        <p>
          Cependant, Allah comprend toutes les langues et intentions. Si vous ne pouvez pas réciter en arabe, vous pouvez faire des duas dans votre propre langue avec sincérité, tout en vous efforçant d'apprendre progressivement la prononciation arabe.
        </p>
      </>
    ),
  },
  {
    question: "Puis-je créer mes propres duas ?",
    answer: (
      <>
        <p>
          Absolument ! En Islam, faire des duas personnelles est encouragé. Vous pouvez vous adresser à Allah dans vos propres mots, pour exprimer vos besoins, espoirs et gratitude. Ces duas personnelles complètent les duas traditionnelles enseignées par le Prophète.
        </p>
        <p>
          Notre application se concentre sur les duas traditionnelles, mais n'hésitez pas à compléter celles-ci avec vos propres invocations sincères.
        </p>
      </>
    ),
  },
  {
    question: "Comment puis-je partager une dua avec d'autres ?",
    answer: (
      <>
        <p>
          Notre application offre plusieurs options pour partager les duas :
        </p>
        <ul className="list-disc pl-5 space-y-2 text-amber-200/90">
          <li>Utilisez le bouton de partage sur chaque carte de dua</li>
          <li>Copiez le texte arabe, la translittération ou la traduction avec les boutons dédiés</li>
          <li>Partagez directement sur les réseaux sociaux ou via message</li>
          <li>Générez une image de la dua pour la partager visuellement</li>
        </ul>
        <p>
          Partager le savoir islamique est considéré comme un acte de charité en Islam.
        </p>
      </>
    ),
  },
];

// Composant pour le footer FAQ
const ContactFooter = memo(() => (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 p-8 bg-[#1A0F02] rounded-lg border border-amber-900/50 text-center shadow-md"
    style={{ willChange: 'transform, opacity' }}
      >
        <h2 className="text-xl font-semibold text-amber-500 mb-4 font-playfair">
          Vous avez d'autres questions ?
        </h2>
        <p className="text-amber-200/80 mb-6">
          N'hésitez pas à nous contacter si vous avez besoin de plus d'informations
        </p>
        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-gradient-to-r from-amber-700 via-amber-600 to-amber-700 text-amber-100 rounded-lg hover:opacity-90 transition-all"
        >
          Nous contacter
        </Link>
      </motion.div>
));

ContactFooter.displayName = 'ContactFooter';

// Composant de chargement
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Contenu principal de la page FAQ
function FAQContent() {
  // Preload des images et des ressources pour améliorer la performance
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      // Préchargement des icônes et création de préconnexions pour optimiser le chargement
      const iconUrls = ['contact'];
      
      // Créer des préconnexions pour les domaines externes si nécessaire
      const preconnectDomains = [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ];
      
      preconnectDomains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      });
    }
  }, []);

  return (
    <div className="container max-w-4xl mx-auto px-4 py-12">
      <Breadcrumb 
        items={[
          { label: "Accueil", path: "/" },
          { label: "FAQ", path: "/faq", isActive: true }
        ]} 
      />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/"
            className="text-amber-200/70 hover:text-amber-200 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-serif text-amber-300">Foire Aux Questions</h1>
        </div>
        <p className="text-amber-200/80 max-w-2xl">
          Trouvez des réponses aux questions fréquemment posées sur les duas, leur utilisation et notre application.
        </p>
      </motion.div>
      
      {/* Affichage des questions-réponses FAQ */}
      <div className="space-y-6">
        {faqItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <FAQItem 
              question={item.question} 
              answer={item.answer} 
            />
    </motion.div>
        ))}
      </div>
      
      {/* Section contact */}
      <ContactFooter />
    </div>
  );
}

// Composant principal avec Suspense
export default function FAQPage() {
  return (
    <Suspense fallback={<Loading />}>
      <FAQContent />
    </Suspense>
  );
} 
 
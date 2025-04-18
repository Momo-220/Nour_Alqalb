"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaBookOpen, FaMosque, FaHeart, FaUsers } from "react-icons/fa";

// Composant de chargement
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Composant principal qui contient le contenu de la page
function AboutContent() {
  // Fonctionnalités principales
  const features = [
    {
      icon: <FaBookOpen className="text-3xl text-amber-500" />,
      title: "Collection Complète de Duas",
      description: "Une vaste bibliothèque de duas authentiques avec traduction, translittération et références",
      animDelay: 0.1
    },
    {
      icon: <FaMosque className="text-3xl text-amber-500" />,
      title: "Guide Spirituel",
      description: "Des informations contextuelles et des explications pour comprendre l'importance spirituelle de chaque dua",
      animDelay: 0.2
    },
    {
      icon: <FaHeart className="text-3xl text-amber-500" />,
      title: "Invocations Personnalisées",
      description: "Des recommandations adaptées à vos besoins spirituels et à votre situation personnelle",
      animDelay: 0.3
    },
    {
      icon: <FaUsers className="text-3xl text-amber-500" />,
      title: "Communauté Engagée",
      description: "Rejoignez une communauté de croyants partageant leur parcours spirituel",
      animDelay: 0.4
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0C0600] to-[#1A0D00]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        {/* Étoiles décoratives */}
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.8, 0.1],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 py-16">
        {/* En-tête */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-playfair text-amber-500 mb-4">À Propos de Nour Al-Qalb</h1>
          
          <div className="flex justify-center items-center mb-6">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <div className="mx-3 text-amber-500">✧</div>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          
          <p className="text-xl text-amber-300/80 max-w-3xl mx-auto">
            Votre guide spirituel pour les invocations islamiques authentiques
          </p>
        </motion.div>
        
        {/* Calligraphie */}
        <div className="text-center my-16">
          <motion.p 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl text-amber-500 font-amiri"
          >
            بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
          </motion.p>
        </div>
        
        {/* Section Mission */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto mb-20 bg-[#0E0700] rounded-xl overflow-hidden border border-amber-900/30 shadow-xl"
        >
          <div className="p-8 md:p-10">
            <div className="flex items-center justify-center mb-6">
              <div className="w-10 h-10 rounded-full bg-amber-900/40 flex items-center justify-center">
                <FaMosque className="text-amber-500" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl text-amber-500 mb-6 font-playfair text-center">Notre Mission</h2>
            
            <p className="text-amber-200/90 mb-4 leading-relaxed">
              Créée pour faciliter l'accès à la spiritualité islamique, notre application de duas vise à enrichir votre connexion avec Allah à travers des invocations authentiques, présentées de manière accessible et éducative.
            </p>
            
            <p className="text-amber-200/90 leading-relaxed">
              Nous nous engageons à fournir un contenu fiable, vérifié par des sources authentiques, tout en utilisant les technologies modernes pour rendre l'expérience utilisateur agréable et intuitive. Notre objectif est de vous accompagner dans votre chemin spirituel, où que vous soyez.
            </p>
          </div>
        </motion.section>
        
        {/* Section Fonctionnalités */}
        <section className="mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl md:text-3xl text-center text-amber-500 mb-10 font-playfair"
          >
            Caractéristiques Principales
          </motion.h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.animDelay }}
                className="bg-[#0E0700] rounded-lg p-6 border border-amber-900/20 shadow-md hover:border-amber-900/40 transition-all"
              >
                <div className="flex items-start">
                  <div className="p-3 bg-amber-900/20 rounded-lg mr-4">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl text-amber-400 mb-2 font-medium">{feature.title}</h3>
                    <p className="text-amber-200/80">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
        
        {/* Section Notre Histoire */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-20 bg-[#0E0700] rounded-xl overflow-hidden border border-amber-900/30 shadow-xl"
        >
          <div className="p-8 md:p-10">
            <h2 className="text-2xl text-amber-500 mb-6 font-playfair text-center">Notre Histoire</h2>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mb-6"></div>
            
            <p className="text-amber-200/90 mb-4 leading-relaxed">
              Ce projet a commencé comme une initiative humble visant à rassembler des invocations islamiques importantes pour notre usage personnel. Au fur et à mesure que nous avons approfondi nos recherches, nous avons réalisé la richesse et la profondeur des duas dans la tradition islamique.
            </p>
            
            <p className="text-amber-200/90 mb-4 leading-relaxed">
              Inspirés par les œuvres des grands savants islamiques et motivés par le désir de rendre ce savoir accessible à tous, nous avons développé cette application pour partager ces trésors spirituels avec la communauté musulmane mondiale.
            </p>
            
            <p className="text-amber-200/90 leading-relaxed">
              Notre équipe est composée de passionnés de technologie et d'étudiants en sciences islamiques, tous unis par l'amour de la tradition prophétique et le désir de créer des outils numériques utiles pour les musulmans du monde entier.
            </p>
          </div>
        </motion.section>
        
        {/* Section Notre Approche */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mb-20 bg-[#0E0700] rounded-xl overflow-hidden border border-amber-900/30 shadow-xl"
        >
          <div className="p-8 md:p-10">
            <h2 className="text-2xl text-amber-500 mb-6 font-playfair text-center">Notre Approche</h2>
            
            <div className="h-px w-full bg-gradient-to-r from-transparent via-amber-600/30 to-transparent mb-6"></div>
            
            <ul className="space-y-4">
              <li className="flex items-start p-4 bg-amber-900/10 rounded-lg">
                <span className="text-amber-600 mr-4 text-lg">•</span>
                <p className="text-amber-200/90">
                  <span className="font-semibold text-amber-400">Authenticité :</span> Toutes nos duas sont soigneusement vérifiées par rapport aux sources authentiques, notamment le Coran et les hadiths sahih.
                </p>
              </li>
              
              <li className="flex items-start p-4 bg-amber-900/10 rounded-lg">
                <span className="text-amber-600 mr-4 text-lg">•</span>
                <p className="text-amber-200/90">
                  <span className="font-semibold text-amber-400">Accessibilité :</span> Nous nous efforçons de présenter les duas de manière accessible, avec des traductions claires et des explications contextuelles.
                </p>
              </li>
              
              <li className="flex items-start p-4 bg-amber-900/10 rounded-lg">
                <span className="text-amber-600 mr-4 text-lg">•</span>
                <p className="text-amber-200/90">
                  <span className="font-semibold text-amber-400">Respect :</span> Nous abordons ce sujet sacré avec le plus grand respect, reconnaissant la valeur spirituelle de chaque invocation.
                </p>
              </li>
              
              <li className="flex items-start p-4 bg-amber-900/10 rounded-lg">
                <span className="text-amber-600 mr-4 text-lg">•</span>
                <p className="text-amber-200/90">
                  <span className="font-semibold text-amber-400">Innovation :</span> Tout en restant fidèles à la tradition, nous utilisons les technologies modernes pour améliorer l'expérience utilisateur.
                </p>
              </li>
            </ul>
          </div>
        </motion.section>
      </div>
    </div>
  );
}

// Composant principal avec Suspense
export default function AboutPage() {
  return (
    <Suspense fallback={<Loading />}>
      <AboutContent />
    </Suspense>
  );
} 
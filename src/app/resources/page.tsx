"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FaArrowLeft, FaBook, FaQuran, FaBookOpen, FaPrayingHands, FaRegCalendarAlt, FaMosque, FaUsers } from "react-icons/fa";
import Breadcrumb from "@/components/Breadcrumb";

interface ResourceCardProps {
  title: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  index: number;
}

function ResourceCard({ title, description, url, icon, index }: ResourceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="resource-card bg-opacity-10 backdrop-blur-sm rounded-lg overflow-hidden shadow-xl transition-all duration-300 hover:shadow-[0_0_15px_rgba(212,175,55,0.3)] border border-[var(--gold)] border-opacity-20"
    >
      <Link href={url} className="block h-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="text-[var(--gold)] text-2xl mr-3">{icon}</div>
            <h3 className="text-xl font-semibold text-[var(--gold)] truncate">{title}</h3>
          </div>
          <div className="flex items-center">
            <div className="arabesque-separator w-12 h-1 mb-4"></div>
          </div>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ResourcesPage() {
  const resources = [
    {
      title: "Collection de Duas",
      description: "Explorez notre vaste collection de duas pour chaque situation de la vie.",
      url: "/duas-collection",
      icon: <FaPrayingHands />,
    },
    {
      title: "Quran en ligne",
      description: "Lisez et écoutez le Saint Coran avec traduction et tafsir.",
      url: "/quran",
      icon: <FaQuran />,
    },
    {
      title: "Prières quotidiennes",
      description: "Horaires des prières, guides et rappels pour les cinq prières quotidiennes.",
      url: "/daily-prayers",
      icon: <FaMosque />,
    },
    {
      title: "Calendrier islamique",
      description: "Dates importantes, mois sacrés et événements islamiques.",
      url: "/islamic-calendar",
      icon: <FaRegCalendarAlt />,
    },
    {
      title: "Livres et références",
      description: "Ressources académiques sur l'Islam, les hadiths et la théologie.",
      url: "/books",
      icon: <FaBook />,
    },
    {
      title: "Guide de Tahajjud",
      description: "Apprenez comment établir et maintenir la prière nocturne de Tahajjud.",
      url: "/tahajjud",
      icon: <FaBookOpen />,
    },
    {
      title: "Communauté",
      description: "Rejoignez notre communauté pour poser des questions et partager vos expériences.",
      url: "/community",
      icon: <FaUsers />,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen mosque-bg">
      <header className="py-6 border-b border-[var(--gold)] border-opacity-20">
        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute left-4 top-1/2 -translate-y-1/2"
          >
            <Link
              href="/"
              className="flex items-center gap-2 text-[var(--gold)] hover:text-[var(--gold-hover)] transition-colors"
            >
              <FaArrowLeft />
              <span className="text-sm">Retour</span>
            </Link>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl text-center font-arabic text-[var(--gold)]"
          >
            Ressources Islamiques
          </motion.h1>
        </div>
      </header>

      <div className="arabesque-divider mt-8"></div>

      <main className="flex-grow container mx-auto px-4 py-8">
        <Breadcrumb className="container mx-auto px-4" />
        
        <div className="bismillah-calligraphy text-center my-10 scale-75">
          بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto mb-12 text-center"
        >
          <p className="text-lg text-gray-300">
            Explorez notre collection de ressources islamiques pour approfondir votre connaissance et votre pratique de l'Islam.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {resources.map((resource, index) => (
            <ResourceCard
              key={index}
              title={resource.title}
              description={resource.description}
              url={resource.url}
              icon={resource.icon}
              index={index}
            />
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="ayah-end illuminate mb-8"></div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-gray-400 text-sm max-w-2xl mx-auto"
          >
            "Quiconque emprunte un chemin à la recherche de la connaissance, Allah lui facilitera un chemin vers le Paradis."
            <span className="block mt-2 text-xs text-[var(--gold)]">- Sahih Muslim</span>
          </motion.p>
        </div>
      </main>

      <footer className="py-4 text-center text-gray-600 mt-8">
        <div className="container">
          <div className="arabesque-divider mb-4"></div>
          <p className="text-sm">Développé avec ❤️ pour la communauté</p>
        </div>
      </footer>
    </div>
  );
} 
 
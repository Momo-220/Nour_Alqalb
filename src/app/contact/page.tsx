import React from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaStar, FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Logo from '@/components/Logo';

// Remplacer le titre et la description pour la page Contact
export const metadata = {
  title: 'Contactez-nous | Nour Al-Qalb',
  description: 'Contactez l\'équipe de Nour Al-Qalb pour toute question, suggestion ou retour concernant notre application de duas islamiques.',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Arrière-plan avec motifs et étoiles */}
      <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 z-0"></div>
      
      {/* Étoiles scintillantes */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-amber-200 rounded-full"
            style={{
              top: `${10 + Math.random() * 80}%`,
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
      
      <header className="py-6 border-b border-amber-900/30 relative z-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition-all"
            >
              <FaArrowLeft size={14} />
              <span className="font-medium">Retour</span>
            </Link>
            
            <div className="flex justify-center">
              <Logo size={40} />
            </div>
            
            <div className="w-[110px]"></div>
          </div>
        </div>
      </header>

      <main className="pt-12 pb-16 container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-amiri text-amber-400 mb-3">
            تواصل معنا
          </h1>
          
          <div className="flex justify-center items-center mb-4">
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <div className="mx-3 text-amber-500 relative">
              <FaStar className="text-amber-500 rotate-45 absolute -top-2 -left-2 opacity-30 text-xs" />
              <span>✧</span>
              <FaStar className="text-amber-500 rotate-12 absolute -bottom-2 -right-2 opacity-30 text-xs" />
            </div>
            <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          
          <h2 className="text-3xl text-amber-400 mb-6 font-playfair">
            Contactez-nous
          </h2>
          
          <p className="text-amber-200/90 max-w-md mx-auto leading-relaxed">
            Nous sommes à votre écoute pour toute question, suggestion ou retour
            concernant Nour Al-Qalb. N'hésitez pas à nous contacter.
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative rounded-xl p-8 shadow-lg border border-amber-900/50 overflow-hidden">
              {/* Overlay pour effet de profondeur */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F02] to-[#0A0500] opacity-95 z-0"></div>
              
              {/* Coins décorés */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-700/40 rounded-tl-sm z-10"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-700/40 rounded-tr-sm z-10"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-700/40 rounded-bl-sm z-10"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-700/40 rounded-br-sm z-10"></div>
              
              <div className="relative z-20">
                <h3 className="text-2xl text-amber-400 mb-6 font-playfair relative inline-block">
                  Formulaire de contact
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-600/50 to-transparent"></div>
                </h3>
                
                <form className="grid gap-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-amber-300 mb-2 text-sm">
                        Nom complet
                      </label>
                      <input 
                        type="text" 
                        id="name" 
                        placeholder="Votre nom"
                        className="w-full p-3 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 transition-all placeholder:text-amber-800/40"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-amber-300 mb-2 text-sm">
                        Email
                      </label>
                      <input 
                        type="email" 
                        id="email" 
                        placeholder="votre@email.com"
                        className="w-full p-3 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 transition-all placeholder:text-amber-800/40"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-amber-300 mb-2 text-sm">
                      Sujet
                    </label>
                    <input 
                      type="text" 
                      id="subject" 
                      placeholder="Objet de votre message"
                      className="w-full p-3 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 transition-all placeholder:text-amber-800/40"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-amber-300 mb-2 text-sm">
                      Message
                    </label>
                    <textarea 
                      id="message" 
                      rows={5}
                      placeholder="Votre message détaillé..."
                      className="w-full p-3 rounded-lg bg-[#0A0500] text-amber-400 border border-amber-800/40 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-700 transition-all placeholder:text-amber-800/40 resize-none"
                    />
                  </div>
                  
                  <motion.button
                    whileHover={{ scale: 1.02, boxShadow: "0 10px 25px -5px rgba(180, 120, 40, 0.15)" }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-800/90 via-amber-700/90 to-amber-800/90 text-amber-100 py-3 px-6 rounded-lg transition-all text-lg font-medium shadow-md mt-4"
                  >
                    Envoyer le message
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Informations de contact */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="relative rounded-xl p-8 shadow-lg border border-amber-900/50 overflow-hidden">
              {/* Overlay pour effet de profondeur */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F02] to-[#0A0500] opacity-95 z-0"></div>
              
              {/* Coins décorés */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-amber-700/40 rounded-tl-sm z-10"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-amber-700/40 rounded-tr-sm z-10"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-amber-700/40 rounded-bl-sm z-10"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-amber-700/40 rounded-br-sm z-10"></div>
              
              <div className="relative z-20">
                <h3 className="text-2xl text-amber-400 mb-6 font-playfair relative inline-block">
                  Nos coordonnées
                  <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-600/50 to-transparent"></div>
                </h3>
                
                <div className="space-y-8 mb-12">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-900/20 flex items-center justify-center flex-shrink-0 border border-amber-800/30">
                      <FaPhoneAlt className="text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-amber-300 font-medium mb-1">Téléphone</h4>
                      <p className="text-amber-200/90">+33 (0) 1 23 45 67 89</p>
                      <p className="text-amber-200/90">+33 (0) 9 87 65 43 21</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-900/20 flex items-center justify-center flex-shrink-0 border border-amber-800/30">
                      <FaEnvelope className="text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-amber-300 font-medium mb-1">Email</h4>
                      <p className="text-amber-200/90">contact@nouralqalb.fr</p>
                      <p className="text-amber-200/90">support@nouralqalb.fr</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-amber-900/20 flex items-center justify-center flex-shrink-0 border border-amber-800/30">
                      <FaMapMarkerAlt className="text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-amber-300 font-medium mb-1">Adresse</h4>
                      <p className="text-amber-200/90">123 Avenue de la Spiritualité</p>
                      <p className="text-amber-200/90">75001 Paris, France</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xl text-amber-400 mb-4 font-playfair relative inline-block">
                    Suivez-nous
                    <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-amber-600/30 to-transparent"></div>
                  </h4>
                  
                  <div className="flex gap-4">
                    <motion.a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center border border-amber-800/30 text-amber-500 hover:text-amber-300 transition-all"
                    >
                      <FaInstagram />
                    </motion.a>
                    
                    <motion.a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center border border-amber-800/30 text-amber-500 hover:text-amber-300 transition-all"
                    >
                      <FaTwitter />
                    </motion.a>
                    
                    <motion.a 
                      href="#" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      whileHover={{ scale: 1.1, y: -3 }}
                      className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center border border-amber-800/30 text-amber-500 hover:text-amber-300 transition-all"
                    >
                      <FaFacebook />
                    </motion.a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-5 rounded-xl border border-amber-900/30 bg-amber-950/30 relative overflow-hidden shadow-lg">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
                <div className="absolute top-0 left-0 w-16 h-16 border-t border-l border-amber-600/30 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-amber-600/30 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-amber-600/30 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b border-r border-amber-600/30 rounded-br-lg"></div>
              </div>
              
              <div className="relative z-10">
                <h4 className="text-amber-300 font-medium mb-3">Heures d'ouverture</h4>
                <p className="text-amber-200/90 mb-1">Lundi - Vendredi: 9h00 - 18h00</p>
                <p className="text-amber-200/90">Weekend: Fermé</p>
                <p className="mt-4 text-amber-200/70 text-sm italic">Notre équipe s'efforcera de répondre à toutes vos demandes dans les 24 heures ouvrées.</p>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="mt-16 text-center">
          <Link 
            href="/"
            className="text-amber-500 hover:text-amber-400 transition-all font-medium flex items-center justify-center gap-2 group"
          >
            <span className="border-b border-amber-800/40 group-hover:border-amber-600/60 pb-px">Retour à l'accueil</span>
          </Link>
        </div>
      </main>
    </div>
  );
} 
 
"use client";

import { useState, useRef, useEffect, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaStar, FaPaperPlane, FaHeart, FaShareAlt, FaCopy, FaQuoteRight, FaBookmark } from 'react-icons/fa';
import { generateAnswer } from '@/utils/geminiUtils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Composant de chargement simple
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Composant principal qui utilise useSearchParams
function SearchPageContent() {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [typingText, setTypingText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const responseRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fonction pour simuler l'effet de typing
  const typeText = async (text: string) => {
    setIsTyping(true);
    let currentText = '';
    
    for (let i = 0; i < text.length; i++) {
      currentText += text[i];
      setTypingText(currentText);
      // Variation aléatoire de la vitesse pour un effet plus naturel
      await new Promise(resolve => setTimeout(resolve, 10 + Math.random() * 10));
    }
    
    setIsTyping(false);
  };

  // Fonction pour rediriger vers la page de génération de duas
  const handleGenerateDua = () => {
    if (query) {
      router.push(`/?intention=${encodeURIComponent(query)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!query.trim()) {
      setError("Veuillez saisir une question.");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setTypingText('');
    
    try {
      const result = await generateAnswer(query);
      
      if (!result.success) {
        throw new Error(result.error || "Une erreur s'est produite lors de la génération de la réponse.");
      }
      
      setResponse(result.data);
      
      // Démarrer l'effet de typing une fois la réponse reçue
      if (result.data?.answer) {
        typeText(result.data.answer);
      }
      
      // Scroll to response
      setTimeout(() => {
        if (responseRef.current) {
          responseRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 100);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur inattendue s'est produite.");
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Texte copié !');
      })
      .catch(err => {
        console.error('Erreur lors de la copie:', err);
      });
  };

  // Liste de questions suggérées
  const suggestedQuestions = [
    "Comment faire la prière de Tahajjud ?",
    "Est-ce que la musique est autorisée en Islam ?",
    "Quels sont les bienfaits du jeûne ?",
    "Comment méditer selon la tradition islamique ?",
    "Quelle est la différence entre la Sunna et le Hadith ?"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    // Simule un clic sur le bouton de recherche
    document.getElementById('search-button')?.click();
  };

  // Ajoutons une fonction pour formater le texte Markdown simple (** pour le gras)
  const formatMarkdown = (text: string) => {
    // Remplacer les ** pour le texte en gras
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  };

  // Fonction pour afficher un paragraphe avec formatage Markdown
  const renderFormattedText = (text: string, key: number) => {
    const formattedText = formatMarkdown(text);
    return <p key={key} className="leading-relaxed" dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  // Si le composant n'est pas encore monté côté client, afficher un placeholder
  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-b from-[#0C0600] to-[#1A0D00]">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-5 z-0"></div>
        
        {/* Étoiles scintillantes */}
        {Array.from({ length: 20 }).map((_, i) => (
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
      
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h1 className="text-6xl font-amiri text-amber-400 mb-4">
            استكشاف
          </h1>
          
          <div className="flex justify-center items-center mb-6">
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
            <div className="mx-3 text-amber-500 relative">
              <FaStar className="text-amber-500 rotate-45 absolute -top-2 -left-2 opacity-30 text-xs" />
              <span>✧</span>
              <FaStar className="text-amber-500 rotate-12 absolute -bottom-2 -right-2 opacity-30 text-xs" />
            </div>
            <div className="h-[1px] w-20 bg-gradient-to-r from-transparent via-amber-600 to-transparent"></div>
          </div>
          
          <h2 className="text-3xl text-amber-400 mb-6 font-playfair">
            Assistant Islamique
          </h2>
          
          <p className="text-amber-200/80 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Posez vos questions sur l'islam, les pratiques religieuses et la spiritualité. 
            Notre assistant intelligent vous apportera des réponses basées sur le Coran et les hadiths authentiques.
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <form onSubmit={handleSubmit} className="relative mb-8">
            <div className="relative rounded-xl overflow-hidden shadow-lg">
              {/* Overlay pour effet de profondeur */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#1A0F02]/80 to-[#0A0500]/80 opacity-95 z-0"></div>
              
              {/* Coins décorés */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-amber-700/40 rounded-tl-sm z-10"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-amber-700/40 rounded-tr-sm z-10"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-amber-700/40 rounded-bl-sm z-10"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-amber-700/40 rounded-br-sm z-10"></div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Posez votre question sur l'islam..."
                className="w-full px-6 py-4 bg-transparent text-white border-0 focus:outline-none focus:ring-0 text-lg relative z-20"
              />
            </div>
            
            <div className="flex mt-4">
              <button
                id="search-button"
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-amber-700 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-500 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FaSearch />
                <span>Rechercher</span>
              </button>
            </div>
          </form>
          
          {/* Liste de questions suggérées */}
          <div className="mb-10">
            <div className="mb-3 text-amber-300 text-center text-sm flex items-center justify-center gap-2">
              <div className="h-[1px] w-8 bg-amber-700/50"></div>
              <span>Questions populaires</span>
              <div className="h-[1px] w-8 bg-amber-700/50"></div>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(question)}
                  className="px-4 py-2 bg-[#1A0F02]/70 border border-amber-900/30 rounded-full text-amber-300 text-sm hover:bg-amber-900/40 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          
          {/* Animation de chargement */}
          <AnimatePresence>
            {isLoading && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-10"
              >
                <div className="inline-block relative w-16 h-16">
                  <div className="absolute top-0 w-4 h-4 rounded-full bg-amber-500 animate-ping opacity-75"></div>
                  <div className="relative w-16 h-16 border-4 border-t-4 border-transparent border-t-amber-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-amber-300">Recherche en cours...</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Message d'erreur */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-900/20 border border-red-900/30 rounded-lg p-4 text-red-300 mb-8"
              >
                <p>{error}</p>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Résultat de la recherche */}
          <AnimatePresence>
            {response && (
              <motion.div 
                ref={responseRef}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-[#0E0700] rounded-xl overflow-hidden border border-amber-900/30 shadow-xl mb-12"
              >
                <div className="p-6 md:p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-600 to-amber-800 flex items-center justify-center shadow-md">
                        <FaQuoteRight className="text-amber-100 text-sm" />
                      </div>
                      <h3 className="text-2xl font-amiri text-amber-400">Réponse</h3>
                    </div>
                    <div className="bg-amber-900/20 px-3 py-1.5 rounded-full text-xs font-medium text-amber-300 flex items-center gap-2 shadow-inner">
                      <FaStar className="text-amber-400" />
                      <span>Confiance: {response.confidenceLevel || "Moyenne"}</span>
                    </div>
                  </div>
                  
                  <div className="mb-8 text-amber-100/90 leading-relaxed relative text-lg font-light">
                    {isTyping ? (
                      <div className="font-light">
                        <p className="mb-4 leading-relaxed">{typingText}</p>
                        <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-blink"></span>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {response.answer.split('\n\n').map((paragraph: string, idx: number) => (
                          renderFormattedText(paragraph, idx)
                        ))}
                      </div>
                    )}
                  </div>
                  
                  {/* Références au Coran et Hadith */}
                  {response.sources && response.sources.length > 0 && (
                    <div className="mt-8 border-t border-amber-900/20 pt-6">
                      <h4 className="text-sm uppercase tracking-wider font-medium text-amber-500 mb-4">Sources:</h4>
                      <ul className="text-sm text-amber-200/80 space-y-3">
                        {response.sources.map((source: any, index: number) => (
                          <li key={index} className="flex items-start gap-3 bg-amber-950/30 p-3 rounded-lg border border-amber-900/20">
                            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gradient-to-r from-amber-900 to-amber-800 flex items-center justify-center mt-0.5 shadow-sm">
                              <FaBookmark className="text-amber-400 text-xs" />
                            </div>
                            <span className="font-light pt-1">
                              {typeof source === 'string' 
                                ? source 
                                : `${source.title || ''} ${source.reference || ''}`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="bg-[#0B0500] border-t border-amber-900/30 p-4 flex justify-between items-center backdrop-blur-sm">
                  <button 
                    onClick={() => copyToClipboard(response.answer)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-800/30 hover:bg-amber-800/50 rounded-full text-amber-300 text-sm transition-colors shadow-sm"
                  >
                    <FaCopy className="text-xs" />
                    <span>Copier la réponse</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

// Composant principal qui wrap le contenu dans Suspense
export default function SearchPage() {
  return (
    <Suspense fallback={<Loading />}>
      <SearchPageContent />
    </Suspense>
  );
} 
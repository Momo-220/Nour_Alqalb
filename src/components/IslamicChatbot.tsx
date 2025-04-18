"use client";

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaQuran, FaPaperPlane, FaUser, FaRobot, FaArrowDown, FaTimesCircle, FaInfoCircle } from 'react-icons/fa';
import { generateAnswer } from '@/utils/geminiUtils';

// Composant mémorisé pour les messages individuels afin d'éviter les re-rendus inutiles
const ChatMessage = memo(({ 
  message, 
  formatTime, 
  getConfidenceIcon, 
  getConfidenceText, 
  typingText,
  isMounted 
}: { 
  message: Message; 
  formatTime: (date: Date) => string; 
  getConfidenceIcon: (confidence?: string) => React.ReactNode; 
  getConfidenceText: (confidence?: string) => string; 
  typingText: string;
  isMounted: boolean;
}) => {
  return (
    <div 
      className={`mb-4 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
      role="listitem"
      aria-label={`Message de ${message.sender === 'user' ? 'vous' : 'l\'assistant'}`}
    >
      <div className={`max-w-[80%] relative group ${message.sender === 'user' ? 'ml-12' : 'mr-12'}`}>
        {/* Indicateur du niveau de confiance pour les messages du bot */}
        {message.sender === 'bot' && !message.isLoading && (
          <div 
            className="absolute -top-2 -left-2 w-5 h-5 bg-amber-900/30 rounded-full flex items-center justify-center text-xs opacity-70 group-hover:opacity-100 transition-opacity"
            aria-hidden="true"
          >
            {getConfidenceIcon(message.confidence)}
          </div>
        )}
        
        {/* Bulle de message */}
        <div 
          className={`relative rounded-lg p-3 ${
            message.sender === 'user' 
              ? 'bg-amber-800/30 border border-amber-700/40 text-amber-100' 
              : 'bg-[#0D0800] border border-amber-900/30 text-amber-200/90'
          }`}
        >
          {/* Icône de l'expéditeur */}
          <div 
            className={`absolute top-3 ${message.sender === 'user' ? 'right-full mr-2' : 'left-full ml-2'} w-8 h-8 rounded-full flex items-center justify-center bg-amber-900/20 border border-amber-800/30`}
            aria-hidden="true"
          >
            {message.sender === 'user' 
              ? <FaUser className="text-amber-400/80 text-sm" /> 
              : <FaRobot className="text-amber-500/80 text-sm" />
            }
          </div>
          
          {/* Contenu du message */}
          <div>
            {message.isLoading ? (
              <div className="flex items-center" aria-live="polite">
                <span>Réflexion en cours</span>
                <span className="ml-1 w-6 text-left">{typingText}</span>
                <div className="ml-2 flex space-x-1" aria-hidden="true">
                  {/* Animation fixe qui ne cause pas d'erreur d'hydratation */}
                  <div className={isMounted ? "w-1.5 h-1.5 rounded-full bg-amber-500/60 typing-dot" : "w-1.5 h-1.5 rounded-full bg-amber-500/60"} />
                  <div className={isMounted ? "w-1.5 h-1.5 rounded-full bg-amber-500/60 typing-dot" : "w-1.5 h-1.5 rounded-full bg-amber-500/60"} />
                  <div className={isMounted ? "w-1.5 h-1.5 rounded-full bg-amber-500/60 typing-dot" : "w-1.5 h-1.5 rounded-full bg-amber-500/60"} />
                </div>
              </div>
            ) : (
              <>
                <p className="whitespace-pre-line">{message.text}</p>
                
                {/* Sources pour les messages du bot */}
                {message.sender === 'bot' && message.sources && message.sources.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-amber-900/20 text-xs text-amber-400/70">
                    <p className="font-medium mb-1">Sources:</p>
                    <ul className="space-y-1">
                      {message.sources.map((source, index) => (
                        <li key={index}>• {source.title} ({source.reference})</li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
          
          {/* Horodatage et indicateur de confiance */}
          <div className={`mt-1 flex justify-between items-center text-xs ${
            message.sender === 'user' ? 'text-amber-400/60' : 'text-amber-500/60'
          }`}>
            <span suppressHydrationWarning>{formatTime(message.timestamp)}</span>
            
            {message.sender === 'bot' && !message.isLoading && (
              <div 
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                aria-label={`Niveau de confiance: ${getConfidenceText(message.confidence)}`}
              >
                {getConfidenceText(message.confidence)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

ChatMessage.displayName = 'ChatMessage';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: Date;
  isLoading?: boolean;
  confidence?: 'high' | 'medium' | 'low' | 'unknown';
  sources?: Array<{
    title: string;
    reference: string;
  }>;
}

// Interface pour définir la structure des données de réponse
interface AnswerData {
  answer: string;
  confidence: 'high' | 'medium' | 'low' | 'unknown';
  sources?: Array<{
    title: string;
    reference: string;
  }>;
}

export default function IslamicChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'bot',
      text: "Salam Alaikum! Je suis votre assistant islamique. Je peux vous aider à comprendre des aspects de l'islam, des pratiques religieuses, et répondre à vos questions sur la foi. Posez-moi une question et je ferai de mon mieux pour vous aider.",
      timestamp: new Date(),
      confidence: 'high'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingText, setTypingText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  // Indiquer que le composant est monté côté client
  useEffect(() => {
    setIsMounted(true);
    
    // Préchargement des icônes pour une réactivité optimale
    const iconUrls = [
      '/images/geometric-pattern.svg',
      '/images/arabesque-pattern.svg'
    ];
    
    iconUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }, []);

  // Défilement automatique amélioré avec comportement fluide
  const scrollToBottom = useCallback(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'end' 
      });
    }
  }, [messagesEndRef]);

  // Optimisation du défilement : utiliser requestAnimationFrame pour des animations plus fluides
  useEffect(() => {
    if (isMounted && messages.length > 0) {
      requestAnimationFrame(() => {
        scrollToBottom();
      });
    }
  }, [messages, isMounted, scrollToBottom]);

  // Effet d'animation pour l'écriture du bot - optimisé
  useEffect(() => {
    if (!isTyping || !messages.length) return;
    
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage?.isLoading) return;
    
    const timer = setTimeout(() => {
      setTypingText(prev => {
        if (prev.length < 3) return prev + '.';
        return '';
      });
    }, 300);
    
    return () => clearTimeout(timer);
  }, [isTyping, typingText, messages]);

  // Gestion de l'envoi d'un message optimisée avec useCallback
  const handleSendMessage = useCallback(async () => {
    const trimmedInput = inputValue.trim();
    if (!trimmedInput) return;
    
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: trimmedInput,
      timestamp: new Date()
    };
    
    const loadingMessage: Message = {
      id: `bot-${Date.now()}`,
      sender: 'bot',
      text: 'En train de réfléchir',
      timestamp: new Date(),
      isLoading: true
    };
    
    setMessages(prev => [...prev, userMessage, loadingMessage]);
    setInputValue('');
    setIsTyping(true);
    
    try {
      // Appel à l'API Gemini pour obtenir une réponse
      const response = await generateAnswer(userMessage.text);
      
      if (response.success && response.data) {
        // Validation et typage explicite des données reçues
        const answerData: AnswerData = {
          answer: response.data.answer || '',
          confidence: response.data.confidence || 'unknown',
          sources: response.data.sources || []
        };
        
        // Remplacer le message de chargement par la réponse
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                text: answerData.answer || "Je n'ai pas suffisamment d'informations pour répondre à cette question avec précision. Pour des questions religieuses sensibles, je vous recommande de consulter un imam ou un érudit islamique qualifié.",
                isLoading: false,
                confidence: answerData.confidence,
                sources: answerData.sources
              } 
            : msg
        ));
      } else {
        // En cas d'erreur, informer l'utilisateur
        setMessages(prev => prev.map(msg => 
          msg.id === loadingMessage.id 
            ? {
                ...msg,
                text: "Je suis désolé, je n'ai pas pu traiter votre demande pour le moment. Pour des questions religieuses importantes, je vous recommande de consulter un imam ou un érudit qualifié.",
                isLoading: false,
                confidence: 'unknown'
              } 
            : msg
        ));
      }
    } catch (error) {
      console.error("Erreur lors de la génération de la réponse:", error);
      
      // Message d'erreur en cas d'échec de l'API
      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id 
          ? {
              ...msg,
              text: "Une erreur est survenue lors du traitement de votre demande. Veuillez réessayer plus tard.",
              isLoading: false,
              confidence: 'unknown'
            } 
          : msg
      ));
    } finally {
      setIsTyping(false);
      setTypingText('');
    }
  }, [inputValue]);

  // Suggestions de questions communes
  const commonQuestions = [
    "Comment faire la prière (salat)?",
    "Qu'est-ce que les cinq piliers de l'Islam?",
    "Comment se préparer pour le Ramadan?",
    "Quelle est l'importance du Hajj?",
    "Comment purifier son cœur dans l'Islam?"
  ];

  // Formater l'heure des messages - mémorisée pour une meilleure performance
  const formatTime = useCallback((date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, []);

  // Optimisation du clic sur une question avec useCallback
  const handleQuestionClick = useCallback((question: string) => {
    setInputValue(question);
    // Utiliser requestAnimationFrame pour une meilleure fluidité
    requestAnimationFrame(() => {
      setTimeout(() => handleSendMessage(), 50);
    });
  }, [handleSendMessage]);

  // Fonctions optimisées avec useCallback
  const getConfidenceIcon = useCallback((confidence?: string) => {
    switch (confidence) {
      case 'high':
        return <span className="text-green-500"><FaInfoCircle /></span>;
      case 'medium':
        return <span className="text-yellow-500"><FaInfoCircle /></span>;
      case 'low':
        return <span className="text-red-500"><FaInfoCircle /></span>;
      default:
        return <span className="text-gray-500"><FaInfoCircle /></span>;
    }
  }, []);

  const getConfidenceText = useCallback((confidence?: string) => {
    switch (confidence) {
      case 'high':
        return "Réponse basée sur des sources fiables";
      case 'medium':
        return "Réponse basée sur une compréhension générale";
      case 'low':
        return "Cette réponse peut nécessiter une vérification";
      default:
        return "Niveau de confiance non déterminé";
    }
  }, []);

  // Gestion de la saisie avec debounce pour une meilleure performance
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  return (
    <div className="w-full h-full max-w-4xl mx-auto">
      {/* Solution simple pour éviter les erreurs d'hydratation: utiliser une div normale */}
      <div 
        className={`bg-[#0C0700] rounded-xl shadow-xl overflow-hidden border border-amber-900/40 relative h-[600px] flex flex-col ${isMounted ? 'transition-shadow duration-300 ease-in-out hover:shadow-2xl' : ''}`}
        style={isMounted ? { willChange: 'transform, opacity' } : undefined} // Optimisation performance
      >
        {/* Motif de fond subtil */}
        <div className="absolute inset-0 bg-[url('/images/geometric-pattern.svg')] bg-repeat opacity-[0.03] pointer-events-none" aria-hidden="true"></div>
        
        {/* En-tête du chatbot */}
        <div className="relative border-b border-amber-900/30 py-4 px-6 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-amber-900/20 flex items-center justify-center mr-3 border border-amber-700/30">
              <FaQuran className="text-amber-500" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-playfair text-amber-500">Assistant Islamique</h2>
              <p className="text-xs text-amber-400/70">Guidé par la connaissance islamique</p>
            </div>
          </div>
          <button 
            onClick={() => setIsExpanded(!isExpanded)} 
            className="text-amber-500 hover:text-amber-400 transition-colors"
            aria-label={isExpanded ? "Réduire" : "Agrandir"}
          >
            {isExpanded ? <FaTimesCircle aria-hidden="true" /> : <FaArrowDown aria-hidden="true" />}
          </button>
        </div>
        
        {isExpanded && (
          <>
            {/* Zone des messages avec défilement optimisé */}
            <div 
              ref={messagesContainerRef}
              className="flex-grow overflow-y-auto p-4 pb-2 scrollbar-thin scrollbar-thumb-amber-900/30 scrollbar-track-transparent"
              style={{ overscrollBehavior: 'contain' }}
              role="list"
              aria-label="Conversation avec l'assistant islamique"
            >
              {/* Afficher seulement les derniers 50 messages pour garder la performance */}
              {messages.slice(-50).map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  formatTime={formatTime}
                  getConfidenceIcon={getConfidenceIcon}
                  getConfidenceText={getConfidenceText}
                  typingText={typingText}
                  isMounted={isMounted}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Suggestions de questions communes */}
            <div className="px-4 pb-2">
              <div 
                className="overflow-x-auto whitespace-nowrap pb-2 scrollbar-thin scrollbar-thumb-amber-900/20 scrollbar-track-transparent"
                role="region"
                aria-label="Suggestions de questions"
              >
                {commonQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(question)}
                    className="inline-block mr-2 px-3 py-1.5 bg-amber-900/20 text-amber-400 text-xs rounded-full border border-amber-800/30 hover:bg-amber-900/30 transition-colors whitespace-nowrap"
                    aria-label={`Poser la question: ${question}`}
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Formulaire d'entrée */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }} 
              className="p-4 border-t border-amber-900/30 relative"
              aria-label="Formulaire de saisie de message"
            >
              <div className="relative rounded-lg overflow-hidden">
                <input
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="Posez votre question sur l'Islam..."
                  className="w-full bg-[#0D0800] border border-amber-900/30 rounded-lg pl-4 pr-12 py-3 text-amber-200 placeholder-amber-700/50 focus:outline-none focus:ring-2 focus:ring-amber-600/30"
                  disabled={isTyping}
                  aria-label="Votre question"
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    !inputValue.trim() || isTyping
                      ? 'bg-amber-900/10 text-amber-700/30'
                      : 'bg-amber-900/30 text-amber-500 hover:bg-amber-800/40 hover:text-amber-400'
                  }`}
                  aria-label="Envoyer la question"
                >
                  <FaPaperPlane className="text-sm" aria-hidden="true" />
                </button>
              </div>
              
              {/* Note de prudence */}
              <p className="text-amber-600/40 text-xs mt-2 px-1">
                Pour des questions théologiques complexes ou des avis juridiques islamiques (fatwas), 
                veuillez consulter un imam ou un érudit qualifié.
              </p>
            </form>
          </>
        )}
      </div>
      
      {/* Animations CSS ajoutées seulement côté client pour éviter les problèmes d'hydratation */}
      {isMounted && (
        <style jsx global>{`
          @keyframes dotBounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-3px); }
          }
          .typing-dot:nth-child(1) { animation: dotBounce 0.6s infinite 0s; }
          .typing-dot:nth-child(2) { animation: dotBounce 0.6s infinite 0.2s; }
          .typing-dot:nth-child(3) { animation: dotBounce 0.6s infinite 0.4s; }
          
          /* Optimisations pour une meilleure fluidité */
          .scrollbar-thin {
            scrollbar-width: thin;
            scroll-behavior: smooth;
          }
          
          /* Utilisation de transform plutôt que top/left pour les animations */
          @media (prefers-reduced-motion: no-preference) {
            .transition-colors, 
            .transition-opacity, 
            .transition-all {
              will-change: transform, opacity;
            }
          }
        `}</style>
      )}
    </div>
  );
}
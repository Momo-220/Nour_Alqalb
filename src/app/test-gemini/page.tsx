"use client";

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaBrain, FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Breadcrumb from '@/components/Breadcrumb';

// Styles pour les composants UI qui ne sont pas disponibles dans le projet
const Button = ({ 
  onClick, 
  disabled, 
  className, 
  children 
}: { 
  onClick: () => void; 
  disabled?: boolean; 
  className?: string; 
  children: React.ReactNode 
}) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    className={`px-4 py-2 rounded ${className}`}
  >
    {children}
  </button>
);

// Création de nos propres composants Card
const Card = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`rounded-lg shadow-lg ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6 border-b">{children}</div>
);

const CardTitle = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`text-xl font-semibold ${className}`}>{children}</h2>
);

const CardDescription = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <p className={`text-sm ${className}`}>{children}</p>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="p-6">{children}</div>
);

const CardFooter = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={`p-4 border-t ${className}`}>{children}</div>
);

// Type de toast
interface ToastItem {
  id: string;
  title: string;
  description: string;
  variant?: string;
}

// Toast simple
const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    const id = Date.now().toString();
    const newToast = { id, title, description, variant };
    setToasts(prev => [...prev, newToast]);
    
    // Supprimer le toast après 3 secondes
    setTimeout(() => {
      setToasts(currentToasts => currentToasts.filter(t => t.id !== id));
    }, 3000);
  };

  return { toast, toasts };
};

// Composant de chargement simple
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#180D00]">
      <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

// Composant principal encapsulé
function TestGeminiContent() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    response?: string;
    error?: string;
  } | null>(null);
  const { toast } = useToast();

  const runTest = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const response = await fetch('/api/test-gemini');
      const data = await response.json();
      
      // Attendre un court instant pour l'effet visuel
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setResult(data);
      
      if (data.success) {
        toast({
          title: "Test réussi",
          description: "L'API Gemini fonctionne correctement",
        });
      } else {
        toast({
          title: "Échec du test",
          description: data.error || "Une erreur s'est produite",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Erreur lors du test:", error);
      setResult({
        success: false,
        message: "Erreur lors de la connexion à l'API",
        error: error instanceof Error ? error.message : "Erreur inconnue"
      });
      
      toast({
        title: "Erreur de connexion",
        description: "Impossible de contacter l'API de test",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <Breadcrumb 
        items={[
          { label: "Accueil", path: "/" },
          { label: "Test Gemini", path: "/test-gemini", isActive: true }
        ]} 
      />
      
      <header className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Link 
            href="/"
            className="text-amber-200/70 hover:text-amber-200 transition-colors"
          >
            <FaArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-3xl font-serif text-amber-200">Test de l'API Gemini</h1>
        </div>
        <p className="text-gray-300 max-w-2xl">
          Cette page permet de tester la connexion avec l'API Gemini pour s'assurer 
          que le générateur de duas fonctionne correctement.
        </p>
      </header>

      <Card className="bg-slate-900 border-amber-900/50 text-amber-50 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FaBrain className="h-5 w-5 text-amber-400" />
            Diagnostic de l'API Gemini
          </CardTitle>
          <CardDescription className="text-amber-200/70">
            Vérifie la connexion à l'API et génère une réponse simple
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-amber-100/80">
            Ce test vérifie plusieurs éléments:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-amber-100/70 mb-6">
            <li>Présence de la clé d'API Gemini</li>
            <li>Connexion au service Google Generative AI</li>
            <li>Capacité à envoyer une requête au modèle</li>
            <li>Réception et traitement de la réponse</li>
          </ul>

          <Button 
            onClick={runTest} 
            disabled={loading}
            className="bg-amber-700 hover:bg-amber-600 text-amber-50 w-full"
          >
            {loading ? "Test en cours..." : "Lancer le test"}
          </Button>

          {result && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 rounded-lg border bg-slate-800/50 border-amber-900/30"
            >
              <div className="flex items-center gap-2 mb-2">
                {result.success ? (
                  <FaCheck className="h-5 w-5 text-green-500" />
                ) : (
                  <FaTimes className="h-5 w-5 text-red-500" />
                )}
                <span className={result.success ? "text-green-400" : "text-red-400"}>
                  {result.success ? "Succès" : "Échec"}
                </span>
              </div>
              <p className="text-amber-100 mb-2">{result.message}</p>
              
              {result.response && (
                <div className="mt-3 p-3 bg-slate-700/50 rounded border border-amber-800/30 text-sm">
                  <p className="text-xs text-amber-200/70 mb-1">Réponse du modèle:</p>
                  <p className="text-amber-100/90 italic">{result.response}</p>
                </div>
              )}
              
              {result.error && (
                <div className="mt-3 p-3 bg-red-900/20 rounded border border-red-800/30 text-sm">
                  <p className="text-xs text-red-300 mb-1">Erreur:</p>
                  <p className="text-red-200">{result.error}</p>
                </div>
              )}
            </motion.div>
          )}
        </CardContent>
        <CardFooter className="border-t-amber-900/20 bg-slate-900/50 flex justify-between">
          <p className="text-xs text-amber-200/60">
            API: Google Generative AI (Gemini Pro)
          </p>
          <p className="text-xs text-amber-200/60">
            {loading ? "Connexion en cours..." : "Prêt"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

// Composant principal avec Suspense
export default function TestGeminiPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TestGeminiContent />
    </Suspense>
  );
} 
'use client';

import { useState } from 'react';
import { generateIslamicDua } from '@/utils/geminiConfig';

// Types de base pour les composants UI
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

interface InputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Composants UI basiques
const Button = ({ children, onClick, disabled, className = '' }: ButtonProps) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 bg-amber-600 text-white rounded-md hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const Input = ({ value, onChange, placeholder, className = '', disabled }: InputProps) => (
  <input
    type="text"
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`px-4 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 ${className}`}
  />
);

// Composants Card
const Card = ({ children }: { children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">{children}</div>
);

const CardHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4 border-b border-amber-100">{children}</div>
);

const CardTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-2xl font-bold text-amber-800">{children}</h2>
);

const CardDescription = ({ children }: { children: React.ReactNode }) => (
  <p className="text-amber-600 mt-1">{children}</p>
);

const CardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="px-6 py-4">{children}</div>
);

const CardFooter = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`px-6 py-4 bg-amber-50 ${className}`}>{children}</div>
);

// Séparateur
const Separator = () => <hr className="my-4 border-t border-amber-200" />;

// Icône de chargement
const Loader2 = ({ className = '' }: { className?: string }) => (
  <svg
    className={`animate-spin ${className}`}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);

interface Dua {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  tags: string[];
}

export default function DuaGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [dua, setDua] = useState<Dua | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateDua = async () => {
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const generatedDua = await generateIslamicDua(prompt);
      setDua(generatedDua);
    } catch (err) {
      setError('Erreur lors de la génération de la dua. Veuillez réessayer.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Générateur de Duas</CardTitle>
          <CardDescription>
            Entrez une intention ou une situation pour laquelle vous souhaitez obtenir une dua islamique adaptée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrompt(e.target.value)}
                placeholder="Ex: protection contre le mal, guidance spirituelle, santé..."
                className="flex-1"
                disabled={loading}
              />
              <Button onClick={handleGenerateDua} disabled={loading || !prompt.trim()}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  'Générer'
                )}
              </Button>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            {dua && (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Arabic</h3>
                  <p className="text-xl text-right font-arabic" dir="rtl">{dua.arabic}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Translitération</h3>
                  <p className="italic">{dua.transliteration}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Traduction</h3>
                  <p>{dua.translation}</p>
                </div>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-2">Source</h3>
                  <p className="text-sm">{dua.source}</p>
                </div>
                {dua.tags && dua.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {dua.tags.map((tag, index) => (
                          <span 
                            key={index} 
                            className="px-2 py-1 text-xs bg-muted rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground">
          Les duas générées sont basées sur des sources authentiques. Veuillez vérifier l'exactitude auprès de sources religieuses fiables.
        </CardFooter>
      </Card>
    </div>
  );
} 
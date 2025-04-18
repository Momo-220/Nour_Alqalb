import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialiser l'API Gemini
const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || '';
console.log("Clé API utilisée:", API_KEY ? "Clé définie" : "Clé MANQUANTE!");

const genAI = new GoogleGenerativeAI(API_KEY);

export interface Dua {
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  tags: string[];
}

export async function generateIslamicDua(prompt: string): Promise<Dua> {
  try {
    console.log("Génération de dua pour:", prompt);
    // Utiliser gemini-pro au lieu de gemini-1.5-pro qui peut ne pas être disponible pour tous les comptes
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const fullPrompt = `
      Génère une dua islamique authentique pour la situation ou l'intention suivante: "${prompt}".
      
      Réponds strictement au format JSON suivant:
      {
        "arabic": "Le texte arabe de la dua",
        "transliteration": "La translitération en caractères latins",
        "translation": "La traduction en français",
        "source": "La source de la dua (Coran, Hadith, etc.)",
        "tags": ["tag1", "tag2"]
      }
      
      Important:
      - Utilise seulement des duas authentiques des sources islamiques fiables.
      - La dua doit être précise et complète.
      - Respecte rigoureusement le format JSON demandé.
      - Inclus 2-5 tags pertinents.
    `;

    console.log("Envoi de la requête à Gemini...");
    const result = await model.generateContent(fullPrompt);
    const response = await result.response.text();
    console.log("Réponse reçue de Gemini:", response.substring(0, 100) + "...");
    
    // Extraire le JSON de la réponse
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Pas de JSON trouvé dans la réponse:", response);
      throw new Error('Format de réponse invalide');
    }
    
    try {
      const duaData = JSON.parse(jsonMatch[0]) as Dua;
      console.log("Dua générée avec succès:", duaData.translation);
      return duaData;
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError);
      console.error("Texte JSON tenté:", jsonMatch[0]);
      throw new Error('Format JSON invalide');
    }
  } catch (error) {
    console.error('Erreur lors de la génération de la dua:', error);
    throw error;
  }
}

// Fonction pour générer une réponse avec Gemini
export const generateWithGemini = async (prompt: string) => {
  try {
    console.log("Génération de contenu pour:", prompt);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
    const result = await model.generateContent(prompt);
    const response = result.response;
    
    return response.text();
  } catch (error) {
    console.error("Erreur lors de la génération avec Gemini:", error);
    throw error;
  }
}; 
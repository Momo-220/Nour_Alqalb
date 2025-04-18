import { Dua } from "@/types";

export interface DuaData {
  id?: string;
  title?: string;
  arabicText?: string;
  transliteration?: string;
  translation?: string;
  source?: {
    type: string;
    reference: string;
    details?: string;
  };
  context?: string;
  benefits?: string[];
  occasions?: string[];
  wordByWord?: Array<{
    word: string;
    transliteration: string;
    translation: string;
    explanation?: string;
  }>;
  relatedDuas?: Array<{
    id?: string;
    title: string;
    arabicText: string;
    transliteration: string;
    translation: string;
    source?: string;
  }>;
  historicalReferences?: string;
  frequency?: string;
  preparation?: string;
  spiritualVirtues?: string;
}

// Type de la source dans l'interface Dua
interface SourceObject {
  type: string;
  reference: string;
  details?: string;
}

/**
 * Convertit une Dua de l'API en DuaData compatible avec le composant DuaCard
 */
export function adaptDuaToDuaData(dua: Dua): DuaData {
  // Convertir la source en objet compatible
  let sourceObject: {type: string; reference: string; details?: string} = {
    type: "quran",
    reference: "Non spécifié"
  };
  
  if (dua.source) {
    // Vérifier le type de la source
    if (typeof dua.source === 'object' && dua.source !== null) {
      // Si c'est un objet et qu'il a une propriété 'reference', l'utiliser
      const sourceObj = dua.source as any;
      if ('reference' in sourceObj) {
        sourceObject = {
          type: sourceObj.type || "quran",
          reference: sourceObj.reference,
          details: sourceObj.details
        };
      } else {
        // Objet sans propriété reference, le convertir en chaîne
        sourceObject = {
          type: "quran",
          reference: JSON.stringify(dua.source)
        };
      }
    } else {
      // C'est une chaîne ou un autre type primitif
      const sourceText = String(dua.source);
      
      // Par défaut, considérer que la source est une référence coranique
      sourceObject = {
        type: "quran",
        reference: sourceText
      };
      
      // Détecter le type basé sur le contenu de la source
      const lowerSourceText = sourceText.toLowerCase();
      if (lowerSourceText.includes("hadith") || 
          lowerSourceText.includes("ahadith") ||
          lowerSourceText.includes("bukhari") ||
          lowerSourceText.includes("muslim")) {
        sourceObject.type = "hadith";
        
        // Ajouter des détails pour les hadiths connus
        if (lowerSourceText.includes("bukhari")) {
          sourceObject.details = "Rapporté par l'Imam Al-Bukhari dans son recueil Sahih";
        } else if (lowerSourceText.includes("muslim")) {
          sourceObject.details = "Rapporté par l'Imam Muslim dans son recueil Sahih";
        }
      }
      
      if (lowerSourceText.includes("sunnah")) {
        sourceObject.type = "sunnah";
      }
    }
  }
  
  // Adapter le contexte
  const context = dua.context?.description || '';
  
  // Adapter les benefits et occasions
  const benefits = dua.benefits || dua.context?.benefits || [];
  const occasions = dua.occasions || dua.context?.occasions || [];
  
  // Adapter le wordByWord s'il existe
  const wordByWord = dua.explanation?.wordByWord?.map(item => ({
    word: item.word,
    transliteration: item.word, // Pas d'équivalent dans l'original
    translation: item.meaning,
    explanation: ""
  }));
  
  // Construction du DuaData enrichi
  return {
    id: dua.id,
    title: dua.category,
    arabicText: dua.arabicText,
    transliteration: dua.transliteration,
    translation: dua.translation,
    source: sourceObject,
    context,
    benefits,
    occasions,
    wordByWord,
    relatedDuas: dua.relatedDuas,
    // Ajout des champs pour les sections enrichies
    historicalReferences: dua.context?.historicalBackground || '',
    frequency: dua.frequency || '',
    preparation: dua.preparation || '',
    spiritualVirtues: dua.spiritualVirtues || ''
  };
} 
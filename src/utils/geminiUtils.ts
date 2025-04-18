import { GoogleGenerativeAI } from "@google/generative-ai";
import { Dua, APIResponse } from "@/types";
import { Dua as DuaType, Source, RelatedDua as DuaTypeRelatedDua } from '@/types/dua';

// Fonction pour générer un identifiant unique
function generateUniqueId(): string {
  return `generated-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

// Fonction de test pour l'API Gemini
export async function testGeminiAPI() {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log("Clé API définie:", apiKey ? "Oui" : "Non");
    
    if (!apiKey) {
      return { success: false, error: "Clé API non définie" };
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log("Initialisation de l'API réussie");
    
    // Utiliser uniquement gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    console.log("Modèle gemini-2.0-flash obtenu");
    
    // Test simple
    const prompt = "Réponds simplement avec 'Bismillah'";
    console.log("Envoi d'une requête simple:", prompt);
    
    const result = await model.generateContent(prompt);
    const response = await result.response.text();
    console.log("Réponse reçue:", response);
    
    return {
      success: true,
      response: response
    };
  } catch (error) {
    console.error("Erreur lors du test de l'API Gemini:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
}

// Fonction pour générer une dua simple sans formatage JSON complexe
export async function generateSimpleDua(intention: string): Promise<{ success: false; error: string } | { success: true; dua: Dua }> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    console.log("Clé API Gemini définie:", apiKey ? "Oui" : "Non");
    
    if (!apiKey) {
      console.error("Erreur: Clé API Gemini non définie");
      return {
        success: false,
        error: "Clé API Gemini non définie"
      };
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    
    try {
      // Utiliser uniquement gemini-2.0-flash
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      console.log("Modèle gemini-2.0-flash initialisé pour générer une dua");
      
      const prompt = `
        Tu es un expert en invocations islamiques (duas). En te basant sur l'intention ou la situation suivante: "${intention}", trouve et génère une dua appropriée.
        
        Format attendu (respecte strictement ce format sans ajouter d'autres caractères):
        
        Texte arabe: [texte arabe de la dua]
        Translitération: [translitération en caractères latins]
        Traduction: [traduction en français]
        Source: [source de la dua - Quran (Sourate:Verset) ou Hadith (Nom du recueil, numéro)]
        Authentication: [Sahih/Hassan/Daif - niveau d'authenticité si connu]
        Thèmes: [liste de mots-clés séparés par des virgules]
        Contexte: [bref contexte d'utilisation de cette dua]
        Bienfaits: [bienfaits spirituels de cette dua]
        Occasions: [quand réciter cette dua]
        
        Important:
        - Privilégie les duas authentiques du Coran ou des hadiths.
        - Si tu n'es pas absolument certain d'une information, donne la meilleure réponse possible basée sur tes connaissances.
        - Si tu ne connais pas le texte arabe exact, fournis une approximation en précisant que c'est une approximation.
        - Pour les sources, si tu n'es pas certain, précise qu'il s'agit d'une source approximative ou générale.
        - Inclus toujours une translitération et une traduction, même si elles sont approximatives.
        - Réponds TOUJOURS dans le format demandé, même si certaines informations sont partielles.
      `;
      
      console.log("Envoi de requête à Gemini pour l'intention:", intention);
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      console.log("Réponse brute de l'API:", responseText);

      // Extraire les différentes parties de la réponse avec une meilleure gestion des erreurs
      const arabicMatch = responseText.match(/Texte arabe:\s*([^\n]+)/);
      const transliterationMatch = responseText.match(/Translitération:\s*([^\n]+)/);
      const translationMatch = responseText.match(/Traduction:\s*([^\n]+)/);
      const sourceMatch = responseText.match(/Source:\s*([^\n]+)/);
      const authenticationMatch = responseText.match(/Authentication:\s*([^\n]+)/);
      const themesMatch = responseText.match(/Thèmes:\s*([^\n]+)/);
      const contextMatch = responseText.match(/Contexte:\s*([^\n]+)/);
      const benefitsMatch = responseText.match(/Bienfaits:\s*([^\n]+)/);
      const occasionsMatch = responseText.match(/Occasions:\s*([^\n]+)/);

      // Fonction améliorée pour nettoyer le texte
      const cleanText = (text: string) => {
        if (!text) return "";
        return text.replace(/^["']+|["']+$/g, '').trim();
      };
      
      // Valeurs par défaut pour les champs manquants
      const arabicText = arabicMatch ? cleanText(arabicMatch[1]) : "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ";
      const transliteration = transliterationMatch ? cleanText(transliterationMatch[1]) : "Bismillahir Rahmanir Rahim";
      const translation = translationMatch ? cleanText(translationMatch[1]) : intention.length > 0 ? 
        `Invocation liée à: ${intention}` : "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux";
      const sourceText = sourceMatch ? cleanText(sourceMatch[1]) : "Source générale islamique";
      const context = contextMatch ? cleanText(contextMatch[1]) : intention;
      const authentication = authenticationMatch ? cleanText(authenticationMatch[1]) : "";
      const themes = themesMatch ? cleanText(themesMatch[1]).split(/,\s*/).map(t => t.trim()) : [intention];
      const benefits = benefitsMatch ? cleanText(benefitsMatch[1]).split(/,\s*/).map(b => b.trim()) : 
        ["Renforcement spirituel", "Connexion avec Allah"];
      const occasions = occasionsMatch ? cleanText(occasionsMatch[1]).split(/,\s*/).map(o => o.trim()) : 
        [intention, "Moment de besoin"];
      
      // Construction de l'objet Dua avec les données extraites et nettoyées
      const dua: Dua = {
        id: generateUniqueId(),
        arabicText,
        transliteration,
        translation,
        source: sourceText,
        category: intention,
        explanation: {
          significance: context,
          additionalContext: authentication ? `Authenticité: ${authentication}` : "",
          references: sourceText
        },
        benefits,
        occasions,
        context: {
          description: context,
          source: {
            type: "scholars",
            reference: sourceText,
            text: arabicText
          }
        }
      };

      // Log de la dua générée
      console.log("Dua générée:", dua);
      return {
        success: true,
        dua
      };
    } catch (modelError) {
      console.error("Erreur avec le modèle Gemini:", modelError);
      // Génération d'une dua par défaut en cas d'erreur
      const defaultDua: Dua = {
        id: generateUniqueId(),
        arabicText: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillahir Rahmanir Rahim",
        translation: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux.",
        source: "Coran - Formule d'introduction",
        category: intention,
        explanation: {
          significance: "Invocation essentielle à réciter avant toute action importante",
          additionalContext: "Authenticité: Sahih (authentique)",
          references: "Présente au début de chaque sourate du Coran (sauf At-Tawbah)"
        },
        benefits: ["Protection divine", "Bénédiction de l'action entreprise", "Rappel de la miséricorde d'Allah"],
        occasions: ["Début de toute action importante", "Moment de besoin", intention],
        context: {
          description: `Cette invocation est appropriée pour votre intention: "${intention}"`,
          source: {
            type: "quran",
            reference: "Formule d'introduction coranique",
            text: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ"
          }
        }
      };
      
      return {
        success: true,
        dua: defaultDua
      };
    }
  } catch (error) {
    console.error("Erreur critique lors de la génération de la dua:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue lors de la génération. Veuillez réessayer avec une intention plus précise."
    };
  }
}

// Nouvelle fonction pour valider le contenu d'une dua
const validateDuaContent = (dua: Dua): void => {
  // Correction du texte arabe si nécessaire
  if (!dua.arabicText.match(/[\u0600-\u06FF]/)) {
    console.warn("Le texte arabe semble ne pas contenir de caractères arabes");
  }
  
  // Vérification de la source
  if (dua.source) {
    const source = dua.source.toString().toLowerCase();
    if (source.includes("je ne peux pas") || 
        source.includes("non spécifiée") || 
        source.includes("incertain")) {
      console.warn("La source de la dua est incertaine ou non spécifiée");
    }
  }
  
  // Nettoyer et corriger les tableaux si nécessaire
  if (dua.benefits && !Array.isArray(dua.benefits)) {
    dua.benefits = [String(dua.benefits)];
  }
  
  if (dua.occasions && !Array.isArray(dua.occasions)) {
    dua.occasions = [String(dua.occasions)];
  }
}

// Fonction pour extraire et nettoyer les bénéfices de la du'a
export const extractBenefits = (content: string): string[] => {
  // Recherche des mentions de bénéfices dans le contenu
  const benefitsRegex = /bénéfices?|bienfaits?|avantages?|vertus?|mérites?|effets? bénéfiques?|utilités?|récompenses?|faveurs?|grâces?/i;
  const lines = content.split('\n');
  
  let benefits: string[] = [];
  let capturingBenefits = false;
  let benefitBuffer = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecte le début d'une section de bénéfices
    if (benefitsRegex.test(line) && (line.endsWith(':') || line.endsWith('.'))) {
      capturingBenefits = true;
      continue;
    }
    
    // Si nous sommes en train de capturer des bénéfices
    if (capturingBenefits) {
      // Arrête la capture si une nouvelle section commence
      if (line.length > 0 && line.endsWith(':')) {
        capturingBenefits = false;
        
        // Traite le buffer accumulé
        if (benefitBuffer.length > 0) {
          benefits = processBenefitBuffer(benefitBuffer);
        }
        
        benefitBuffer = '';
        continue;
      }
      
      // Ajoute la ligne au buffer s'il n'est pas vide
      if (line.length > 0) {
        benefitBuffer += ' ' + line;
      }
    }
  }
  
  // Traite le buffer final si nécessaire
  if (benefitBuffer.length > 0 && capturingBenefits) {
    benefits = processBenefitBuffer(benefitBuffer);
  }
  
  // Recherche des bénéfices spirituels spécifiques
  const spiritualBenefits = [
    /purifie l['e]âme/i,
    /rapproche d[e']Allah/i,
    /apporte la paix/i,
    /renforce la foi/i,
    /protège contre/i,
    /efface les péchés/i,
    /augmente la récompense/i,
    /ouvre les portes du Paradis/i,
    /apporte la miséricorde/i,
    /attire la bénédiction/i
  ];
  
  // Parcourir tout le contenu pour trouver des mentions spécifiques de bénéfices
  for (const pattern of spiritualBenefits) {
    const matches = content.match(new RegExp(`[^.!?]*${pattern.source}[^.!?]*[.!?]`, 'gi'));
    if (matches) {
      for (const match of matches) {
        const cleanBenefit = match.trim().replace(/^[,-]\s+/, '');
        const formattedBenefit = cleanBenefit.charAt(0).toUpperCase() + cleanBenefit.slice(1);
        if (!benefits.includes(formattedBenefit) && formattedBenefit.length > 10) {
          benefits.push(formattedBenefit);
        }
      }
    }
  }
  
  // Ajouter des bénéfices par défaut si aucun n'est trouvé
  if (benefits.length === 0) {
    benefits.push(
      "Cette invocation est un moyen de se rapprocher d'Allah.",
      "Sa récitation régulière aide à renforcer la foi.",
      "Elle apporte la sérénité au cœur du croyant."
    );
  }
  
  return benefits;
};

// Traite le texte accumulé de bénéfices pour le diviser en éléments distincts
const processBenefitBuffer = (buffer: string): string[] => {
  let benefits: string[] = [];
  
  // Divise par des marqueurs de liste numérique ou à puces
  const splitItems = buffer.split(/\d+\.\s*|\*\s*|•\s*|–\s*|-\s*/);
  
  // Nettoie et ajoute chaque bénéfice valide
  for (const item of splitItems) {
    const trimmed = item.trim();
    if (trimmed.length > 5 && !trimmed.match(/^(bénéfices?|bienfaits?|avantages?|vertus?|mérites?|effets?)/i)) {
      // Capitalise la première lettre et ajoute un point si nécessaire
      let formattedBenefit = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (!formattedBenefit.endsWith('.')) formattedBenefit += '.';
      benefits.push(formattedBenefit);
    }
  }
  
  return benefits;
};

// Amélioré: Fonction pour extraire les occasions d'utilisation de la du'a
export const extractOccasions = (content: string): string[] => {
  // Recherche des mentions d'occasions dans le contenu
  const occasionsRegex = /occasions?|moments?|situations?|circonstances?|quand|lorsque|périodes?|contextes?|cas|usages?|réciter|prononcer|dire|utilisée?|pratiquer/i;
  const lines = content.split('\n');
  
  let occasions: string[] = [];
  let capturingOccasions = false;
  let occasionBuffer = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecte le début d'une section d'occasions
    if (occasionsRegex.test(line) && (line.endsWith(':') || line.endsWith('.'))) {
      capturingOccasions = true;
      continue;
    }
    
    // Si nous sommes en train de capturer des occasions
    if (capturingOccasions) {
      // Arrête la capture si une nouvelle section commence
      if (line.length > 0 && line.endsWith(':')) {
        capturingOccasions = false;
        
        // Traite le buffer accumulé
        if (occasionBuffer.length > 0) {
          occasions = processOccasionBuffer(occasionBuffer);
        }
        
        occasionBuffer = '';
        continue;
      }
      
      // Ajoute la ligne au buffer s'il n'est pas vide
      if (line.length > 0) {
        occasionBuffer += ' ' + line;
      }
    }
  }
  
  // Traite le buffer final si nécessaire
  if (occasionBuffer.length > 0 && capturingOccasions) {
    occasions = processOccasionBuffer(occasionBuffer);
  }
  
  // Recherche également d'indices directs dans le texte
  const directIndicators = [
    /à réciter (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
    /se dit (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
    /recommandée? (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
    /conseillée? (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
    /prononcée? (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
    /utilisée? (quand|lorsque|pendant|avant|après|pour|durant|en|au moment de) ([^\.]+)/gi,
  ];
  
  for (const indicator of directIndicators) {
    let match;
    while ((match = indicator.exec(content)) !== null) {
      const occasion = match[2].trim();
      if (occasion.length > 3) {
        const formattedOccasion = occasion.charAt(0).toUpperCase() + occasion.slice(1);
        if (!occasions.includes(formattedOccasion)) {
          occasions.push(formattedOccasion);
        }
      }
    }
  }
  
  // Vérifier les occasions spécifiques liées aux pratiques islamiques
  const specificOccasions = [
    { pattern: /prière|salat|salah/i, occasion: "Pendant la prière" },
    { pattern: /fajr|aube|matin/i, occasion: "À l'aube ou au matin" },
    { pattern: /soir|maghrib|coucher du soleil|nuit/i, occasion: "Au soir ou à la nuit" },
    { pattern: /ramadan|jeûne/i, occasion: "Pendant le Ramadan" },
    { pattern: /voyage|déplacement|route/i, occasion: "Lors d'un voyage" },
    { pattern: /maladie|souffrance|douleur/i, occasion: "En cas de maladie ou de souffrance" },
    { pattern: /angoisse|anxiété|inquiétude|peur|crainte/i, occasion: "En cas d'anxiété ou de crainte" },
    { pattern: /tristesse|chagrin|douleur émotionnelle/i, occasion: "En situation de tristesse" },
    { pattern: /protection|préservation/i, occasion: "Pour rechercher la protection divine" },
    { pattern: /pardon|repentir|tawbah/i, occasion: "Lors de la demande de pardon" },
    { pattern: /guidance|direction/i, occasion: "Pour demander la guidance" },
    { pattern: /mosquée|masjid/i, occasion: "En entrant ou en sortant de la mosquée" },
    { pattern: /ablution|wudu/i, occasion: "Pendant ou après les ablutions" },
    { pattern: /hajj|omra|pèlerinage/i, occasion: "Pendant le Hajj ou la Omra" },
    { pattern: /difficulté|épreuve|adversité/i, occasion: "Face aux difficultés et épreuves" },
    { pattern: /dua|invocation|supplication/i, occasion: "Comme invocation générale" },
  ];
  
  for (const { pattern, occasion } of specificOccasions) {
    if (pattern.test(content) && !occasions.includes(occasion)) {
      occasions.push(occasion);
    }
  }
  
  // Si aucune occasion n'est trouvée, ajouter des occasions générales
  if (occasions.length === 0) {
    occasions.push("À n'importe quel moment de la journée");
    occasions.push("Lors des invocations régulières");
  }
  
  return occasions;
};

// Traite le texte accumulé d'occasions pour le diviser en éléments distincts
const processOccasionBuffer = (buffer: string): string[] => {
  let occasions: string[] = [];
  
  // Divise par des marqueurs de liste numérique ou à puces
  const splitItems = buffer.split(/\d+\.\s*|\*\s*|•\s*|–\s*|-\s*/);
  
  // Nettoie et ajoute chaque occasion valide
  for (const item of splitItems) {
    const trimmed = item.trim();
    if (trimmed.length > 3 && !trimmed.match(/^(occasions?|moments?|situations?|circonstances?)/i)) {
      // Capitalise la première lettre
      const formattedOccasion = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
      if (!occasions.includes(formattedOccasion)) {
        occasions.push(formattedOccasion);
      }
    }
  }
  
  return occasions;
};

// Fonction pour nettoyer le texte arabe
export const cleanArabicText = (text: string): string => {
  return text.replace(/^["']+|["']+$/g, '').trim();
};

// Fonction pour nettoyer le texte
export const cleanText = (text: string): string => {
  return text.replace(/^["']+|["']+$/g, '').trim();
};

// Fonction pour extraire le contexte
export const extractContext = (content: string): string => {
  // Simple extraction de contexte basée sur des mots-clés
  const contextKeywords = [
    /contexte/i,
    /histoire/i,
    /circonstances/i,
    /révélation/i,
    /origine/i
  ];
  
  const lines = content.split('\n');
  let contextParagraphs: string[] = [];
  let inContextSection = false;
  let contextBuffer = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Détecte le début d'une section de contexte
    const isContextHeader = contextKeywords.some(kw => kw.test(line)) && 
      (line.endsWith(':') || line.endsWith('.'));
    
    if (isContextHeader) {
      inContextSection = true;
      continue;
    }
    
    // Si nous sommes dans une section de contexte
    if (inContextSection) {
      // Arrête la capture si une nouvelle section commence
      if (line.length > 0 && line.endsWith(':')) {
        inContextSection = false;
        
        if (contextBuffer.length > 0) {
          contextParagraphs.push(contextBuffer.trim());
        }
        
        contextBuffer = '';
        continue;
      }
      
      // Ajoute la ligne au buffer s'il n'est pas vide
      if (line.length > 0) {
        contextBuffer += ' ' + line;
      }
    }
  }
  
  // Ajoute le dernier buffer si nécessaire
  if (contextBuffer.length > 0 && inContextSection) {
    contextParagraphs.push(contextBuffer.trim());
  }
  
  return contextParagraphs.join('\n\n');
};

// Fonction pour construire l'objet Dua avec les bonnes propriétés
export const constructDuaObject = (
  arabicText: string,
  transliteration: string,
  translation: string,
  title: string,
  sourceText: string,
  content: string
): DuaType => {
  // Nettoie le texte des caractères superflus
  const cleanedArabicText = cleanArabicText(arabicText);
  const cleanedTransliteration = cleanText(transliteration);
  const cleanedTranslation = cleanText(translation);
  const cleanedTitle = cleanText(title);
  const cleanedSourceText = cleanText(sourceText);
  
  // Construction de l'objet Source conforme au type
  const sourceObj: Source = {
    type: "scholars",
    reference: cleanedSourceText || "Non spécifié"
  };
  
  // Extraction du contexte, des bénéfices et des occasions
  const contextText = extractContext(content);
  const benefits = extractBenefits(content);
  const occasions = extractOccasions(content);
  
  // Génération d'un ID unique
  const id = generateUniqueId();
  
  // Construction de l'objet Dua final conforme au type
  const dua: DuaType = {
    id,
    title: cleanedTitle,
    arabicText: cleanedArabicText,
    transliteration: cleanedTransliteration,
    translation: cleanedTranslation,
    source: sourceObj,
    context: contextText,
    benefits,
    occasions
  };
  
  console.log("Generated Dua object:", dua);
  
  return dua;
};

// Nouvelle fonction pour extraire les références de hadith
export const extractHadithReferences = (content: string): { collection: string, number: string, grade: string } | null => {
  // Recherche des références de collections de hadiths connues
  const hadithCollections = [
    'Sahih al-Bukhari', 'Sahih Muslim', 'Sunan Abu Dawood', 'Jami at-Tirmidhi',
    'Sunan an-Nasa\'i', 'Sunan Ibn Majah', 'Muwatta Malik', 'Musnad Ahmad',
    'Al-Bukhari', 'Muslim', 'Abu Dawood', 'Tirmidhi', 'Nasa\'i', 'Ibn Majah'
  ];
  
  // Regex pour trouver les références de hadith
  const hadithRefRegex = new RegExp(
    `(${hadithCollections.join('|')})\\s*(?:n[o°]?\\s*)?([0-9]+)?`, 'i'
  );
  
  // Regex pour trouver le grade du hadith
  const gradeRegex = /(sahih|hassan|hasan|daif|da'if|maudu|mawdu)/i;
  
  const refMatch = content.match(hadithRefRegex);
  const gradeMatch = content.match(gradeRegex);
  
  if (refMatch) {
    return {
      collection: refMatch[1],
      number: refMatch[2] || '',
      grade: gradeMatch ? gradeMatch[1] : ''
    };
  }
  
  return null;
};

// Nouvelle fonction pour trouver des du'as similaires
export const findSimilarDuas = (theme: string): DuaTypeRelatedDua[] => {
  // Correspondances de thèmes communs avec des du'as connues
  const commonDuas: Record<string, DuaTypeRelatedDua[]> = {
    'protection': [
      {
        title: "Du'a de protection (Ayat al-Kursi)",
        arabicText: "اللَّهُ لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
        transliteration: "Allahu la ilaha illa huwa al-hayyu al-qayyum",
        translation: "Allah, point de divinité à part Lui, le Vivant, Celui qui subsiste par Lui-même",
        source: {
          type: "quran",
          reference: "Coran 2:255"
        }
      }
    ],
    'pardon': [
      {
        title: "Du'a de demande de pardon (Sayyid al-Istighfar)",
        arabicText: "اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ خَلَقْتَنِي وَأَنَا عَبْدُكَ",
        transliteration: "Allahumma anta rabbi, la ilaha illa anta, khalaqtani wa ana 'abduka",
        translation: "Ô Allah, Tu es mon Seigneur, il n'y a de divinité que Toi, Tu m'as créé et je suis Ton serviteur",
        source: {
          type: "hadith",
          reference: "Sahih al-Bukhari"
        }
      }
    ],
    'matin': [
      {
        title: "Du'a du matin",
        arabicText: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Asbahna wa asbaha al-mulku lillah, wal-hamdu lillah",
        translation: "Nous sommes entrés dans le matin, et le royaume appartient à Allah, et la louange est à Allah",
        source: {
          type: "hadith",
          reference: "Abu Dawood"
        }
      }
    ],
    'soir': [
      {
        title: "Du'a du soir",
        arabicText: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
        transliteration: "Amsayna wa amsa al-mulku lillah, wal-hamdu lillah",
        translation: "Nous sommes entrés dans le soir, et le royaume appartient à Allah, et la louange est à Allah",
        source: {
          type: "hadith",
          reference: "Abu Dawood"
        }
      }
    ],
    'anxiété': [
      {
        title: "Du'a contre l'anxiété",
        arabicText: "لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
        transliteration: "La ilaha illa anta, subhanaka inni kuntu min al-zalimin",
        translation: "Il n'y a de divinité que Toi, Gloire à Toi, j'ai été parmi les injustes",
        source: {
          type: "quran",
          reference: "Coran 21:87"
        }
      }
    ],
    'maladie': [
      {
        title: "Du'a de guérison",
        arabicText: "اللَّهُمَّ رَبَّ النَّاسِ، أَذْهِبِ الْبَاسَ، اشْفِ أَنْتَ الشَّافِي",
        transliteration: "Allahumma rabba n-nas, adhhib il-ba's, ishfi anta sh-shafi",
        translation: "Ô Allah, Seigneur des hommes, éloigne la souffrance, guéris, Tu es le Guérisseur",
        source: {
          type: "hadith",
          reference: "Sahih al-Bukhari"
        }
      }
    ]
  };
  
  // Recherche des thèmes correspondants
  const lowerTheme = theme.toLowerCase();
  let relatedDuas: DuaTypeRelatedDua[] = [];
  
  for (const [key, dua] of Object.entries(commonDuas)) {
    if (lowerTheme.includes(key) || key.includes(lowerTheme)) {
      relatedDuas = [...relatedDuas, ...dua];
      // Limiter à 3 du'as similaires maximum
      if (relatedDuas.length >= 3) break;
    }
  }
  
  // Génération d'ID pour les duas qui n'en ont pas
  return relatedDuas.map(dua => ({
    ...dua,
    id: dua.id || generateUniqueId()
  }));
};

// Types pour la réponse du chatbot
interface AnswerResponse {
  success: boolean;
  data?: {
    answer: string;
    confidence: 'high' | 'medium' | 'low' | 'unknown';
    sources?: Array<{
      title: string;
      reference: string;
    }>;
  };
  error?: string;
}

/**
 * Génère une réponse à une question sur l'islam en utilisant l'API Gemini
 * @param question La question posée par l'utilisateur
 * @returns Une réponse formatée avec niveau de confiance et sources
 */
export async function generateAnswer(question: string): Promise<AnswerResponse> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    
    if (!apiKey) {
      console.error("Erreur: Clé API Gemini non définie");
      return {
        success: false,
        error: "Configuration incorrecte de l'API"
      };
    }
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    
    // Structure de la requête pour obtenir une réponse précise et fiable
    const prompt = `
      Tu es un assistant islamique respectueux et précis. On te pose la question suivante sur l'islam:
      
      "${question}"
      
      Instructions importantes:
      1. Si tu connais la réponse avec certitude et qu'elle est basée sur des sources islamiques fiables (Coran, hadiths authentiques), réponds avec précision.
      2. Si tu n'es pas certain ou si la question touche à un sujet complexe/controversé, indique clairement les limites de ta connaissance.
      3. Si tu ne connais pas la réponse ou si elle nécessite l'avis d'un érudit, réponds: "Je n'ai pas suffisamment d'informations pour répondre à cette question avec précision."
      4. Ne jamais inventer des citations coraniques ou des hadiths.
      5. Pour les questions de jurisprudence (fiqh), précise qu'il peut y avoir des différences d'opinions entre les écoles de pensée.
      
      Fournis UNIQUEMENT une réponse textuelle directe, sans formatage JSON, Markdown ou autre.
      Ne commence pas par "Voici ma réponse" ou des phrases similaires - donne directement la réponse.
    `;
    
    // Envoi de la requête à l'API
    console.log("Envoi de la requête à Gemini pour la question:", question);
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();
    console.log("Réponse brute de l'API:", responseText);
    
    // Nettoyage amélioré de la réponse
    let cleanedResponse = responseText;
    
    // Fonction pour détecter si un texte contient une structure JSON
    const containsJSON = (text: string): boolean => {
      // Vérifie les accolades équilibrées et la présence de paires clé-valeur
      return (text.includes('{') && text.includes('}') && text.includes(':')) ||
             (text.includes('[') && text.includes(']'));
    };
    
    // Si la réponse contient potentiellement du JSON
    if (containsJSON(responseText)) {
      try {
        // Essai d'extraction du JSON
        const jsonRegex = /{[\s\S]*?}|(\[[\s\S]*?\])/g;
        const jsonMatches = responseText.match(jsonRegex);
        
        if (jsonMatches) {
          // Remplacer chaque bloc JSON par une chaîne vide
          cleanedResponse = responseText;
          jsonMatches.forEach(match => {
            cleanedResponse = cleanedResponse.replace(match, '');
          });
          
          // Nettoyer les espaces multiples et lignes vides
          cleanedResponse = cleanedResponse.replace(/\s+/g, ' ').trim();
          
          if (!cleanedResponse) {
            // Si tout a été supprimé, extraire le texte du premier attribut de valeur du JSON
            try {
              const jsonObject = JSON.parse(jsonMatches[0]);
              // Prendre la première valeur de chaîne trouvée
              const firstTextValue = Object.values(jsonObject).find(
                val => typeof val === 'string' && val.length > 10
              );
              if (firstTextValue && typeof firstTextValue === 'string') {
                cleanedResponse = firstTextValue;
              } else {
                // Fallback à un message par défaut
                cleanedResponse = "Je n'ai pas pu générer une réponse appropriée à cette question.";
              }
            } catch (jsonParseError) {
              console.warn("Erreur lors du parsing JSON:", jsonParseError);
              // En cas d'échec, conserver la réponse brute mais supprimer les caractères JSON évidents
              cleanedResponse = responseText
                .replace(/{|}/g, '')
                .replace(/"/g, '')
                .replace(/answer:|confidence:|sources:/g, '')
                .trim();
            }
          }
        }
      } catch (cleaningError) {
        console.warn("Erreur lors du nettoyage de la réponse:", cleaningError);
        // En dernier recours, utiliser une méthode plus simple
        cleanedResponse = responseText
          .replace(/{[\s\S]*?}/g, '')
          .replace(/\[[\s\S]*?\]/g, '')
          .trim() || responseText;
      }
    }
    
    // Supprimer les formules d'introduction courantes
    cleanedResponse = cleanedResponse
      .replace(/^(Voici ma réponse|Ma réponse est|En réponse à votre question|Pour répondre à votre question)[\s:]*/i, '')
      .trim();
    
    // Évaluer le niveau de confiance basé sur le contenu de la réponse
    let confidence: 'high' | 'medium' | 'low' | 'unknown' = "medium";
    
    if (cleanedResponse.includes("Coran") && cleanedResponse.includes("authentique")) {
      confidence = "high";
    } else if (cleanedResponse.includes("incertitude") || cleanedResponse.includes("pas suffisamment") || 
              cleanedResponse.includes("controversé") || cleanedResponse.includes("différences d'opinions")) {
      confidence = "low";
    } else if (cleanedResponse.includes("Je ne sais pas") || cleanedResponse.includes("impossible de déterminer")) {
      confidence = "unknown";
    }
    
    // Extraction de sources potentielles
    const sources = [];
    
    // Recherche de références coraniques (format: Sourate:Verset)
    const coranRegex = /([0-9]+):([0-9]+)/g;
    let coranMatch;
    while ((coranMatch = coranRegex.exec(cleanedResponse)) !== null) {
      sources.push({
        title: "Coran",
        reference: `Sourate ${coranMatch[1]}, Verset ${coranMatch[2]}`
      });
    }
    
    // Recherche de références de hadith
    const hadithCollections = [
      'Sahih al-Bukhari', 'Sahih Muslim', 'Sunan Abu Dawood', 'Jami at-Tirmidhi',
      'Sunan an-Nasa\'i', 'Sunan Ibn Majah', 'Muwatta Malik', 'Musnad Ahmad',
      'Al-Bukhari', 'Muslim', 'Abu Dawood', 'Tirmidhi', 'Nasa\'i', 'Ibn Majah'
    ];
    
    for (const collection of hadithCollections) {
      if (cleanedResponse.includes(collection)) {
        // Tentative de trouver un numéro de hadith
        const hadithNumberRegex = new RegExp(`${collection}\\s*(?:n[o°]?\\s*)?([0-9]+)`, 'i');
        const hadithMatch = cleanedResponse.match(hadithNumberRegex);
        
        sources.push({
          title: collection,
          reference: hadithMatch ? `Hadith n°${hadithMatch[1]}` : "Référence générale"
        });
      }
    }
    
    return {
      success: true,
      data: {
        answer: cleanedResponse,
        confidence,
        sources: sources.length > 0 ? sources : undefined
      }
    };
  } catch (error) {
    console.error("Erreur lors de la génération de la réponse:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue"
    };
  }
} 
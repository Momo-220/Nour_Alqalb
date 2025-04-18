export interface Dua {
  id: string;
  isQuran?: boolean;
  surah?: {
    name: string;
    number: number;
  };
  ayahNumbers?: number[];
  arabicText: string;
  transliteration: string;
  translation: string;
  source?: string;
  category?: string;
  explanation?: {
    significance: string;
    additionalContext: string;
    references?: string | string[];
    wordByWord?: Array<{ word: string; meaning: string; }>;
  };
  benefits?: string[];
  occasions?: string[];
  relatedDuas?: RelatedDua[];
  recitationGuide?: string;
  context?: {
    description: string;
    source?: {
      type: string;
      reference: string;
      text: string;
    };
    benefits?: string[];
    occasions?: string[];
    historicalBackground?: string;
  };
  historicalReferences?: string;
  frequency?: string;
  preparation?: string;
  spiritualVirtues?: string;
  suggestions?: Array<{
    title: string;
    dua: string;
  }>;
}

export interface DuaSuggestion {
  title: string;
  dua: string;
}

export interface APIResponse {
  dua?: Dua;
  error?: string;
}

export interface RelatedDua {
  id?: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  source?: string;
  context?: {
    source?: string;
    description?: string;
  };
}
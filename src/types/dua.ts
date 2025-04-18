export type Source = {
  type: 'quran' | 'hadith' | 'scholars';
  reference: string;
  details?: string;
};

export type WordAnalysis = {
  word: string;
  translation: string;
  transliteration: string;
  explanation?: string;
};

export type RelatedDua = {
  id?: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  source?: Source;
};

export type Dua = {
  id: string;
  title: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  source: Source;
  context?: string;
  benefits?: string[];
  occasions?: string[];
  wordByWord?: WordAnalysis[];
  explanation?: string;
  relatedDuas?: RelatedDua[];
}
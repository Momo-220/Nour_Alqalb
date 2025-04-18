// Définition des types
interface Source {
  type: 'quran' | 'hadith' | 'scholars';
  reference: string;
  details?: string;
}

interface WordAnalysis {
  word: string;
  translation: string;
  transliteration: string;
  explanation?: string;
}

interface RelatedDua {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source?: Source;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: Source;
  context?: string;
  benefits?: string[];
  occasions?: string[];
  wordByWord?: WordAnalysis[];
  explanation?: string;
  relatedDuas?: RelatedDua[];
  tags?: string[];
}

export const duas: Dua[] = [
  {
    id: "dua-001",
    title: "Dua pour la protection",
    arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنْ شَرِّ مَا عَمِلْتُ وَمِنْ شَرِّ مَا لَمْ أَعْمَلْ",
    transliteration: "Allahumma inni a'udhu bika min sharri ma 'amiltu wa min sharri ma lam a'mal",
    translation: "Ô Allah, je cherche refuge auprès de Toi contre le mal que j'ai commis et contre le mal que je n'ai pas commis",
    source: {
      type: "hadith",
      reference: "Muslim",
      details: "Rapporté dans Sahih Muslim"
    },
    context: "Cette dua est récitée pour demander la protection d'Allah contre tout mal, qu'il soit issu de nos actions ou de ce qui pourrait nous affecter.",
    benefits: [
      "Protection contre le mal",
      "Purification de l'âme",
      "Renforcement de la foi"
    ],
    occasions: [
      "Après les prières obligatoires",
      "Avant de dormir",
      "En situation de danger"
    ],
    tags: ["protection", "mal", "danger", "refuge"],
    wordByWord: [
      {
        word: "اللَّهُمَّ",
        translation: "Ô Allah",
        transliteration: "Allahumma"
      },
      {
        word: "إِنِّي",
        translation: "certes je",
        transliteration: "inni"
      },
      {
        word: "أَعُوذُ",
        translation: "cherche refuge",
        transliteration: "a'udhu"
      },
      {
        word: "بِكَ",
        translation: "auprès de Toi",
        transliteration: "bika"
      },
      {
        word: "مِنْ",
        translation: "contre",
        transliteration: "min"
      },
      {
        word: "شَرِّ",
        translation: "le mal",
        transliteration: "sharri"
      },
      {
        word: "مَا",
        translation: "ce que",
        transliteration: "ma"
      },
      {
        word: "عَمِلْتُ",
        translation: "j'ai fait",
        transliteration: "'amiltu"
      },
      {
        word: "وَمِنْ",
        translation: "et contre",
        transliteration: "wa min"
      },
      {
        word: "شَرِّ",
        translation: "le mal",
        transliteration: "sharri"
      },
      {
        word: "مَا",
        translation: "ce que",
        transliteration: "ma"
      },
      {
        word: "لَمْ",
        translation: "ne pas",
        transliteration: "lam"
      },
      {
        word: "أَعْمَلْ",
        translation: "j'ai fait",
        transliteration: "a'mal"
      }
    ]
  },
  {
    id: "dua-002",
    title: "Dua pour le pardon",
    arabic: "رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا وَثَبِّتْ أَقْدَامَنَا وَانْصُرْنَا عَلَى الْقَوْمِ الْكَافِرِينَ",
    transliteration: "Rabbana-ghfir lana dhunubana wa israfana fi amrina wa thabbit aqdamana wansurna 'alal-qawmil kafirin",
    translation: "Notre Seigneur, pardonne-nous nos péchés ainsi que nos excès dans nos comportements, affermis nos pas et donne-nous la victoire sur les peuples mécréants",
    source: {
      type: "quran",
      reference: "Sourate Al-Imran 3:147",
      details: "Paroles des croyants mentionnées dans le Coran"
    },
    context: "Cette invocation, mentionnée dans le Coran, était récitée par les croyants qui cherchaient le pardon et la force d'Allah face à l'adversité.",
    benefits: [
      "Demande de pardon pour les péchés",
      "Reconnaissance de ses erreurs",
      "Demande de force et de constance"
    ],
    occasions: [
      "Après avoir commis une erreur",
      "Dans les moments d'adversité",
      "Durant les dernières dix nuits de Ramadan"
    ],
    tags: ["pardon", "péché", "force", "victoire", "miséricorde"],
    wordByWord: [
      {
        word: "رَبَّنَا",
        translation: "Notre Seigneur",
        transliteration: "Rabbana"
      },
      {
        word: "اغْفِرْ",
        translation: "pardonne",
        transliteration: "ghfir"
      },
      {
        word: "لَنَا",
        translation: "à nous",
        transliteration: "lana"
      },
      {
        word: "ذُنُوبَنَا",
        translation: "nos péchés",
        transliteration: "dhunubana"
      },
      {
        word: "وَإِسْرَافَنَا",
        translation: "et nos excès",
        transliteration: "wa israfana"
      },
      {
        word: "فِي",
        translation: "dans",
        transliteration: "fi"
      },
      {
        word: "أَمْرِنَا",
        translation: "notre conduite",
        transliteration: "amrina"
      },
      {
        word: "وَثَبِّتْ",
        translation: "et affermis",
        transliteration: "wa thabbit"
      },
      {
        word: "أَقْدَامَنَا",
        translation: "nos pas",
        transliteration: "aqdamana"
      },
      {
        word: "وَانْصُرْنَا",
        translation: "et accorde-nous la victoire",
        transliteration: "wansurna"
      },
      {
        word: "عَلَى",
        translation: "sur",
        transliteration: "'ala"
      },
      {
        word: "الْقَوْمِ",
        translation: "le peuple",
        transliteration: "al-qawmi"
      },
      {
        word: "الْكَافِرِينَ",
        translation: "des mécréants",
        transliteration: "al-kafirin"
      }
    ]
  },
  {
    id: "dua-003",
    title: "Dua pour le succès dans les études",
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    transliteration: "Rabbi zidni 'ilma",
    translation: "Seigneur, accrois-moi en science",
    source: {
      type: "quran",
      reference: "Sourate Taha 20:114",
      details: "Invocation enseignée par Allah dans le Coran"
    },
    context: "Cette courte mais puissante invocation demande à Allah d'augmenter notre connaissance et notre compréhension, particulièrement utile pour les étudiants.",
    benefits: [
      "Augmentation de la connaissance",
      "Amélioration de la compréhension",
      "Bénédiction dans les études"
    ],
    occasions: [
      "Avant d'étudier",
      "Avant un examen",
      "En quête de connaissance"
    ],
    tags: ["études", "science", "connaissance", "savoir", "éducation"],
    wordByWord: [
      {
        word: "رَبِّ",
        translation: "Mon Seigneur",
        transliteration: "Rabbi"
      },
      {
        word: "زِدْنِي",
        translation: "augmente-moi",
        transliteration: "zidni"
      },
      {
        word: "عِلْمًا",
        translation: "en connaissance",
        transliteration: "'ilma"
      }
    ]
  },
  {
    id: "dua-004",
    title: "Dua pour la guidance",
    arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى",
    transliteration: "Allahumma inni as'aluka-l-huda wa-t-tuqa wal-'afafa wal-ghina",
    translation: "Ô Allah, je Te demande la guidée, la piété, la chasteté et la richesse spirituelle",
    source: {
      type: "hadith",
      reference: "Muslim",
      details: "Rapporté dans Sahih Muslim d'après Ibn Mas'ud"
    },
    context: "Cette invocation est particulièrement utile pour demander la guidance divine dans tous les aspects de notre vie, ainsi que la piété et la suffisance.",
    benefits: [
      "Guidance spirituelle",
      "Augmentation de la piété",
      "Protection contre les désirs mondains",
      "Richesse spirituelle"
    ],
    occasions: [
      "En période de confusion",
      "Lors des prises de décision importantes",
      "Quotidiennement après les prières"
    ],
    tags: ["guidance", "piété", "chasteté", "richesse", "spiritualité"],
    wordByWord: [
      {
        word: "اللَّهُمَّ",
        translation: "Ô Allah",
        transliteration: "Allahumma"
      },
      {
        word: "إِنِّي",
        translation: "certes je",
        transliteration: "inni"
      },
      {
        word: "أَسْأَلُكَ",
        translation: "je Te demande",
        transliteration: "as'aluka"
      },
      {
        word: "الْهُدَى",
        translation: "la guidée",
        transliteration: "al-huda"
      },
      {
        word: "وَالتُّقَى",
        translation: "et la piété",
        transliteration: "wa-t-tuqa"
      },
      {
        word: "وَالْعَفَافَ",
        translation: "et la chasteté",
        transliteration: "wal-'afafa"
      },
      {
        word: "وَالْغِنَى",
        translation: "et la richesse",
        transliteration: "wal-ghina"
      }
    ]
  },
  {
    id: "dua-005",
    title: "Dua pour la protection de la famille",
    arabic: "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
    transliteration: "Rabbana hab lana min azwajina wa dhurriyyatina qurrata a'yunin waj'alna lil-muttaqina imama",
    translation: "Notre Seigneur, fais que nos épouses et nos descendants soient une source de joie pour nous, et fais de nous un modèle pour les pieux",
    source: {
      type: "quran",
      reference: "Sourate Al-Furqan 25:74",
      details: "Invocation des serviteurs du Tout Miséricordieux mentionnée dans le Coran"
    },
    context: "Cette invocation est recommandée pour demander à Allah de bénir notre famille et de faire d'eux une source de joie et de fierté dans ce monde et dans l'au-delà.",
    benefits: [
      "Bénédiction dans la famille",
      "Joie et bonheur familial",
      "Descendance pieuse",
      "Être un exemple pour les autres"
    ],
    occasions: [
      "Pour les couples mariés",
      "Pour les parents",
      "Lors de la constitution d'une famille"
    ],
    tags: ["famille", "mariage", "enfants", "descendance", "piété"],
    wordByWord: [
      {
        word: "رَبَّنَا",
        translation: "Notre Seigneur",
        transliteration: "Rabbana"
      },
      {
        word: "هَبْ",
        translation: "accorde",
        transliteration: "hab"
      },
      {
        word: "لَنَا",
        translation: "à nous",
        transliteration: "lana"
      },
      {
        word: "مِنْ",
        translation: "de",
        transliteration: "min"
      },
      {
        word: "أَزْوَاجِنَا",
        translation: "nos épouses",
        transliteration: "azwajina"
      },
      {
        word: "وَذُرِّيَّاتِنَا",
        translation: "et nos descendants",
        transliteration: "wa dhurriyyatina"
      },
      {
        word: "قُرَّةَ",
        translation: "la fraîcheur",
        transliteration: "qurrata"
      },
      {
        word: "أَعْيُنٍ",
        translation: "des yeux",
        transliteration: "a'yunin"
      },
      {
        word: "وَاجْعَلْنَا",
        translation: "et fais de nous",
        transliteration: "waj'alna"
      },
      {
        word: "لِلْمُتَّقِينَ",
        translation: "pour les pieux",
        transliteration: "lil-muttaqina"
      },
      {
        word: "إِمَامًا",
        translation: "un modèle",
        transliteration: "imama"
      }
    ]
  }
]; 
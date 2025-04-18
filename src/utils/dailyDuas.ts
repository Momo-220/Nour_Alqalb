export interface DailyDua {
  id: string;
  arabicText: string;
  transliteration: string;
  translation: string;
  source: string;
  context: string;
  benefits: string[];
}

const dailyDuas: DailyDua[] = [
  {
    id: "daily-1",
    arabicText: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ",
    transliteration: "Allahumma a'inni 'ala dhikrika wa shukrika wa husni 'ibadatika",
    translation: "Ô Allah, aide-moi à me souvenir de Toi, à Te remercier et à T'adorer de la meilleure façon.",
    source: "Rapporté par Abu Dawud et An-Nasa'i",
    context: "Cette invocation était régulièrement récitée par le Prophète ﷺ après les prières obligatoires. Elle est recommandée pour demander l'aide d'Allah dans notre adoration quotidienne.",
    benefits: ["Aide à maintenir une conscience constante d'Allah", "Facilite l'adoration", "Augmente la reconnaissance envers Allah"]
  },
  {
    id: "daily-2",
    arabicText: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan wa qina 'adhaban-nar",
    translation: "Notre Seigneur, accorde-nous le bien dans ce monde et le bien dans l'au-delà, et protège-nous du châtiment du Feu.",
    source: "Coran (2:201)",
    context: "Cette du'a est l'une des plus complètes et des plus concises du Coran. Le Prophète ﷺ la récitait fréquemment et c'est l'une des invocations les plus populaires parmi les musulmans.",
    benefits: ["Demander le bien dans cette vie et dans l'au-delà", "Protection contre l'Enfer", "Concision et compréhension"]
  },
  {
    id: "daily-3",
    arabicText: "اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى، وَالْعَفَافَ وَالْغِنَى",
    transliteration: "Allahumma inni as'alukal-huda wat-tuqa, wal-'afafa wal-ghina",
    translation: "Ô Allah, je Te demande la guidée, la piété, la chasteté et la suffisance.",
    source: "Rapporté par Muslim",
    context: "Une invocation concise qui rassemble les besoins spirituels et matériels essentiels d'un croyant.",
    benefits: ["Guidée dans la religion", "Protection contre les péchés", "Contentement et richesse spirituelle"]
  },
  {
    id: "daily-4",
    arabicText: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ، وَالْعَجْزِ وَالْكَسَلِ، وَالْبُخْلِ وَالْجُبْنِ، وَضَلَعِ الدَّيْنِ وَغَلَبَةِ الرِّجَالِ",
    transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan, wal-'ajzi wal-kasal, wal-bukhli wal-jubn, wa dhala'id-daini wa ghalabatir-rijal",
    translation: "Ô Allah, je cherche refuge auprès de Toi contre l'anxiété et la tristesse, l'incapacité et la paresse, l'avarice et la lâcheté, le poids des dettes et la domination des hommes.",
    source: "Rapporté par Al-Bukhari",
    context: "Une prière complète qui cherche la protection d'Allah contre les difficultés émotionnelles, spirituelles et matérielles que l'on peut rencontrer dans la vie.",
    benefits: ["Protection contre l'anxiété et la dépression", "Force contre la paresse", "Aide contre les dettes"]
  },
  {
    id: "daily-5",
    arabicText: "اللَّهُمَّ أَصْلِحْ لِي دِينِي الَّذِي هُوَ عِصْمَةُ أَمْرِي، وَأَصْلِحْ لِي دُنْيَايَ الَّتِي فِيهَا مَعَاشِي، وَأَصْلِحْ لِي آخِرَتِي الَّتِي فِيهَا مَعَادِي، وَاجْعَلِ الْحَيَاةَ زِيَادَةً لِي فِي كُلِّ خَيْرٍ، وَاجْعَلِ الْمَوْتَ رَاحَةً لِي مِنْ كُلِّ شَرٍّ",
    transliteration: "Allahumma aslih li dini alladhi huwa 'ismatu amri, wa aslih li dunyaya allati fiha ma'ashi, wa aslih li akhirati allati fiha ma'adi, waj'al hayata ziyadatan li fi kulli khair, waj'al mawta rahatan li min kulli sharr",
    translation: "Ô Allah, améliore ma religion qui est la protection de mes affaires, améliore ma vie d'ici-bas où se trouve ma subsistance, améliore mon au-delà où se trouve mon retour, fais que la vie soit pour moi un surplus de tout bien, et fais que la mort soit pour moi un repos de tout mal.",
    source: "Rapporté par Muslim",
    context: "Une invocation qui couvre tous les aspects de la vie d'un musulman : sa religion, sa vie mondaine et son au-delà.",
    benefits: ["Amélioration de la pratique religieuse", "Succès dans les affaires mondaines", "Préparation pour l'au-delà"]
  },
  {
    id: "daily-6",
    arabicText: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    transliteration: "Subhan-Allahi wa bihamdihi, subhan-Allahil-'Adhim",
    translation: "Gloire à Allah et à Sa louange, gloire à Allah le Magnifique.",
    source: "Rapporté par Al-Bukhari et Muslim",
    context: "Le Prophète ﷺ a dit : « Il y a deux paroles légères sur la langue, lourdes dans la balance et aimées du Tout Miséricordieux : Subhan-Allahi wa bihamdihi, subhan-Allahil-'Adhim. »",
    benefits: ["Récompenses abondantes", "Effacement des péchés", "Légères à prononcer"]
  },
  {
    id: "daily-7",
    arabicText: "اللَّهُمَّ إِنِّي ظَلَمْتُ نَفْسِي ظُلْمًا كَثِيرًا، وَلَا يَغْفِرُ الذُّنُوبَ إِلَّا أَنْتَ، فَاغْفِرْ لِي مَغْفِرَةً مِنْ عِنْدِكَ وَارْحَمْنِي، إِنَّكَ أَنْتَ الْغَفُورُ الرَّحِيمُ",
    transliteration: "Allahumma inni dhalamtu nafsi dhulman kathiran, wa la yaghfiru-dhunuba illa anta, faghfir li maghfiratan min 'indika warhamni, innaka antal-Ghafur-ur-Rahim",
    translation: "Ô Allah, je me suis fait beaucoup de tort à moi-même, et nul ne pardonne les péchés excepté Toi. Accorde-moi donc Ton pardon et aie pitié de moi. Tu es certes Celui qui pardonne, Le Très Miséricordieux.",
    source: "Rapporté par Al-Bukhari et Muslim",
    context: "Abu Bakr (qu'Allah soit satisfait de lui) a demandé au Prophète ﷺ de lui enseigner une invocation à réciter dans ses prières, et il lui a enseigné cette du'a.",
    benefits: ["Demande de pardon complet", "Reconnaissance de nos erreurs", "Espoir dans la miséricorde divine"]
  }
];

/**
 * Retourne une du'a aléatoire pour la section "Du'a du jour"
 * 
 * @returns DailyDua
 */
export function getRandomDailyDua(): DailyDua {
  // Générer un nombre aléatoire entre 0 et la longueur du tableau
  const randomIndex = Math.floor(Math.random() * dailyDuas.length);
  return dailyDuas[randomIndex];
}

export default dailyDuas; 
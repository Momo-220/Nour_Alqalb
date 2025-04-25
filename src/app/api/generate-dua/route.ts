import { NextRequest, NextResponse } from 'next/server';
import { generateSimpleDua } from '@/utils/geminiUtils';
import { Dua } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Accepter soit "intention" soit "query" pour plus de flexibilité
    const intention = body.intention || body.query;

    if (!intention) {
      return NextResponse.json({
        success: false,
        message: "Une intention ou requête est requise pour générer une dua",
      }, { status: 400 });
    }

    console.log("Requête reçue pour générer une dua pour:", intention);
    const result = await generateSimpleDua(intention);

    if (!result.success) {
      console.error("Échec de la génération:", result.error);
      return NextResponse.json({
        success: false,
        message: "Échec de la génération de la dua",
        error: result.error
      }, { status: 500 });
    } else {
      // Le résultat est une Dua
      const dua = result.dua;
      const formattedDua = {
        id: dua.id,
        arabicText: dua.arabicText,
        transliteration: dua.transliteration,
        translation: dua.translation,
        source: dua.source,
        category: intention,
        tags: dua.occasions || [],
        benefits: dua.occasions?.map(tag => `Bienfait lié à: ${tag}`) || [],
        occasions: dua.occasions || ["Quand vous en avez besoin"],
        generatedContext: `Cette dua est recommandée pour votre intention: "${intention}"`
      };
      
      console.log("Dua générée avec succès:", formattedDua.translation.substring(0, 50) + "...");
      return NextResponse.json({ dua: formattedDua });
    }
  } catch (error) {
    console.error("Erreur lors de la génération de la dua:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur lors du traitement de la demande",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
} 
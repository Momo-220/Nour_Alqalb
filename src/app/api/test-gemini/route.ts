import { NextResponse } from 'next/server';
import { testGeminiAPI } from '@/utils/geminiUtils';

export async function GET() {
  try {
    // Tester l'API Gemini
    const result = await testGeminiAPI();
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test de l'API Gemini réussi",
        response: result.response
      });
    } else {
      return NextResponse.json({
        success: false,
        message: "Échec du test de l'API Gemini",
        error: result.error
      }, { status: 500 });
    }
  } catch (error) {
    console.error("Erreur lors du test de l'API Gemini:", error);
    return NextResponse.json({
      success: false,
      message: "Erreur lors de l'exécution du test",
      error: error instanceof Error ? error.message : "Erreur inconnue"
    }, { status: 500 });
  }
} 
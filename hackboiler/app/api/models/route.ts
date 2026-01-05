import { NextResponse } from "next/server";
import { OllamaProvider } from "@/lib/ai/ollama";

export interface ModelInfo {
  id: string;
  name: string;
  provider: 'gemini' | 'ollama';
  description: string;
  size?: string;
  available: boolean;
  supportsVision?: boolean;
  supportsDocuments?: boolean;
}

export async function GET() {
  try {
    const models: ModelInfo[] = [];

    // Gemini models (all support vision and documents)
    const geminiModels: ModelInfo[] = [
      {
        id: 'gemini-2.5-flash',
        name: 'Gemini 2.5 Flash',
        provider: 'gemini',
        description: 'Latest • Vision • PDFs',
        available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        supportsVision: true,
        supportsDocuments: true,
      },
      {
        id: 'gemini-2.0-flash-lite',
        name: 'Gemini 2.0 Flash Lite',
        provider: 'gemini',
        description: 'Lightweight • Vision • PDFs',
        available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        supportsVision: true,
        supportsDocuments: true,
      },
      {
        id: 'gemini-flash-latest',
        name: 'Gemini Flash (Latest)',
        provider: 'gemini',
        description: 'Stable • Vision • PDFs',
        available: !!process.env.GOOGLE_GENERATIVE_AI_API_KEY,
        supportsVision: true,
        supportsDocuments: true,
      },
    ];

    models.push(...geminiModels);

    // Ollama models (check if Ollama is running)
    try {
      const ollama = new OllamaProvider();
      const isAvailable = await ollama.isAvailable();

      if (isAvailable) {
        const ollamaModels = await ollama.listModels();
        
        const formattedOllamaModels: ModelInfo[] = ollamaModels.map(model => {
          // Check if model supports vision (llava models)
          const supportsVision = model.name.toLowerCase().includes('llava');
          
          return {
            id: model.name,
            name: model.name.split(':')[0].charAt(0).toUpperCase() + model.name.split(':')[0].slice(1),
            provider: 'ollama',
            description: `Local • ${model.size}${supportsVision ? ' • Vision' : ''}`,
            size: model.size,
            available: true,
            supportsVision,
            supportsDocuments: false, // Ollama doesn't support PDFs
          };
        });

        models.push(...formattedOllamaModels);
      }
    } catch (ollamaError) {
      console.log('Ollama not available:', ollamaError);
      // Ollama not running, skip local models
    }

    return NextResponse.json({ models });
  } catch (error) {
    console.error("Error fetching models:", error);
    return NextResponse.json(
      { error: "Failed to fetch models" },
      { status: 500 }
    );
  }
}

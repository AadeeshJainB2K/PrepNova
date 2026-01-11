import 'dotenv/config';

interface Model {
  name: string;
  displayName?: string;
  description?: string;
  supportedGenerationMethods?: string[];
}

interface ModelsResponse {
  models?: Model[];
}

async function listModels() {
  try {
    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
    
    if (!apiKey) {
      console.error("❌ GOOGLE_GENERATIVE_AI_API_KEY not found in .env.local");
      process.exit(1);
    }

    console.log("🔍 Fetching available models...\n");
    
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${await response.text()}`);
    }
    
    const data = await response.json() as ModelsResponse;
    
    console.log("✅ Available Models:\n");
    console.log("=".repeat(80));
    
    if (data.models) {
      for (const model of data.models) {
        console.log(`\n📦 Model: ${model.name}`);
        console.log(`   Display Name: ${model.displayName || 'N/A'}`);
        console.log(`   Description: ${model.description || 'N/A'}`);
        
        if (model.supportedGenerationMethods) {
          console.log(`   Supported Methods: ${model.supportedGenerationMethods.join(", ")}`);
        }
        
        console.log("-".repeat(80));
      }
      
      console.log("\n✨ Models that support 'generateContent':\n");
      
      const generateContentModels = data.models.filter(m => 
        m.supportedGenerationMethods?.includes('generateContent')
      );
      
      generateContentModels.forEach(m => {
        const modelId = m.name.replace('models/', '');
        console.log(`  ✓ ${modelId}`);
      });
      
      console.log(`\n📊 Total: ${generateContentModels.length} models available for chat\n`);
    } else {
      console.log("No models found");
    }
    
  } catch (error) {
    console.error("❌ Error:", error instanceof Error ? error.message : String(error));
    process.exit(1);
  }
}

listModels();

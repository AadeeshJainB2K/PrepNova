"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export interface GenerateQuestionParams {
  examId: string;
  difficulty: "Easy" | "Medium" | "Hard";
  subject?: string;
  topic?: string;
  aiModel?: string;
}

export interface GeneratedQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  subject: string;
  topic: string;
  difficulty: string;
  explanation: string;
}

// Exam contexts
const EXAM_CONTEXTS: Record<string, any> = {
  "jee-mains": {
    name: "JEE Mains",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    pattern: "Multiple choice questions testing conceptual understanding and problem-solving",
  },
  neet: {
    name: "NEET",
    subjects: ["Physics", "Chemistry", "Biology"],
    pattern: "Medical entrance exam focusing on NCERT-based concepts",
  },
  clat: {
    name: "CLAT",
    subjects: ["Legal Reasoning", "Logical Reasoning", "English", "General Knowledge", "Quantitative Techniques"],
    pattern: "Law entrance exam with comprehension and reasoning",
  },
  cat: {
    name: "CAT",
    subjects: ["Quantitative Ability", "Verbal Ability", "Data Interpretation", "Logical Reasoning"],
    pattern: "MBA entrance focusing on aptitude and reasoning",
  },
  gate: {
    name: "GATE",
    subjects: ["Engineering Mathematics", "General Aptitude", "Technical Subject"],
    pattern: "Engineering entrance with technical depth",
  },
  "upsc-cse": {
    name: "UPSC CSE",
    subjects: ["General Studies", "Current Affairs", "History", "Geography", "Polity"],
    pattern: "Civil services exam testing broad knowledge",
  },
};

function isOllamaModel(modelName: string): boolean {
  const lowerModel = modelName.toLowerCase();
  // Check for Ollama-specific patterns
  return lowerModel.includes('llama') ||
         lowerModel.includes('qwen') ||
         lowerModel.includes('mistral') ||
         lowerModel.includes('gemma') ||
         lowerModel.includes('llava') ||
         lowerModel.includes(':') || // Ollama models often have version tags
         !lowerModel.includes('gemini'); // If it's not Gemini, assume Ollama
}

export async function generateQuestion({
  examId,
  difficulty,
  subject,
  topic,
  aiModel = "gemini-2.5-flash",
}: GenerateQuestionParams): Promise<GeneratedQuestion> {
  const examContext = EXAM_CONTEXTS[examId] || EXAM_CONTEXTS["jee-mains"];
  const examName = examContext.name;
  const selectedSubject = subject || examContext.subjects[0];

  // Optimized prompt to generate question + explanation together
  const prompt = `Generate a ${difficulty} ${examName} question for ${selectedSubject}${topic ? ` on ${topic}` : ""}.

Requirements:
- NEW and UNIQUE question
- ${difficulty} difficulty
- Exactly 4 options (A, B, C, D)
- One correct answer
- Brief explanation (5-7 lines MAX)

JSON format:
{
  "question": "question text",
  "options": ["A text", "B text", "C text", "D text"],
  "correctAnswer": "A",
  "topic": "topic name",
  "explanation": "Brief explanation with key concept, calculation, and why the answer is correct"
}

Generate the question now in JSON format:`;

  try {
    let text: string;
    
    // Log for debugging
    console.log("🤖 Model requested:", aiModel);
    console.log("🔍 Is Ollama?", isOllamaModel(aiModel));
    
    if (isOllamaModel(aiModel)) {
      console.log("✅ Using Ollama for generation");
      
      // Use Ollama for local models
      const { OllamaProvider } = await import("@/lib/ai/ollama");
      const ollama = new OllamaProvider();
      
      // Check availability
      const isAvailable = await ollama.isAvailable();
      if (!isAvailable) {
        throw new Error("Ollama is not running. Start it with: ollama serve");
      }
      
      console.log("📡 Generating with Ollama model:", aiModel);
      
      // Generate with streaming
      let fullResponse = '';
      const stream = ollama.generateStream(prompt, [], aiModel, undefined);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
      }
      
      text = fullResponse;
      console.log("✅ Ollama generation complete, length:", text.length);
    } else {
      console.log("☁️ Using Gemini for generation");
      
      // Use Google Gemini
      const result = await generateText({
        model: google(aiModel),
        prompt,
        temperature: 0.8,
      });
      text = result.text;
    }

    // Parse JSON response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("❌ No JSON found in response. First 500 chars:", text.substring(0, 500));
      throw new Error("No JSON found in response");
    }

    const parsed = JSON.parse(jsonMatch[0]);

    // Validate required fields
    if (!parsed.question || !parsed.options || !parsed.correctAnswer) {
      console.error("❌ Missing required fields:", parsed);
      throw new Error("Missing required fields in response");
    }

    console.log("✅ Question generated successfully");

    return {
      question: parsed.question,
      options: parsed.options,
      correctAnswer: parsed.correctAnswer,
      subject: selectedSubject,
      topic: parsed.topic || topic || "General",
      difficulty,
      explanation: parsed.explanation || "No explanation provided",
    };
  } catch (error: any) {
    console.error("❌ Error generating question:", error.message);
    
    // Provide helpful error messages
    if (error.message?.includes("quota")) {
      throw new Error("Gemini API quota exceeded. Please use a local Ollama model instead.");
    } else if (error.message?.includes("Ollama")) {
      throw new Error(error.message);
    } else {
      throw new Error(`Failed to generate question: ${error.message}`);
    }
  }
}

export async function generateExplanation(
  question: string,
  options: string[],
  correctAnswer: string,
  userAnswer: string,
  subject: string,
  aiModel: string = "gemini-2.5-flash"
): Promise<string> {
  const isCorrect = userAnswer === correctAnswer;
  
  const prompt = `Explain this ${subject} question BRIEFLY (5-7 lines MAX).

Q: ${question}
Options: ${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join(", ")}
Correct: ${correctAnswer} | User: ${userAnswer}

Provide:
1. Key formula/concept
2. Quick calculation
3. Why ${correctAnswer} is correct
${!isCorrect ? `4. Why ${userAnswer} is wrong` : ""}

Be concise:`;

  try {
    let text: string;
    
    console.log("🤖 Explanation model requested:", aiModel);
    
    if (isOllamaModel(aiModel)) {
      console.log("✅ Using Ollama for explanation");
      
      // Use Ollama for local models
      const { OllamaProvider } = await import("@/lib/ai/ollama");
      const ollama = new OllamaProvider();
      
      // Check availability
      const isAvailable = await ollama.isAvailable();
      if (!isAvailable) {
        throw new Error("Ollama is not running. Start it with: ollama serve");
      }
      
      console.log("📡 Generating explanation with Ollama model:", aiModel);
      
      // Generate with streaming
      let fullResponse = '';
      const stream = ollama.generateStream(prompt, [], aiModel, undefined);
      
      for await (const chunk of stream) {
        fullResponse += chunk;
      }
      
      text = fullResponse;
      console.log("✅ Ollama explanation complete, length:", text.length);
    } else {
      console.log("☁️ Using Gemini for explanation");
      
      // Use Google Gemini
      const result = await generateText({
        model: google(aiModel),
        prompt,
        temperature: 0.6,
      });
      text = result.text;
    }

    return text.trim();
  } catch (error) {
    console.error("Error generating explanation:", error);
    return `**Correct Answer: ${correctAnswer}**\n\nThe correct answer is option ${correctAnswer}. ${isCorrect ? "Great job!" : "Review the concept and try again."}`;
  }
}

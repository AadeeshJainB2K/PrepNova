import { NextRequest } from "next/server";
import { auth } from "@/auth";
import { saveGeneratedQuestion, getSessionDetails } from "@/lib/db/mock-tests";

// Detailed topic lists per exam
const EXAM_CONTEXTS: Record<string, { name: string; subjects: string[]; topics: Record<string, string[]> }> = {
  "jee-mains": {
    name: "JEE Mains",
    subjects: ["Physics", "Chemistry", "Mathematics"],
    topics: {
      "Physics": ["Mechanics - Newton's Laws", "Mechanics - Projectile Motion", "Electromagnetism - Coulomb's Law", "Optics - Reflection & Refraction", "Thermodynamics - Heat Engines", "Waves - Sound Waves", "Modern Physics - Photoelectric Effect"],
      "Chemistry": ["Organic - Hydrocarbons", "Organic - Alcohols & Ethers", "Inorganic - Periodic Table", "Inorganic - Coordination Compounds", "Physical - Electrochemistry", "Physical - Chemical Kinetics"],
      "Mathematics": ["Calculus - Differentiation", "Calculus - Integration", "Algebra - Quadratic Equations", "Algebra - Complex Numbers", "Coordinate Geometry - Straight Lines", "Trigonometry - Identities", "Probability"],
    }
  },
  neet: {
    name: "NEET",
    subjects: ["Physics", "Chemistry", "Biology"],
    topics: {
      "Physics": ["Mechanics - Laws of Motion", "Electrostatics", "Optics - Lens Formula", "Modern Physics"],
      "Chemistry": ["Organic - Biomolecules", "Inorganic - p-Block Elements", "Physical - Solutions"],
      "Biology": ["Cell Biology", "Genetics", "Ecology", "Human Physiology"],
    }
  },
  clat: { name: "CLAT", subjects: ["Legal Reasoning", "Logical Reasoning", "English", "General Knowledge"], topics: {} },
  cat: { name: "CAT", subjects: ["Quantitative Ability", "Verbal Ability", "Data Interpretation", "Logical Reasoning"], topics: {} },
  gate: { name: "GATE", subjects: ["Engineering Mathematics", "General Aptitude", "Technical Subject"], topics: {} },
  "upsc-cse": { name: "UPSC CSE", subjects: ["General Studies", "Current Affairs", "History", "Geography", "Polity"], topics: {} },
};

function isOllamaModel(modelName: string): boolean {
  const lowerModel = modelName.toLowerCase();
  return lowerModel.includes('llama') || lowerModel.includes('qwen') || lowerModel.includes('mistral') || 
         lowerModel.includes('gemma') || lowerModel.includes(':') || !lowerModel.includes('gemini');
}

// SIMPLE: Just escape backslashes before JSON parsing
function escapeBackslashes(str: string): string {
  // Replace single \ with \\ (but not already doubled \\)
  let result = '';
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '\\') {
      const next = str[i + 1];
      // If already escaped or valid JSON escape, keep as is
      if (next === '\\' || next === '"' || next === 'n' || next === 'r' || next === 't' || next === 'b' || next === 'f' || next === 'u') {
        result += str[i];
      } else {
        // Single backslash - double it
        result += '\\\\';
      }
    } else {
      result += str[i];
    }
  }
  return result;
}

// SIMPLE JSON extraction with fallback
function extractAndParseJSON(text: string): Record<string, unknown> {
  console.log("🔍 Raw:", text.substring(0, 300));
  
  // Remove markdown blocks
  const cleaned = text.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  
  // Find JSON boundaries
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  
  if (start === -1 || end === -1) {
    throw new Error("No JSON found");
  }
  
  const jsonStr = cleaned.substring(start, end + 1);
  
  // Try 1: Direct parse
  try {
    return JSON.parse(jsonStr);
  } catch {
    console.log("⚠️ Direct parse failed, trying with escaped backslashes...");
  }
  
  // Try 2: Escape backslashes and parse
  const escapedJson = escapeBackslashes(jsonStr);
  try {
    return JSON.parse(escapedJson);
  } catch {
    console.log("⚠️ Escaped parse failed, trying regex extraction...");
  }
  
  // Try 3: Regex fallback extraction
  const result = regexExtract(jsonStr);
  if (result.question && result.options && result.correctAnswer) {
    console.log("✅ Regex extraction successful");
    return result;
  }
  
  console.error("❌ All parsing methods failed");
  throw new Error("Failed to parse JSON");
}

// Regex-based field extraction (handles broken JSON)
function regexExtract(text: string): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  
  // Extract question (more lenient - capture until we hit a comma + newline or end)
  const qMatch = text.match(/"question"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (qMatch) {
    result.question = qMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
    console.log("📝 Found question:", (result.question as string).substring(0, 50));
  }
  
  // Extract correctAnswer (accept A-D or numbers 1-4)
  const aMatch = text.match(/"correctAnswer"\s*:\s*"?([A-Da-d1-4])"?/i);
  if (aMatch) {
    let ans = aMatch[1].toUpperCase();
    // Convert 1-4 to A-D
    if (['1','2','3','4'].includes(ans)) {
      ans = String.fromCharCode(64 + parseInt(ans));
    }
    result.correctAnswer = ans;
    console.log("📝 Found answer:", result.correctAnswer);
  }
  
  // Extract topic
  const tMatch = text.match(/"topic"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (tMatch) result.topic = tMatch[1];
  
  // Extract explanation
  const eMatch = text.match(/"explanation"\s*:\s*"((?:[^"\\]|\\.)*)"/);
  if (eMatch) result.explanation = eMatch[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  
  // Extract options - be lenient
  const oMatch = text.match(/"options"\s*:\s*\[([\s\S]*?)\]/);
  if (oMatch) {
    const optionsStr = oMatch[1];
    const options: string[] = [];
    const optMatches = optionsStr.matchAll(/"((?:[^"\\]|\\.)*)"/g);
    for (const m of optMatches) {
      options.push(m[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'));
    }
    console.log("📝 Found options:", options.length);
    
    // Fill missing options with placeholders
    while (options.length < 4) {
      options.push(`Option ${String.fromCharCode(65 + options.length)}`);
    }
    result.options = options.slice(0, 4);
  }
  
  return result;
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const body = await request.json();
    const { examId, difficulty, subject, topic, sessionId, stream = false } = body;

    if (!examId || !difficulty) {
      return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers: { "Content-Type": "application/json" } });
    }

    let aiModel = "gemini-2.5-flash";
    if (sessionId) {
      try {
        const sessionDetails = await getSessionDetails(sessionId);
        if (sessionDetails?.aiModel) aiModel = sessionDetails.aiModel;
      } catch {}
    }
    console.log("✅ Model:", aiModel);

    const examContext = EXAM_CONTEXTS[examId] || EXAM_CONTEXTS["jee-mains"];
    const selectedSubject = subject || examContext.subjects[Math.floor(Math.random() * examContext.subjects.length)];
    const subjectTopics = examContext.topics[selectedSubject] || [];
    const selectedTopic = topic || subjectTopics[Math.floor(Math.random() * subjectTopics.length)] || selectedSubject;

    // COMPREHENSIVE LATEX PROMPT
    const prompt = `You are a ${examContext.name} question generator. Generate a ${difficulty} MCQ for:
SUBJECT: ${selectedSubject}
TOPIC: ${selectedTopic}

=== LATEX RULES FOR JSON ===
In JSON, you MUST write LaTeX with DOUBLE backslashes because \\ is an escape character.

FRACTIONS:
- Write: "$\\\\frac{1}{2}$" (NOT "$\\frac{1}{2}$")
- Example: "What is $\\\\frac{3}{4} + \\\\frac{1}{4}$?"

SQUARE ROOTS:
- Write: "$\\\\sqrt{2}$" (NOT "$\\sqrt{2}$")
- Nested: "$\\\\sqrt{\\\\frac{a}{b}}$"

POWERS/EXPONENTS:
- Write: "$x^{2}$" or "$x^{n}$"
- Example: "Solve $x^{2} + 2x + 1 = 0$"

SUBSCRIPTS:
- Write: "$x_{1}$", "$a_{n}$"
- Example: "Find $x_{1} + x_{2}$"

GREEK LETTERS:
- Alpha: "$\\\\alpha$"
- Beta: "$\\\\beta$"
- Theta: "$\\\\theta$"
- Pi: "$\\\\pi$"
- Omega: "$\\\\omega$"
- Sigma: "$\\\\sigma$"
- Delta: "$\\\\Delta$"
- Lambda: "$\\\\lambda$"

TRIGONOMETRY:
- Sin: "$\\\\sin(x)$"
- Cos: "$\\\\cos(\\\\theta)$"
- Tan: "$\\\\tan(x)$"

LIMITS:
- Write: "$\\\\lim_{x \\\\to 0} f(x)$"
- Example: "Find $\\\\lim_{x \\\\to \\\\infty} \\\\frac{1}{x}$"

INTEGRALS:
- Write: "$\\\\int_{0}^{1} x dx$"
- Example: "Evaluate $\\\\int x^{2} dx$"

SUMMATION:
- Write: "$\\\\sum_{i=1}^{n} i$"

DERIVATIVES:
- Write: "$\\\\frac{dy}{dx}$" or "$f'(x)$"

OPERATORS:
- Multiplication: "$\\\\times$" or "$\\\\cdot$"
- Division: "$\\\\div$"
- Plus-minus: "$\\\\pm$"
- Less/Greater equal: "$\\\\leq$", "$\\\\geq$"
- Not equal: "$\\\\neq$"
- Approximately: "$\\\\approx$"
- Infinity: "$\\\\infty$"
- Arrow: "$\\\\rightarrow$"

=== OUTPUT FORMAT ===
Return ONLY this JSON (no other text):
{
  "question": "Your question with $\\\\frac{a}{b}$ style LaTeX",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswer": "A",
  "topic": "${selectedTopic}",
  "explanation": "Detailed step-by-step solution (3-5 sentences) explaining the concept and solution process"
}

Generate a unique, challenging question now:`;

    // STREAMING MODE
    if (stream) {
      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        async start(controller) {
          try {
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'status', message: 'Generating...' }) + '\n'));
            
            let fullText = "";
            
            if (isOllamaModel(aiModel)) {
              const { OllamaProvider } = await import("@/lib/ai/ollama");
              const ollama = new OllamaProvider();
              if (!(await ollama.isAvailable())) {
                controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: 'Ollama not running' }) + '\n'));
                controller.close();
                return;
              }
              for await (const chunk of ollama.generateStream(prompt, [], aiModel, undefined)) {
                fullText += chunk;
              }
            } else {
              const { google } = await import("@ai-sdk/google");
              const { generateText } = await import("ai");
              const result = await generateText({ model: google(aiModel), prompt, temperature: 0.8 });
              fullText = result.text;
            }
            
            const parsed = extractAndParseJSON(fullText);
            
            if (!parsed.question || !parsed.options || !parsed.correctAnswer) {
              throw new Error("Missing required fields");
            }
            
            const savedQuestion = await saveGeneratedQuestion(examId, {
              subject: selectedSubject,
              topic: (parsed.topic as string) || selectedTopic,
              question: parsed.question as string,
              options: parsed.options as string[],
              correctAnswer: parsed.correctAnswer as string,
              explanation: (parsed.explanation as string) || "",
              baseExplanation: (parsed.explanation as string) || "",
              difficulty,
            });
            
            controller.enqueue(encoder.encode(JSON.stringify({
              type: 'complete',
              success: true,
              question: {
                id: savedQuestion.id,
                question: savedQuestion.question,
                options: JSON.parse(savedQuestion.options),
                subject: savedQuestion.subject,
                topic: savedQuestion.topic,
                difficulty: savedQuestion.difficulty,
              }
            }) + '\n'));
            
          } catch (error) {
            console.error("❌ Error:", error);
            controller.enqueue(encoder.encode(JSON.stringify({ type: 'error', message: error instanceof Error ? error.message : "Failed" }) + '\n'));
          } finally {
            controller.close();
          }
        }
      });
      
      return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-cache" } });
    }
    
    // NON-STREAMING MODE
    let text: string;
    
    if (isOllamaModel(aiModel)) {
      const { OllamaProvider } = await import("@/lib/ai/ollama");
      const ollama = new OllamaProvider();
      if (!(await ollama.isAvailable())) throw new Error("Ollama not running");
      let response = '';
      for await (const chunk of ollama.generateStream(prompt, [], aiModel, undefined)) {
        response += chunk;
      }
      text = response;
    } else {
      const { google } = await import("@ai-sdk/google");
      const { generateText } = await import("ai");
      const result = await generateText({ model: google(aiModel), prompt, temperature: 0.8 });
      text = result.text;
    }
    
    const parsed = extractAndParseJSON(text);
    
    if (!parsed.question || !parsed.options || !parsed.correctAnswer) {
      throw new Error("Missing required fields");
    }
    
    const savedQuestion = await saveGeneratedQuestion(examId, {
      subject: selectedSubject,
      topic: (parsed.topic as string) || selectedTopic,
      question: parsed.question as string,
      options: parsed.options as string[],
      correctAnswer: parsed.correctAnswer as string,
      explanation: (parsed.explanation as string) || "",
      baseExplanation: (parsed.explanation as string) || "",
      difficulty,
    });

    return new Response(JSON.stringify({
      success: true,
      question: {
        id: savedQuestion.id,
        question: savedQuestion.question,
        options: JSON.parse(savedQuestion.options),
        subject: savedQuestion.subject,
        topic: savedQuestion.topic,
        difficulty: savedQuestion.difficulty,
      },
    }), { headers: { "Content-Type": "application/json" } });
    
  } catch (error) {
    console.error("❌ Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}

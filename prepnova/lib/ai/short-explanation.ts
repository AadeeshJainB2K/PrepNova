"use server";

import { google } from "@ai-sdk/google";
import { generateText } from "ai";

// ... existing code ...

// Updated explanation generator with shorter prompts
export async function generateExplanation(
  question: string,
  options: string[],
  correctAnswer: string,
  userAnswer: string
): Promise<string> {
  const isCorrect = userAnswer === correctAnswer;
  
  const prompt = `Provide a CONCISE explanation (5-10 lines MAX).

Q: ${question}
Options: ${options.map((opt, idx) => `${String.fromCharCode(65 + idx)}. ${opt}`).join(", ")}
Correct: ${correctAnswer} | User: ${userAnswer} | ${isCorrect ? "✓ CORRECT" : "✗ WRONG"}

Keep it SHORT. Include:
1. Key formula (use LaTeX: $x^2$ or $$\\frac{a}{b}$$)
2. Brief calculation
3. Final answer
${!isCorrect ? `4. Why ${userAnswer} is wrong` : ""}

Be direct and concise:`;

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt,
      temperature: 0.7,
      maxOutputTokens: 400, // Reduced for shorter responses
    });

    return text.trim();
  } catch (error) {
    console.error("Error generating explanation:", error);
    return `**Correct Answer: ${correctAnswer}**\n\nThe correct answer is option ${correctAnswer}. ${isCorrect ? "Great job!" : "Review the concept and try again."}`;
  }
}

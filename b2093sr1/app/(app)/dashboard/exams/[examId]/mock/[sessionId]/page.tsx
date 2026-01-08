"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Clock, Trophy, Loader2, CheckCircle, XCircle, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";

const EXAM_DATA: Record<string, any> = {
  "jee-mains": { name: "JEE Mains" },
  "neet": { name: "NEET" },
  "clat": { name: "CLAT" },
  "cat": { name: "CAT" },
  "gate": { name: "GATE" },
  "upsc-cse": { name: "UPSC CSE" },
};

interface Question {
  id: string;
  question: string;
  options: string[];
  subject: string;
  topic: string;
  difficulty: string;
}

export default function MockTestInterfacePage({
  params,
}: {
  params: Promise<{ examId: string; sessionId: string }>;
}) {
  const { examId, sessionId } = use(params);
  const exam = EXAM_DATA[examId];

  const [session, setSession] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [feedback, setFeedback] = useState<{
    isCorrect: boolean;
    correctAnswer: string;
    explanation: string;
  } | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());

  // Load session details
  useEffect(() => {
    loadSession();
  }, [sessionId]);

  // Generate first question
  useEffect(() => {
    if (session && !currentQuestion) {
      generateNewQuestion();
    }
  }, [session]);

  const loadSession = async () => {
    try {
      const response = await fetch(`/api/mock-tests/sessions?sessionId=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setSession(data.session);
      }
    } catch (error) {
      console.error("Error loading session:", error);
    }
  };

  const generateNewQuestion = async () => {
    setIsGenerating(true);
    setSelectedAnswer(null);
    setFeedback(null);
    setShowExplanation(false);
    setQuestionStartTime(Date.now());

    try {
      const response = await fetch("/api/mock-tests/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          examName: exam.name,
          difficulty: session.difficulty,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setCurrentQuestion(data.question);
      } else {
        alert("Failed to generate question");
      }
    } catch (error) {
      console.error("Error generating question:", error);
      alert("Failed to generate question");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || !currentQuestion) return;

    setIsSubmitting(true);
    const timeSpent = Math.floor((Date.now() - questionStartTime) / 1000);

    try {
      const response = await fetch("/api/mock-tests/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          questionId: currentQuestion.id,
          userAnswer: selectedAnswer,
          timeSpent,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setFeedback({
          isCorrect: data.isCorrect,
          correctAnswer: data.correctAnswer,
          explanation: data.explanation,
        });
        setShowExplanation(true);
        // Update session stats
        setSession((prev: any) => ({
          ...prev,
          totalQuestions: data.stats.totalQuestions,
          correctAnswers: data.stats.correctAnswers,
          score: data.stats.score,
        }));
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      alert("Failed to submit answer");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/dashboard/mock-tests"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Exit Test
        </Link>

        {/* Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Trophy className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              Score: {session.score}%
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <span className="text-gray-600 dark:text-gray-400">
              {session.correctAnswers}/{session.totalQuestions}
            </span>
          </div>
          <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-sm font-medium text-purple-700 dark:text-purple-400">
            {session.difficulty}
          </div>
        </div>
      </div>

      {/* Question Card */}
      {isGenerating ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center gap-4">
            <Sparkles className="h-12 w-12 text-purple-600 animate-pulse" />
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
              Generating your next question...
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI is creating a unique question just for you
            </p>
          </div>
        </div>
      ) : currentQuestion ? (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
          {/* Question Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {currentQuestion.subject}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {currentQuestion.topic}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                Question #{session.totalQuestions + 1}
              </h2>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>

          {/* Question Text */}
          <div className="mb-8 p-6 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <div className="prose prose-sm dark:prose-invert max-w-none text-lg">
              <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {currentQuestion.question}
              </ReactMarkdown>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3 mb-8">
            {currentQuestion.options.map((option, index) => {
              const optionLetter = String.fromCharCode(65 + index);
              const isSelected = selectedAnswer === optionLetter;
              const isCorrect = feedback?.correctAnswer === optionLetter;
              const isWrong = showExplanation && isSelected && !feedback?.isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => !showExplanation && setSelectedAnswer(optionLetter)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    showExplanation
                      ? isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-200 dark:border-gray-700"
                      : isSelected
                      ? "border-purple-600 bg-purple-50 dark:bg-purple-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        showExplanation
                          ? isCorrect
                            ? "bg-green-500 text-white"
                            : isWrong
                            ? "bg-red-500 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          : isSelected
                          ? "bg-purple-600 text-white"
                          : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {showExplanation && isCorrect ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : showExplanation && isWrong ? (
                        <XCircle className="h-5 w-5" />
                      ) : (
                        optionLetter
                      )}
                    </div>
                    <div className="flex-1 prose prose-sm dark:prose-invert">
                      <ReactMarkdown
                        remarkPlugins={[remarkMath]}
                        rehypePlugins={[rehypeKatex]}
                      >
                        {option}
                      </ReactMarkdown>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          {!showExplanation ? (
            <button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswer || isSubmitting}
              className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Submitting..." : "Submit Answer"}
            </button>
          ) : (
            <div className="space-y-4">
              {/* Feedback */}
              <div
                className={`p-4 rounded-lg ${
                  feedback?.isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {feedback?.isCorrect ? (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-semibold text-green-900 dark:text-green-100">
                        Correct! Well done! 🎉
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-5 w-5 text-red-600" />
                      <span className="font-semibold text-red-900 dark:text-red-100">
                        Incorrect. The correct answer is {feedback?.correctAnswer}
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Explanation */}
              <div className="p-6 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Detailed Explanation
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                  >
                    {feedback?.explanation || ""}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Next Question Button */}
              <button
                onClick={generateNewQuestion}
                className="w-full rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-lg font-semibold text-white hover:from-purple-700 hover:to-pink-700 transition-all"
              >
                Next Question →
              </button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

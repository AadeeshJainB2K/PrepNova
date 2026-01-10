"use client";

import { use, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowLeft, Brain, Clock, Trophy, CheckCircle, XCircle, Target } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { formatDistanceToNow } from "date-fns";

interface QuestionReview {
  questionId: string;
  question: string;
  options: string[];
  correctAnswer: string;
  userAnswer: string;
  isCorrect: boolean;
  explanation: string;
  subject: string;
  topic: string;
  difficulty: string;
  timeSpent: number;
}

interface SessionData {
  id: string;
  examId: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: string;
  timeSpent: number;
  startedAt: Date;
  completedAt: Date | null;
  status: string;
}

interface ExamData {
  name: string;
  fullName: string;
}

const EXAM_DATA: Record<string, ExamData> = {
  "jee-mains": { name: "JEE Mains", fullName: "Joint Entrance Examination - Main" },
  "neet": { name: "NEET", fullName: "National Eligibility cum Entrance Test" },
  "clat": { name: "CLAT", fullName: "Common Law Admission Test" },
  "cat": { name: "CAT", fullName: "Common Admission Test" },
  "gate": { name: "GATE", fullName: "Graduate Aptitude Test in Engineering" },
  "upsc-cse": { name: "UPSC CSE", fullName: "Civil Services Examination" },
};

export default function SessionReviewPage({
  params,
}: {
  params: Promise<{ examId: string; sessionId: string }>;
}) {
  const { examId, sessionId } = use(params);
  const exam = EXAM_DATA[examId];

  const [session, setSession] = useState<SessionData | null>(null);
  const [questions, setQuestions] = useState<QuestionReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const fetchSessionDetails = useCallback(async () => {
    try {
      const response = await fetch(`/api/mock-tests/sessions?sessionId=${sessionId}`);
      const data = await response.json();
      if (data.success) {
        setSession(data.session);
        setQuestions(data.questions);
      }
    } catch (error) {
      console.error("Error fetching session:", error);
    } finally {
      setLoading(false);
    }
  }, [sessionId]);

  useEffect(() => {
    fetchSessionDetails();
  }, [fetchSessionDetails]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}m ${secs}s`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Brain className="h-12 w-12 animate-pulse text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading session details...</p>
        </div>
      </div>
    );
  }

  if (!session || !exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Session Not Found</h2>
          <Link
            href="/dashboard/mock-tests"
            className="mt-4 inline-block rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-700"
          >
            Back to Mock Tests
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/mock-tests"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Mock Tests
      </Link>

      {/* Session Header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">{exam.name} - Session Review</h1>
            <p className="text-purple-100 mt-2">{exam.fullName}</p>
            <p className="text-sm text-purple-200 mt-1">
              Attempted {formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}
            </p>
          </div>
          <div className="text-right">
            <div className="text-5xl font-bold">{Math.round(parseFloat(session.score))}%</div>
            <div className="text-purple-100">Overall Score</div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct Answers</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {session.correctAnswers}/{session.totalQuestions}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <Clock className="h-8 w-8 text-blue-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time Spent</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatTime(session.timeSpent)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-purple-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Difficulty</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {session.difficulty}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-green-600" />
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Time/Question</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {Math.round(session.timeSpent / session.totalQuestions)}s
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Review */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Questions Review ({questions.length})
        </h2>

        <div className="space-y-4">
          {questions.map((q, index) => (
            <div
              key={q.questionId}
              className={`rounded-lg border-2 ${
                q.isCorrect
                  ? "border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10"
                  : "border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/10"
              } p-6`}
            >
              {/* Question Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                      Question #{index + 1}
                    </span>
                    {q.isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {q.subject} • {q.topic}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Time: {formatTime(q.timeSpent)}
                  </div>
                </div>
              </div>

              {/* Question Text */}
              <div className="mb-4 p-4 rounded-lg bg-white dark:bg-gray-800">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {q.question}
                  </ReactMarkdown>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2 mb-4">
                {q.options.map((option, idx) => {
                  const optionLetter = String.fromCharCode(65 + idx);
                  const isCorrect = optionLetter === q.correctAnswer;
                  const isUserAnswer = optionLetter === q.userAnswer;

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-lg border-2 ${
                        isCorrect
                          ? "border-green-500 bg-green-100 dark:bg-green-900/20"
                          : isUserAnswer
                          ? "border-red-500 bg-red-100 dark:bg-red-900/20"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                            isCorrect
                              ? "bg-green-500 text-white"
                              : isUserAnswer
                              ? "bg-red-500 text-white"
                              : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle className="h-5 w-5" />
                          ) : isUserAnswer ? (
                            <XCircle className="h-5 w-5" />
                          ) : (
                            optionLetter
                          )}
                        </div>
                        <div className="flex-1 prose prose-sm dark:prose-invert">
                          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                            {option}
                          </ReactMarkdown>
                        </div>
                        {isCorrect && (
                          <span className="text-sm font-medium text-green-700 dark:text-green-400">
                            Correct Answer
                          </span>
                        )}
                        {isUserAnswer && !isCorrect && (
                          <span className="text-sm font-medium text-red-700 dark:text-red-400">
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Explanation Toggle */}
              <button
                onClick={() =>
                  setExpandedQuestion(expandedQuestion === q.questionId ? null : q.questionId)
                }
                className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium"
              >
                {expandedQuestion === q.questionId ? "Hide" : "Show"} Explanation
              </button>

              {/* Explanation */}
              {expandedQuestion === q.questionId && (
                <div className="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2 flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Detailed Explanation
                  </h4>
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                      {q.explanation}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

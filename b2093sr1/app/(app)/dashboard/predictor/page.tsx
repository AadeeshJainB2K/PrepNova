"use client";

import { useState } from "react";
import { Sparkles, Target, TrendingUp, AlertCircle, CheckCircle, Brain, Loader2, Calculator } from "lucide-react";

interface SubjectAnalysis {
  subject: string;
  score: number;
  status: "excellent" | "good" | "needs improvement";
}

interface Recommendation {
  title: string;
  description: string;
  priority: "high" | "medium" | "low";
}

interface PredictionData {
  exam: string;
  targetRank: number;
  currentProbability: number;
  requiredProbability: number;
  improvement: number;
  subjectAnalysis: SubjectAnalysis[];
  recommendations: Recommendation[];
  stats: {
    totalQuestions: number;
    correctAnswers: number;
    overallAccuracy: number;
  };
}

const EXAMS = [
  { id: "jee-mains", name: "JEE Mains" },
  { id: "neet", name: "NEET" },
  { id: "clat", name: "CLAT" },
  { id: "cat", name: "CAT" },
  { id: "gate", name: "GATE" },
];

export default function PredictorPage() {
  const [selectedExam, setSelectedExam] = useState("jee-mains");
  const [targetRank, setTargetRank] = useState(5000);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyzePerformance = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/predictor/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: selectedExam,
          targetRank,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.requiresMoreData) {
          setError("You need to attempt at least 10 questions to get predictions. Start taking mock tests!");
        } else {
          setError(data.error || "Failed to analyze performance");
        }
        setPrediction(null);
        return;
      }

      if (data.success) {
        setPrediction(data.data);
      }
    } catch (err) {
      console.error("Error analyzing performance:", err);
      setError("Failed to analyze performance. Please try again.");
      setPrediction(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          <Sparkles className="h-10 w-10" />
          AI Performance Predictor
        </h1>
        <p className="mt-2 text-violet-100">
          Get realistic predictions and personalized recommendations based on your performance
        </p>
      </div>

      {/* Input Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          Configure Your Prediction
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Exam Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Select Exam
            </label>
            <select
              value={selectedExam}
              onChange={(e) => setSelectedExam(e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            >
              {EXAMS.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Target Rank Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Target Rank
            </label>
            <input
              type="number"
              value={targetRank}
              onChange={(e) => setTargetRank(parseInt(e.target.value) || 0)}
              min="1"
              max="100000"
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-violet-500 focus:border-transparent"
              placeholder="e.g., 5000"
            />
          </div>
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyzePerformance}
          disabled={loading || !targetRank}
          className="mt-6 w-full rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-white font-semibold hover:from-violet-700 hover:to-fuchsia-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Analyzing Your Performance...
            </>
          ) : (
            <>
              <Calculator className="h-5 w-5" />
              Analyze Performance
            </>
          )}
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 dark:text-red-100">
                Unable to Generate Prediction
              </h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1">{error}</p>
              {error.includes("10 questions") && (
                <a
                  href="/dashboard/mock-tests"
                  className="mt-3 inline-block rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700 transition-colors"
                >
                  Take Mock Tests
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Prediction Results */}
      {prediction && (
        <>
          {/* Success Probability */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Target className="h-6 w-6 text-violet-600" />
              Success Probability
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Based on {prediction.stats.totalQuestions} questions in {prediction.exam}
            </p>

            {/* Probability Meter */}
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Target Rank: {prediction.targetRank.toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Required: {prediction.requiredProbability}%
                </span>
              </div>
              
              <div className="relative h-12 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full flex items-center justify-end pr-4 transition-all duration-1000"
                  style={{ width: `${prediction.currentProbability}%` }}
                >
                  <span className="text-white font-bold text-lg">{prediction.currentProbability}%</span>
                </div>
              </div>

              {prediction.improvement > 0 ? (
                <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        You need {prediction.improvement}% improvement
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Follow the recommendations below to increase your chances of achieving your target rank.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                        Great! You're on track!
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Your current performance meets the requirements for your target rank. Keep it up!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Subject-wise Analysis */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Brain className="h-6 w-6 text-blue-600" />
              Subject-wise Strength Analysis
            </h2>
            <div className="mt-6 space-y-4">
              {prediction.subjectAnalysis.map((item, index) => (
                <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.subject}</h3>
                    <div className="flex items-center gap-2">
                      {item.status === "excellent" && (
                        <span className="flex items-center gap-1 text-sm text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Excellent
                        </span>
                      )}
                      {item.status === "good" && (
                        <span className="flex items-center gap-1 text-sm text-blue-600">
                          <CheckCircle className="h-4 w-4" />
                          Good
                        </span>
                      )}
                      {item.status === "needs improvement" && (
                        <span className="flex items-center gap-1 text-sm text-orange-600">
                          <AlertCircle className="h-4 w-4" />
                          Needs Work
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`absolute h-full rounded-full transition-all ${
                        item.status === "excellent"
                          ? "bg-gradient-to-r from-green-500 to-emerald-500"
                          : item.status === "good"
                          ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                          : "bg-gradient-to-r from-orange-500 to-red-500"
                      }`}
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="mt-2 text-right">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{item.score}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-green-600" />
              AI-Powered Recommendations
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Personalized action plan to improve your success probability
            </p>
            <div className="mt-6 space-y-4">
              {prediction.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-l-4 ${
                    rec.priority === "high"
                      ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                      : rec.priority === "medium"
                      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20"
                      : "border-green-500 bg-green-50 dark:bg-green-900/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">{rec.title}</h3>
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            rec.priority === "high"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                              : rec.priority === "medium"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                              : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                          }`}
                        >
                          {rec.priority} priority
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{rec.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20 p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Ready to Improve?</h3>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Start practicing with AI-generated mock tests tailored to your weak areas.
            </p>
            <a
              href="/dashboard/mock-tests"
              className="mt-4 inline-block rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-all"
            >
              Start Targeted Practice
            </a>
          </div>
        </>
      )}
    </div>
  );
}

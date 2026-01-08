"use client";

import { Sparkles, Target, TrendingUp, AlertCircle, CheckCircle, Brain } from "lucide-react";

export default function PredictorPage() {
  // Sample prediction data
  const prediction = {
    exam: "JEE Mains",
    targetRank: 5000,
    currentProbability: 68,
    requiredProbability: 85,
    improvement: 17,
  };

  const strengths = [
    { subject: "Mathematics", score: 92, status: "excellent" },
    { subject: "Physics", score: 78, status: "good" },
    { subject: "Chemistry", score: 65, status: "needs improvement" },
  ];

  const recommendations = [
    {
      title: "Focus on Organic Chemistry",
      description: "Your weakest area. Spend 2 hours daily on organic chemistry concepts.",
      priority: "high",
    },
    {
      title: "Practice More Numerical Problems",
      description: "Increase speed in solving numerical problems in Physics.",
      priority: "medium",
    },
    {
      title: "Maintain Mathematics Performance",
      description: "Continue current practice to maintain your strong performance.",
      priority: "low",
    },
  ];

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

      {/* Success Probability */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Target className="h-6 w-6 text-violet-600" />
          Success Probability
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Based on your current performance in {prediction.exam}
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
        </div>
      </div>

      {/* Subject-wise Analysis */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          Subject-wise Strength Analysis
        </h2>
        <div className="mt-6 space-y-4">
          {strengths.map((item, index) => (
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

      {/* Personalized Recommendations */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-green-600" />
          Personalized Recommendations
        </h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          AI-generated action plan to improve your success probability
        </p>
        <div className="mt-6 space-y-4">
          {recommendations.map((rec, index) => (
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
        <button className="mt-4 rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-6 py-3 text-white font-medium hover:from-violet-700 hover:to-fuchsia-700 transition-all">
          Start Targeted Practice
        </button>
      </div>
    </div>
  );
}

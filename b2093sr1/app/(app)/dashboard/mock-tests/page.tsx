"use client";

import { Brain, Clock, TrendingUp, Award } from "lucide-react";
import Link from "next/link";

export default function MockTestsPage() {
  const recentTests = [
    {
      id: "1",
      examName: "JEE Mains",
      difficulty: "Hard",
      score: 85,
      totalQuestions: 30,
      correctAnswers: 26,
      date: "2 days ago",
      timeSpent: "45 min",
    },
    {
      id: "2",
      examName: "NEET",
      difficulty: "Medium",
      score: 92,
      totalQuestions: 30,
      correctAnswers: 28,
      date: "5 days ago",
      timeSpent: "42 min",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">AI Mock Tests</h1>
        <p className="mt-2 text-purple-100">
          Practice with unlimited AI-generated questions tailored to your exam
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tests Taken</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">24</p>
            </div>
            <Brain className="h-8 w-8 text-purple-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg. Score</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">87%</p>
            </div>
            <TrendingUp className="h-8 w-8 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Time Spent</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">18h</p>
            </div>
            <Clock className="h-8 w-8 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Streak</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">7🔥</p>
            </div>
            <Award className="h-8 w-8 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Start New Test */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Start New Mock Test</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Choose an exam to begin your AI-powered practice session
        </p>
        <Link
          href="/dashboard/exams"
          className="mt-4 inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
        >
          Browse Exams
        </Link>
      </div>

      {/* Recent Tests */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Recent Tests</h2>
        <div className="mt-6 space-y-4">
          {recentTests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{test.examName}</h3>
                  <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-400">
                    {test.difficulty}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                  <span>{test.correctAnswers}/{test.totalQuestions} correct</span>
                  <span>•</span>
                  <span>{test.timeSpent}</span>
                  <span>•</span>
                  <span>{test.date}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-green-600">{test.score}%</div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

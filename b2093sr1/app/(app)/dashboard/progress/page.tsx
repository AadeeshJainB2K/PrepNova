"use client";

import { TrendingUp, Target, Award, Calendar, BookOpen, Brain } from "lucide-react";

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">My Progress</h1>
        <p className="mt-2 text-green-100">
          Track your performance and see how you're improving
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions Solved</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">1,247</p>
              <p className="mt-2 text-sm text-green-600">+23 this week</p>
            </div>
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">87%</p>
              <p className="mt-2 text-sm text-green-600">+5% improvement</p>
            </div>
            <Target className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">14🔥</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">days in a row</p>
            </div>
            <Calendar className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Exam-wise Progress */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-purple-600" />
          Exam-wise Performance
        </h2>
        <div className="mt-6 space-y-4">
          {[
            { exam: "JEE Mains", progress: 75, questions: 450, accuracy: 85 },
            { exam: "NEET", progress: 60, questions: 380, accuracy: 82 },
            { exam: "CLAT", progress: 45, questions: 220, accuracy: 88 },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{item.exam}</h3>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {item.questions} questions solved
                </span>
              </div>
              <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                <div
                  className="absolute h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all"
                  style={{ width: `${item.progress}%` }}
                />
              </div>
              <div className="mt-2 flex items-center justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-400">{item.progress}% complete</span>
                <span className="text-green-600 font-medium">{item.accuracy}% accuracy</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Subject-wise Strength */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-blue-600" />
          Subject-wise Analysis
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {[
            { subject: "Physics", strength: 85, color: "blue" },
            { subject: "Chemistry", strength: 78, color: "purple" },
            { subject: "Mathematics", strength: 92, color: "green" },
          ].map((item, index) => (
            <div key={index} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{item.subject}</h3>
              <div className="relative h-32 flex items-end">
                <div
                  className={`w-full bg-gradient-to-t from-${item.color}-500 to-${item.color}-400 rounded-t-lg transition-all`}
                  style={{ height: `${item.strength}%` }}
                />
              </div>
              <div className="mt-3 text-center">
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{item.strength}%</span>
                <p className="text-sm text-gray-600 dark:text-gray-400">Strength</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Award className="h-6 w-6 text-yellow-600" />
          Recent Achievements
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[
            { icon: "🏆", name: "100 Questions", desc: "Solved 100 questions" },
            { icon: "🔥", name: "7 Day Streak", desc: "Studied for 7 days" },
            { icon: "⭐", name: "Perfect Score", desc: "Got 100% in a test" },
            { icon: "🎯", name: "Accuracy Master", desc: "85%+ accuracy" },
          ].map((achievement, index) => (
            <div
              key={index}
              className="p-4 rounded-lg bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border border-yellow-200 dark:border-yellow-800"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{achievement.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{achievement.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Brain, Clock, Trophy, TrendingUp, Calendar, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface RecentSession {
  id: string;
  examId: string;
  examName: string;
  difficulty: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  timeSpent: number;
  startedAt: Date;
}

const EXAMS = [
  { id: "jee-mains", name: "JEE Mains", icon: "🎓", color: "from-blue-600 to-cyan-600" },
  { id: "neet", name: "NEET", icon: "⚕️", color: "from-green-600 to-emerald-600" },
  { id: "clat", name: "CLAT", icon: "⚖️", color: "from-purple-600 to-violet-600" },
  { id: "cat", name: "CAT", icon: "💼", color: "from-orange-600 to-amber-600" },
  { id: "gate", name: "GATE", icon: "🔧", color: "from-red-600 to-rose-600" },
  { id: "upsc-cse", name: "UPSC CSE", icon: "🏛️", color: "from-indigo-600 to-blue-600" },
];

export default function MockTestsPage() {
  const [recentSessions, setRecentSessions] = useState<RecentSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentSessions();
  }, []);

  const fetchRecentSessions = async () => {
    try {
      const response = await fetch("/api/mock-tests/recent");
      if (response.ok) {
        const data = await response.json();
        setRecentSessions(data.sessions || []);
      }
    } catch (error) {
      console.error("Failed to fetch recent sessions:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Mock Tests</h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Practice with AI-generated questions for your target exam
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Brain className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Tests</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {recentSessions.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <Trophy className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Avg Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {recentSessions.length > 0
                  ? Math.round(
                      recentSessions.reduce((sum, s) => sum + s.score, 0) / recentSessions.length
                    )
                  : 0}
                %
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Questions Solved</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {recentSessions.reduce((sum, s) => sum + s.totalQuestions, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Select Exam */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Select Exam</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {EXAMS.map((exam) => (
            <Link
              key={exam.id}
              href={`/dashboard/mock-tests/${exam.id}/mock`}
              className={`group relative overflow-hidden rounded-lg bg-gradient-to-br ${exam.color} p-6 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">{exam.icon}</div>
                <div>
                  <h3 className="text-xl font-bold">{exam.name}</h3>
                  <p className="text-sm text-white/80">Start Practice</p>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 opacity-10 text-8xl transform translate-x-4 translate-y-4">
                {exam.icon}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Tests */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Recent Tests</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading...</p>
          </div>
        ) : recentSessions.length === 0 ? (
          <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No tests yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Select an exam above to start your first mock test
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 hover:border-purple-300 dark:hover:border-purple-700 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {session.examName}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.difficulty === "Easy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : session.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Trophy className="h-4 w-4" />
                        <span>
                          {session.correctAnswers}/{session.totalQuestions} correct
                        </span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(session.timeSpent)}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(session.startedAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-3xl font-bold text-gray-900 dark:text-gray-100">
                        {Math.round(session.score)}%
                      </div>
                      <div className="text-xs text-gray-500">Score</div>
                    </div>
                    <Link
                      href={`/dashboard/mock-tests/${session.examId}/review/${session.id}`}
                      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, Brain, TrendingUp, Users, Calendar, Target, Loader2 } from "lucide-react";

interface DashboardStats {
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
  weeklyQuestions: number;
  studyStreak: number;
  examsRegistered: number;
  recentTests: {
    exam: string;
    score: number;
    date: string;
  }[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    // Get user name from the page (it's rendered server-side in layout)
    const nameElement = document.querySelector('[data-user-name]');
    if (nameElement) {
      setUserName(nameElement.getAttribute('data-user-name') || 'there');
    }
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch("/api/dashboard/stats");
      
      if (!response.ok) {
        console.error("API returned error status:", response.status);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("API returned non-JSON response");
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Welcome back{userName ? `, ${userName}` : ''}! 👋</h2>
        <p className="mt-2 text-blue-100">
          Ready to ace your exams? Let&apos;s continue your preparation journey!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exams Registered</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.examsRegistered || 0}
              </p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          {stats && stats.examsRegistered > 0 && (
            <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
              {stats.examsRegistered} {stats.examsRegistered === 1 ? 'exam' : 'exams'} in progress
            </p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions Solved</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.totalQuestions.toLocaleString() || 0}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          {stats && stats.weeklyQuestions > 0 && (
            <p className="mt-4 text-sm text-green-600">+{stats.weeklyQuestions} this week</p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.accuracy || 0}%
              </p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          {stats && stats.totalQuestions > 0 && (
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              {stats.correctAnswers}/{stats.totalQuestions} correct
            </p>
          )}
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">
                {stats?.studyStreak || 0}🔥
              </p>
            </div>
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {stats && stats.studyStreak > 0 ? "Keep it up!" : "Start your streak!"}
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/dashboard/exams" className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Browse Exams</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Explore all exams</div>
            </div>
          </Link>

          <Link href="/dashboard/mock-tests" className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <Brain className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Start Mock Test</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI-powered practice</div>
            </div>
          </Link>

          <Link href="/dashboard/progress" className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">View Progress</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Track performance</div>
            </div>
          </Link>

          <Link href="/dashboard/study-groups" className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-indigo-100 dark:bg-indigo-900/30 p-2">
              <Users className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Study Groups</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Connect with peers</div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Mock Tests */}
      {stats && stats.recentTests.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Mock Tests</h3>
          <div className="mt-4 space-y-3">
            {stats.recentTests.map((test, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">{test.exam}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{test.date}</div>
                </div>
                <div className="text-2xl font-bold text-green-600">{test.score}%</div>
              </div>
            ))}
          </div>
          <Link
            href="/dashboard/mock-tests"
            className="mt-4 inline-block text-sm text-purple-600 dark:text-purple-400 hover:underline"
          >
            View all mock tests →
          </Link>
        </div>
      )}

      {/* Empty State for New Users */}
      {stats && stats.totalQuestions === 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Start Your Journey!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Take your first mock test to see your progress and analytics here.
          </p>
          <Link
            href="/dashboard/mock-tests"
            className="inline-block rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 px-6 py-3 text-white font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
          >
            Start First Mock Test
          </Link>
        </div>
      )}
    </div>
  );
}

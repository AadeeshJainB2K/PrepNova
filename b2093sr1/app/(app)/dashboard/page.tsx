import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Brain, TrendingUp, Users, Calendar, Target } from "lucide-react";

export default async function DashboardPage() {
  const session = await auth();
  
  // Fetch user data including credits
  const userData = session?.user?.email
    ? await db.query.users.findFirst({
        where: eq(users.email, session.user.email),
      })
    : null;

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
        <h2 className="text-3xl font-bold">Welcome back, {session?.user?.name}! 👋</h2>
        <p className="mt-2 text-blue-100">
          Ready to ace your exams? Let's continue your preparation journey!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Exams Registered</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">3</p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">JEE, NEET, CLAT</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions Solved</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">1,247</p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Brain className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600">+23 this week</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">87%</p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-green-600">+5% improvement</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">14🔥</p>
            </div>
            <div className="rounded-full bg-orange-100 dark:bg-orange-900/30 p-3">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Keep it up!</p>
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

      {/* Upcoming Exam Dates */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="h-5 w-5 text-blue-600" />
          Upcoming Important Dates
        </h3>
        <div className="mt-4 space-y-3">
          {[
            { exam: "JEE Mains", event: "Registration Closes", date: "March 15, 2026", daysLeft: 45 },
            { exam: "NEET", event: "Admit Card Release", date: "April 1, 2026", daysLeft: 62 },
            { exam: "CLAT", event: "Exam Date", date: "May 10, 2026", daysLeft: 101 },
          ].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{item.exam} - {item.event}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{item.date}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold text-blue-600">{item.daysLeft} days</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">remaining</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Recent Mock Tests</h3>
        <div className="mt-4 space-y-3">
          {[
            { exam: "JEE Mains - Physics", score: 85, date: "2 days ago" },
            { exam: "NEET - Biology", score: 92, date: "5 days ago" },
            { exam: "JEE Mains - Mathematics", score: 78, date: "1 week ago" },
          ].map((test, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div>
                <div className="font-medium text-gray-900 dark:text-gray-100">{test.exam}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{test.date}</div>
              </div>
              <div className="text-2xl font-bold text-green-600">{test.score}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
          Your hackathon boilerplate is ready. Start building your next big idea!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Credits</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{userData?.credits || 0}</p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Available for AI features</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Files</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">0</p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Ready for RAG</p>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">AI Ready</p>
              <p className="mt-2 text-3xl font-bold text-green-600">✓</p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">pgvector enabled</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Actions</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-blue-100 dark:bg-blue-900/30 p-2">
              <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Upload Files</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Add documents for RAG</div>
            </div>
          </button>

          <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-purple-100 dark:bg-purple-900/30 p-2">
              <svg className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Start Chat</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">AI-powered conversations</div>
            </div>
          </button>

          <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-green-100 dark:bg-green-900/30 p-2">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Settings</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Configure your app</div>
            </div>
          </button>

          <button className="flex items-center gap-3 rounded-lg border border-gray-200 dark:border-gray-600 p-4 text-left transition-colors hover:bg-gray-50 dark:hover:bg-gray-700">
            <div className="rounded-lg bg-orange-100 dark:bg-orange-900/30 p-2">
              <svg className="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-gray-900 dark:text-gray-100">Documentation</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Learn more</div>
            </div>
          </button>
        </div>
      </div>

      {/* Tech Stack Info */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Your Tech Stack</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
            <div className="text-2xl">⚡</div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Next.js 15</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">App Router</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
            <div className="text-2xl">🔐</div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">NextAuth v5</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Authentication</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
            <div className="text-2xl">🗄️</div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">PostgreSQL</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">+ pgvector</div>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg bg-gray-50 dark:bg-gray-700 p-3">
            <div className="text-2xl">🤖</div>
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">AI Ready</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Vercel AI SDK</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

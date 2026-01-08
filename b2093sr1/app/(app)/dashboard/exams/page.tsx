"use client";

import { BookOpen, Users, TrendingUp, Calendar } from "lucide-react";
import Link from "next/link";

// Sample exam data - will be replaced with database data
const SAMPLE_EXAMS = [
  {
    id: "jee-mains",
    name: "JEE Mains",
    fullName: "Joint Entrance Examination - Main",
    category: "Engineering",
    difficulty: "Hard",
    totalSeats: 15000,
    estimatedApplicants: 1200000,
    description: "National level entrance exam for admission to NITs, IIITs, and other centrally funded technical institutions.",
    logoUrl: "🎓",
  },
  {
    id: "neet",
    name: "NEET",
    fullName: "National Eligibility cum Entrance Test",
    category: "Medical",
    difficulty: "Hard",
    totalSeats: 90000,
    estimatedApplicants: 1800000,
    description: "National level entrance exam for admission to MBBS and BDS courses in India.",
    logoUrl: "⚕️",
  },
  {
    id: "clat",
    name: "CLAT",
    fullName: "Common Law Admission Test",
    category: "Law",
    difficulty: "Medium",
    totalSeats: 2500,
    estimatedApplicants: 60000,
    description: "National level entrance exam for admission to undergraduate and postgraduate law programs.",
    logoUrl: "⚖️",
  },
  {
    id: "upsc-cse",
    name: "UPSC CSE",
    fullName: "Civil Services Examination",
    category: "Civil Services",
    difficulty: "Very Hard",
    totalSeats: 1000,
    estimatedApplicants: 1000000,
    description: "Premier examination for recruitment to various Civil Services of the Government of India.",
    logoUrl: "🏛️",
  },
  {
    id: "cat",
    name: "CAT",
    fullName: "Common Admission Test",
    category: "Management",
    difficulty: "Hard",
    totalSeats: 5000,
    estimatedApplicants: 250000,
    description: "National level entrance exam for admission to MBA programs at IIMs and other top B-schools.",
    logoUrl: "💼",
  },
  {
    id: "gate",
    name: "GATE",
    fullName: "Graduate Aptitude Test in Engineering",
    category: "Engineering",
    difficulty: "Hard",
    totalSeats: 50000,
    estimatedApplicants: 900000,
    description: "National level examination for admission to postgraduate programs in engineering and technology.",
    logoUrl: "🔧",
  },
];

export default function ExamsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Competitive Exams</h1>
        <p className="mt-2 text-blue-100">
          Choose your exam and start your preparation journey with AI-powered mock tests
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Exams</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">{SAMPLE_EXAMS.length}</p>
            </div>
            <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Users</p>
              <p className="mt-2 text-3xl font-bold text-gray-900 dark:text-gray-100">10K+</p>
            </div>
            <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Success Rate</p>
              <p className="mt-2 text-3xl font-bold text-green-600">78%</p>
            </div>
            <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Exams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {SAMPLE_EXAMS.map((exam) => (
          <Link
            key={exam.id}
            href={`/dashboard/exams/${exam.id}`}
            className="group rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm transition-all hover:shadow-lg hover:border-blue-500 dark:hover:border-blue-500"
          >
            {/* Exam Icon/Logo */}
            <div className="flex items-start justify-between">
              <div className="text-5xl">{exam.logoUrl}</div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${
                  exam.difficulty === "Very Hard"
                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    : exam.difficulty === "Hard"
                    ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                    : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                }`}
              >
                {exam.difficulty}
              </span>
            </div>

            {/* Exam Details */}
            <div className="mt-4">
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                {exam.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{exam.fullName}</p>
              <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {exam.description}
              </p>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total Seats</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {exam.totalSeats.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Applicants</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {(exam.estimatedApplicants / 1000).toFixed(0)}K
                </p>
              </div>
            </div>

            {/* Category Badge */}
            <div className="mt-4">
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-400">
                <Calendar className="h-3 w-3" />
                {exam.category}
              </span>
            </div>
          </Link>
        ))}
      </div>

      {/* Call to Action */}
      <div className="rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Don&apos;t see your exam?
        </h3>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We&apos;re constantly adding new exams. Contact us to request a specific exam to be added to the platform.
        </p>
        <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors">
          Request Exam
        </button>
      </div>
    </div>
  );
}

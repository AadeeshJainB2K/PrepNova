"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, Users, TrendingUp, BookOpen, Brain, Sparkles, Clock } from "lucide-react";

// Sample exam data - will be replaced with database queries
const EXAM_DATA: Record<string, any> = {
  "jee-mains": {
    id: "jee-mains",
    name: "JEE Mains",
    fullName: "Joint Entrance Examination - Main",
    category: "Engineering",
    difficulty: "Hard",
    totalSeats: 15000,
    estimatedApplicants: 1200000,
    description: "JEE Main is a national level entrance exam conducted for admission to undergraduate engineering programs at NITs, IIITs, and other centrally funded technical institutions.",
    logoUrl: "🎓",
    eligibility: {
      age: "No age limit",
      qualification: "10+2 with Physics, Chemistry, and Mathematics",
      percentage: "75% in 12th (65% for SC/ST)",
    },
    examPattern: {
      mode: "Computer Based Test (CBT)",
      duration: "3 hours",
      sections: ["Physics", "Chemistry", "Mathematics"],
      totalQuestions: 90,
      totalMarks: 300,
      marking: "+4 for correct, -1 for incorrect",
    },
    syllabus: [
      {
        subject: "Physics",
        topics: ["Mechanics", "Thermodynamics", "Electromagnetism", "Optics", "Modern Physics"],
      },
      {
        subject: "Chemistry",
        topics: ["Physical Chemistry", "Organic Chemistry", "Inorganic Chemistry"],
      },
      {
        subject: "Mathematics",
        topics: ["Algebra", "Calculus", "Coordinate Geometry", "Trigonometry", "Statistics"],
      },
    ],
    timeline: [
      {
        event: "Registration Opens",
        date: "February 2026",
        status: "upcoming",
      },
      {
        event: "Registration Closes",
        date: "March 2026",
        status: "upcoming",
      },
      {
        event: "Admit Card Release",
        date: "March 2026",
        status: "upcoming",
      },
      {
        event: "Exam Date",
        date: "April 2026",
        status: "upcoming",
      },
      {
        event: "Result Declaration",
        date: "May 2026",
        status: "upcoming",
      },
    ],
    careerPaths: [
      "IITs - Indian Institutes of Technology",
      "NITs - National Institutes of Technology",
      "IIITs - Indian Institutes of Information Technology",
      "GFTIs - Government Funded Technical Institutes",
      "Top Private Engineering Colleges",
    ],
  },
};

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params);
  const exam = EXAM_DATA[examId];

  if (!exam) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Not Found</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-400">The exam you're looking for doesn't exist.</p>
          <Link
            href="/dashboard/exams"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Exams
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/dashboard/exams"
        className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Exams
      </Link>

      {/* Exam Header */}
      <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white shadow-lg">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-6xl mb-4">{exam.logoUrl}</div>
            <h1 className="text-4xl font-bold">{exam.name}</h1>
            <p className="mt-2 text-xl text-blue-100">{exam.fullName}</p>
            <p className="mt-4 text-blue-100 max-w-3xl">{exam.description}</p>
          </div>
          <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
            {exam.difficulty}
          </span>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-3 gap-6">
          <div className="rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-sm">Total Seats</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{exam.totalSeats.toLocaleString()}</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm">Applicants</span>
            </div>
            <p className="mt-2 text-2xl font-bold">{(exam.estimatedApplicants / 1000).toFixed(0)}K</p>
          </div>
          <div className="rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm">Competition</span>
            </div>
            <p className="mt-2 text-2xl font-bold">1:{Math.round(exam.estimatedApplicants / exam.totalSeats)}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link
          href={`/dashboard/exams/${examId}/mock`}
          className="group rounded-lg border-2 border-blue-200 dark:border-blue-800 bg-white dark:bg-gray-800 p-6 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-lg transition-all"
        >
          <Brain className="h-8 w-8 text-blue-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Start Mock Test</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Practice with AI-generated questions
          </p>
        </Link>

        <Link
          href={`/dashboard/progress?exam=${examId}`}
          className="group rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-white dark:bg-gray-800 p-6 hover:border-purple-500 dark:hover:border-purple-500 hover:shadow-lg transition-all"
        >
          <TrendingUp className="h-8 w-8 text-purple-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">View Progress</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your performance and analytics
          </p>
        </Link>

        <Link
          href={`/dashboard/study-groups?exam=${examId}`}
          className="group rounded-lg border-2 border-green-200 dark:border-green-800 bg-white dark:bg-gray-800 p-6 hover:border-green-500 dark:hover:border-green-500 hover:shadow-lg transition-all"
        >
          <Users className="h-8 w-8 text-green-600 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Join Study Group</h3>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Connect with fellow aspirants
          </p>
        </Link>
      </div>

      {/* Timeline */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Calendar className="h-6 w-6 text-blue-600" />
          Important Dates
        </h2>
        <div className="mt-6 space-y-4">
          {exam.timeline.map((event: any, index: number) => (
            <div key={index} className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100">{event.event}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{event.date}</p>
              </div>
              <span className="rounded-full bg-yellow-100 dark:bg-yellow-900/30 px-3 py-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
                {event.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Syllabus */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen className="h-6 w-6 text-purple-600" />
          Syllabus
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {exam.syllabus.map((subject: any, index: number) => (
            <div key={index} className="rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">
                {subject.subject}
              </h3>
              <ul className="space-y-2">
                {subject.topics.map((topic: string, topicIndex: number) => (
                  <li key={topicIndex} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <span className="text-blue-600 mt-1">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Exam Pattern */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Exam Pattern</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Mode:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.examPattern.mode}</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Duration:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.examPattern.duration}</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Questions:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.examPattern.totalQuestions}</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Marks:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.examPattern.totalMarks}</span>
          </div>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 md:col-span-2">
            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Marking Scheme:</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{exam.examPattern.marking}</span>
          </div>
        </div>
      </div>

      {/* Career Paths */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Career Opportunities</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Clearing this exam opens doors to:
        </p>
        <ul className="mt-4 space-y-3">
          {exam.careerPaths.map((path: string, index: number) => (
            <li key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
              <span className="text-green-600 text-xl">✓</span>
              <span className="text-gray-900 dark:text-gray-100">{path}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

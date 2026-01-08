"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { TrendingUp, Target, Calendar, BookOpen, Brain, Loader2, ChevronDown, ChevronUp } from "lucide-react";

interface OverviewStats {
  totalQuestions: number;
  totalCorrect: number;
  accuracy: number;
  weeklyQuestions: number;
  studyStreak: number;
}

interface ExamStats {
  examId: string;
  examName: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

interface TopicStats {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  accuracy: number;
}

interface SubjectStats {
  subject: string;
  topics: TopicStats[];
  overallAccuracy: number;
  totalQuestions: number;
}

export default function ProgressPage() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [examStats, setExamStats] = useState<ExamStats[]>([]);
  const [subjectStats, setSubjectStats] = useState<SubjectStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [overviewRes, examRes, subjectRes] = await Promise.all([
        fetch("/api/progress/overview"),
        fetch("/api/progress/by-exam"),
        fetch("/api/progress/by-subject"),
      ]);

      const [overviewData, examData, subjectData] = await Promise.all([
        overviewRes.json(),
        examRes.json(),
        subjectRes.json(),
      ]);

      if (overviewData.success) setOverview(overviewData.data);
      if (examData.success) setExamStats(examData.data);
      if (subjectData.success) setSubjectStats(subjectData.data);
    } catch (error) {
      console.error("Error fetching progress data:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    const newExpanded = new Set(expandedSubjects);
    if (newExpanded.has(subject)) {
      newExpanded.delete(subject);
    } else {
      newExpanded.add(subject);
    }
    setExpandedSubjects(newExpanded);
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 85) return "text-green-600 dark:text-green-400";
    if (accuracy >= 70) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getAccuracyBg = (accuracy: number) => {
    if (accuracy >= 85) return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800";
    if (accuracy >= 70) return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800";
    return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800";
  };

  const getAccuracyIndicator = (accuracy: number) => {
    if (accuracy >= 85) return "✅";
    if (accuracy >= 70) return "⚠️";
    return "❌";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your progress...</p>
        </div>
      </div>
    );
  }

  if (!overview || overview.totalQuestions === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold">My Progress</h1>
          <p className="mt-2 text-green-100">
            Track your performance and see how you&apos;re improving
          </p>
        </div>
        
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-12 text-center">
          <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No Progress Data Yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Start taking mock tests to see your progress and analytics here!
          </p>
          <Link
            href="/dashboard/mock-tests"
            className="inline-block rounded-lg bg-purple-600 px-6 py-3 text-white hover:bg-purple-700 transition-colors"
          >
            Take Your First Mock Test
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-green-600 to-teal-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">My Progress</h1>
        <p className="mt-2 text-green-100">
          Track your performance and see how you&apos;re improving
        </p>
      </div>

      {/* Overall Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Questions Solved</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">{overview.totalQuestions}</p>
              <p className="mt-2 text-sm text-green-600">+{overview.weeklyQuestions} this week</p>
            </div>
            <Brain className="h-12 w-12 text-blue-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Accuracy</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">{overview.accuracy}%</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                {overview.totalCorrect}/{overview.totalQuestions} correct
              </p>
            </div>
            <Target className="h-12 w-12 text-green-600" />
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Study Streak</p>
              <p className="mt-2 text-4xl font-bold text-gray-900 dark:text-gray-100">{overview.studyStreak}🔥</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">days in a row</p>
            </div>
            <Calendar className="h-12 w-12 text-orange-600" />
          </div>
        </div>
      </div>

      {/* Exam-wise Progress */}
      {examStats.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <BookOpen className="h-6 w-6 text-purple-600" />
            Exam-wise Performance
          </h2>
          <div className="mt-6 space-y-4">
            {examStats.map((exam) => (
              <div key={exam.examId} className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900 dark:text-gray-100">{exam.examName}</h3>
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {exam.totalQuestions} questions solved
                  </span>
                </div>
                <div className="relative h-3 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="absolute h-full bg-gradient-to-r from-green-500 to-teal-500 rounded-full transition-all"
                    style={{ width: `${exam.accuracy}%` }}
                  />
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">
                    {exam.correctAnswers}/{exam.totalQuestions} correct
                  </span>
                  <span className={`font-medium ${getAccuracyColor(exam.accuracy)}`}>
                    {exam.accuracy}% accuracy
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Subject-wise Analysis with Topic Breakdown */}
      {subjectStats.length > 0 && (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-blue-600" />
            Subject & Topic-wise Analysis
          </h2>
          <div className="mt-6 space-y-4">
            {subjectStats.map((subject) => (
              <div key={subject.subject} className="rounded-lg border border-gray-200 dark:border-gray-700">
                {/* Subject Header */}
                <button
                  onClick={() => toggleSubject(subject.subject)}
                  className="w-full p-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{getAccuracyIndicator(subject.overallAccuracy)}</span>
                    <div className="text-left">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{subject.subject}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {subject.totalQuestions} questions • {subject.topics.length} topics
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-2xl font-bold ${getAccuracyColor(subject.overallAccuracy)}`}>
                      {subject.overallAccuracy}%
                    </span>
                    {expandedSubjects.has(subject.subject) ? (
                      <ChevronUp className="h-5 w-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </button>

                {/* Topic Breakdown */}
                {expandedSubjects.has(subject.subject) && (
                  <div className="px-4 pb-4 space-y-2">
                    {subject.topics.map((topic) => (
                      <div
                        key={topic.topic}
                        className={`p-3 rounded-lg border ${getAccuracyBg(topic.accuracy)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{getAccuracyIndicator(topic.accuracy)}</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">
                              {topic.topic}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className={`text-lg font-bold ${getAccuracyColor(topic.accuracy)}`}>
                              {topic.accuracy}%
                            </span>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {topic.correctAnswers}/{topic.totalQuestions}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">Performance Indicators</h3>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span>✅</span>
            <span className="text-gray-600 dark:text-gray-400">Strong (&gt;85%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span className="text-gray-600 dark:text-gray-400">Moderate (70-85%)</span>
          </div>
          <div className="flex items-center gap-2">
            <span>❌</span>
            <span className="text-gray-600 dark:text-gray-400">Needs Practice (&lt;70%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Users, Plus, Search, MessageSquare, TrendingUp } from "lucide-react";

export default function StudyGroupsPage() {
  const myGroups = [
    {
      id: "1",
      name: "JEE 2026 Warriors",
      exam: "JEE Mains",
      members: 8,
      maxMembers: 10,
      activity: "Active",
    },
    {
      id: "2",
      name: "NEET Aspirants",
      exam: "NEET",
      members: 6,
      maxMembers: 10,
      activity: "Active",
    },
  ];

  const suggestedGroups = [
    {
      id: "3",
      name: "Physics Masters",
      exam: "JEE Mains",
      members: 5,
      maxMembers: 10,
      activity: "Very Active",
    },
    {
      id: "4",
      name: "Chemistry Champions",
      exam: "JEE Mains",
      members: 7,
      maxMembers: 10,
      activity: "Active",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 p-8 text-white shadow-lg">
        <h1 className="text-4xl font-bold">Study Groups</h1>
        <p className="mt-2 text-indigo-100">
          Connect with fellow aspirants and study together
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <button className="flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-white font-medium hover:bg-indigo-700 transition-colors">
          <Plus className="h-5 w-5" />
          Create Group
        </button>
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search groups..."
            className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* My Groups */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-600" />
          My Groups
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {myGroups.map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-lg border-2 border-indigo-200 dark:border-indigo-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{group.exam}</p>
                </div>
                <span className="rounded-full bg-green-100 dark:bg-green-900/30 px-3 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                  {group.activity}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{group.members}/{group.maxMembers} members</span>
                </div>
                <button className="flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium">
                  <MessageSquare className="h-4 w-4" />
                  Open Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggested Groups */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Suggested for You</h2>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Based on your exam preferences and performance
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {suggestedGroups.map((group) => (
            <div
              key={group.id}
              className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.name}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{group.exam}</p>
                </div>
                <span className="rounded-full bg-purple-100 dark:bg-purple-900/30 px-3 py-1 text-xs font-medium text-purple-700 dark:text-purple-400">
                  {group.activity}
                </span>
              </div>
              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="h-4 w-4" />
                  <span>{group.members}/{group.maxMembers} members</span>
                </div>
                <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white font-medium hover:bg-purple-700 transition-colors">
                  Join Group
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Benefits */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">Why Join Study Groups?</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Collaborative Learning</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Discuss concepts and solve doubts together
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Stay Motivated</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Keep each other accountable and motivated
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
              <Users className="h-5 w-5 text-pink-600" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">Peer Support</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Learn from others' experiences and strategies
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

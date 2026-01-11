"use client";

import { useState } from "react";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
}

export function DateTaskManager(): React.JSX.Element {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // New task form state
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const firstDayOfWeek = monthStart.getDay();

  // Get tasks for selected date
  const selectedDateTasks = tasks.filter(task => isSameDay(task.date, selectedDate));

  // Get task count per day for calendar
  const getTaskCount = (date: Date): number => {
    return tasks.filter(task => isSameDay(task.date, date)).length;
  };

  const handleAddTask = (): void => {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      date: selectedDate,
      completed: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
    setNewTaskDescription("");
  };

  const handleDeleteTask = (taskId: string): void => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleComplete = (taskId: string): void => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
  };

  const handleStartEdit = (task: Task): void => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const handleSaveEdit = (): void => {
    if (!editTitle.trim() || !editingTaskId) return;

    setTasks(tasks.map(t => t.id === editingTaskId
      ? { ...t, title: editTitle.trim(), description: editDescription.trim() }
      : t
    ));
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const handleCancelEdit = (): void => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Task Scheduler
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Select a date to manage your tasks
          </p>
        </div>

        {/* Timeline View - Tasks by Date */}
        <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-6 shadow-xl">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">Task Timeline</h2>
          
          {tasks.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <p>No tasks yet. Select a date below to add your first task.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {tasks
                .sort((a, b) => a.date.getTime() - b.date.getTime())
                .map(task => (
                  <div
                    key={task.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      task.completed
                        ? "bg-gray-50/50 dark:bg-gray-800/30 border-gray-200 dark:border-gray-700"
                        : "bg-white dark:bg-gray-800 border-blue-200 dark:border-blue-800"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1">
                        <button
                          onClick={() => handleToggleComplete(task.id)}
                          className={cn(
                            "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                            task.completed
                              ? "bg-blue-500 border-blue-500 text-white"
                              : "border-gray-300 dark:border-gray-600 hover:border-blue-400"
                          )}
                        >
                          {task.completed && <Check className="h-3 w-3" strokeWidth={3} />}
                        </button>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={cn(
                              "font-semibold",
                              task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"
                            )}>
                              {task.title}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {format(task.date, 'MMM dd, yyyy')}
                            </span>
                          </div>
                          {task.description && (
                            <p className={cn(
                              "text-sm mt-1",
                              task.completed ? "text-gray-400" : "text-gray-600 dark:text-gray-300"
                            )}>
                              {task.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Calendar & Task Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Calendar */}
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                className="p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
              
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {format(currentMonth, 'MMMM yyyy')}
              </h2>
              
              <button
                onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                className="p-2 hover:bg-white/50 dark:hover:bg-white/5 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              
              {daysInMonth.map(date => {
                const taskCount = getTaskCount(date);
                const isSelected = isSameDay(date, selectedDate);
                const isCurrentDay = isToday(date);
                
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date)}
                    className={cn(
                      "relative aspect-square rounded-lg p-2 text-sm font-medium transition-all",
                      isSelected
                        ? "bg-blue-500 text-white shadow-lg scale-105"
                        : isCurrentDay
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "hover:bg-white/60 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300"
                    )}
                  >
                    {format(date, 'd')}
                    {taskCount > 0 && (
                      <span className={cn(
                        "absolute top-1 right-1 w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold",
                        isSelected ? "bg-white/30 text-white" : "bg-blue-500 text-white"
                      )}>
                        {taskCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Task List & Form for Selected Date */}
          <div className="rounded-3xl border border-white/20 dark:border-white/10 bg-white/40 dark:bg-white/5 backdrop-blur-xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
              {format(selectedDate, 'MMMM d, yyyy')}
            </h2>

            {/* Existing Tasks */}
            <div className="space-y-3 mb-6">
              {selectedDateTasks.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No tasks for this date</p>
              ) : (
                selectedDateTasks.map(task => (
                  <div key={task.id} className="p-3 bg-white/60 dark:bg-white/5 rounded-lg border border-gray-200 dark:border-gray-700">
                    {editingTaskId === task.id ? (
                      <div className="space-y-2">
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Task title"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={2}
                          placeholder="Description (optional)"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={handleSaveEdit}
                            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="px-3 py-1 text-sm bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={cn(
                            "font-semibold text-sm",
                            task.completed ? "line-through text-gray-400" : "text-gray-900 dark:text-gray-100"
                          )}>
                            {task.title}
                          </p>
                          {task.description && (
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStartEdit(task)}
                            className="p-1 hover:bg-white/50 dark:hover:bg-white/10 rounded"
                          >
                            <Edit2 className="w-4 h-4 text-gray-500" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Task Form */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">Add New Task</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Task title..."
                />
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={2}
                  placeholder="Description (optional)..."
                />
                <button
                  onClick={handleAddTask}
                  disabled={!newTaskTitle.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

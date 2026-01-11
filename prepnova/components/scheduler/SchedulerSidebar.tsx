"use client";

import { useState, useEffect, useCallback } from "react";
import { DailySchedule } from "./DailySchedule";
import { ExamTimeline } from "./ExamTimeline";
import { ScheduleIntelligence, CalendarView } from "./ScheduleIntelligence";

export interface Task {
  id: string;
  title: string;
  description: string;
  date: Date;
  completed: boolean;
  priority: string;
  priorityColor: string;
  duration?: string;
  createdAt: Date;
}

interface DBTask {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  date: string;
  completed: boolean;
  priority: string;
  priorityColor: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * SchedulerSidebar component - Main container with shared state and database persistence
 */
export function SchedulerSidebar(): React.JSX.Element {
  const [tasks, setTasksState] = useState<Task[]>([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(true);

  // Fetch tasks from database on mount
  useEffect(() => {
    const fetchTasks = async (): Promise<void> => {
      try {
        const response = await fetch("/api/scheduler/tasks");
        if (response.ok) {
          const dbTasks: DBTask[] = await response.json();
          const mappedTasks: Task[] = dbTasks.map((t) => ({
            id: t.id,
            title: t.title,
            description: t.description || "",
            date: new Date(t.date),
            completed: t.completed,
            priority: t.priority,
            priorityColor: t.priorityColor || "",
            createdAt: new Date(t.createdAt),
          }));
          setTasksState(mappedTasks);
        }
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, []);

  // Custom setTasks that syncs with database
  const setTasks = useCallback(async (newTasksOrUpdater: Task[] | ((prev: Task[]) => Task[])) => {
    const newTasks = typeof newTasksOrUpdater === "function" 
      ? newTasksOrUpdater(tasks) 
      : newTasksOrUpdater;

    // Find what changed
    const currentIds = new Set(tasks.map(t => t.id));
    const newIds = new Set(newTasks.map(t => t.id));

    // Added tasks
    const addedTasks = newTasks.filter(t => !currentIds.has(t.id));
    
    // Deleted tasks
    const deletedTasks = tasks.filter(t => !newIds.has(t.id));
    
    // Updated tasks
    const updatedTasks = newTasks.filter(t => {
      if (!currentIds.has(t.id)) return false;
      const oldTask = tasks.find(old => old.id === t.id);
      if (!oldTask) return false;
      return (
        oldTask.title !== t.title ||
        oldTask.description !== t.description ||
        oldTask.completed !== t.completed ||
        oldTask.priority !== t.priority ||
        oldTask.date.getTime() !== t.date.getTime()
      );
    });

    // Update local state immediately for responsiveness
    setTasksState(newTasks);

    // Sync with database
    try {
      // Handle added tasks
      for (const task of addedTasks) {
        await fetch("/api/scheduler/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            date: task.date.toISOString(),
            priority: task.priority,
            priorityColor: task.priorityColor,
          }),
        });
      }

      // Handle deleted tasks
      for (const task of deletedTasks) {
        await fetch(`/api/scheduler/tasks/${task.id}`, {
          method: "DELETE",
        });
      }

      // Handle updated tasks
      for (const task of updatedTasks) {
        await fetch(`/api/scheduler/tasks/${task.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: task.title,
            description: task.description,
            date: task.date.toISOString(),
            completed: task.completed,
            priority: task.priority,
            priorityColor: task.priorityColor,
          }),
        });
      }
    } catch (error) {
      console.error("Failed to sync tasks with database:", error);
    }
  }, [tasks]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading scheduler...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Smart Scheduler
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Plan, track, and achieve your goals
          </p>
        </div>
      </div>

      {/* Top - Timeline */}
      <div>
        <ExamTimeline 
          tasks={tasks}
          setTasks={setTasks}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Middle Row - Daily Schedule and Intelligence */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-[550px]">
          <DailySchedule 
            tasks={tasks}
            setTasks={setTasks}
            selectedDate={selectedDate}
          />
        </div>
        <div className="space-y-6">
          <ScheduleIntelligence tasks={tasks} />
          <CalendarView 
            tasks={tasks}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}

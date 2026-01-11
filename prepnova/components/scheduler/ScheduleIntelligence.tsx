"use client";

import { motion } from "framer-motion";
import { Calendar, TrendingUp, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek, startOfYear, endOfYear, startOfDay, endOfDay } from "date-fns";
import { useState } from "react";
import type { Task } from "./SchedulerSidebar";

interface CalendarViewProps {
  tasks: Task[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

interface ScheduleIntelligenceProps {
  tasks: Task[];
}

interface LoadStats {
  total: number;
  completed: number;
  percentage: number;
}

function getLoadStatus(percentage: number): { status: string; color: string; barColor: string; filledBars: number } {
  if (percentage >= 80) {
    return {
      status: "EXCELLENT",
      color: "bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-emerald-200/50 dark:border-emerald-800/30",
      barColor: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]",
      filledBars: 5
    };
  } else if (percentage >= 60) {
    return {
      status: "HEALTHY",
      color: "bg-green-100/50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border-green-200/50 dark:border-green-800/30",
      barColor: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]",
      filledBars: 4
    };
  } else if (percentage >= 40) {
    return {
      status: "MODERATE",
      color: "bg-amber-100/50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-amber-200/50 dark:border-amber-800/30",
      barColor: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]",
      filledBars: 3
    };
  } else if (percentage >= 20) {
    return {
      status: "BEHIND",
      color: "bg-orange-100/50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200/50 dark:border-orange-800/30",
      barColor: "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.4)]",
      filledBars: 2
    };
  } else if (percentage > 0) {
    return {
      status: "CRITICAL",
      color: "bg-red-100/50 text-red-700 dark:bg-red-900/20 dark:text-red-400 border-red-200/50 dark:border-red-800/30",
      barColor: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]",
      filledBars: 1
    };
  } else {
    return {
      status: "NO TASKS",
      color: "bg-blue-100/50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400 border-blue-200/50 dark:border-blue-800/30",
      barColor: "bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.4)]",
      filledBars: 0
    };
  }
}

export function ScheduleIntelligence({ tasks }: ScheduleIntelligenceProps): React.JSX.Element {
    const today = new Date();
    
    // Calculate stats for different time periods
    const calculateStats = (start: Date, end: Date): LoadStats => {
        const periodTasks = tasks.filter(task => {
            const taskDate = new Date(task.date);
            return taskDate >= start && taskDate <= end;
        });
        const total = periodTasks.length;
        const completed = periodTasks.filter(t => t.completed).length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
        return { total, completed, percentage };
    };

    // Today's stats
    const dayStats = calculateStats(startOfDay(today), endOfDay(today));
    
    // This week's stats
    const weekStats = calculateStats(startOfWeek(today), endOfWeek(today));
    
    // This month's stats
    const monthStats = calculateStats(startOfMonth(today), endOfMonth(today));
    
    // This year's stats
    const yearStats = calculateStats(startOfYear(today), endOfYear(today));

    const [selectedPeriod, setSelectedPeriod] = useState<'day' | 'week' | 'month' | 'year'>('week');
    
    const periods = [
        { key: 'day' as const, label: 'Today', stats: dayStats },
        { key: 'week' as const, label: 'Week', stats: weekStats },
        { key: 'month' as const, label: 'Month', stats: monthStats },
        { key: 'year' as const, label: 'Year', stats: yearStats },
    ];

    const currentStats = periods.find(p => p.key === selectedPeriod)?.stats || weekStats;
    const currentStatus = getLoadStatus(currentStats.percentage);

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
        >
            {/* Schedule Load Indicator */}
            <div className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-gray-900/40 backdrop-blur-3xl p-5 shadow-2xl shadow-blue-500/5 dark:shadow-black/20">
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Schedule Load
                    </h3>
                    <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold tracking-wide border",
                        currentStatus.color
                    )}>
                        {currentStatus.status}
                    </span>
                </div>

                {/* Period Selector */}
                <div className="flex gap-1 mb-4 p-1 bg-gray-100/50 dark:bg-gray-800/50 rounded-xl">
                    {periods.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setSelectedPeriod(key)}
                            className={cn(
                                "flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all",
                                selectedPeriod === key
                                    ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                                    : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Progress Bar */}
                <div className="flex items-center gap-1.5 mb-2">
                    {[1, 2, 3, 4, 5].map((bar) => (
                        <div key={bar} className={cn(
                            "h-2 flex-1 rounded-full transition-all duration-500",
                            bar <= currentStatus.filledBars ? currentStatus.barColor : "bg-gray-100 dark:bg-gray-800"
                        )} />
                    ))}
                </div>

                {/* Stats Display */}
                <div className="flex items-center justify-between text-[11px]">
                    <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        {currentStats.completed}/{currentStats.total} completed
                    </span>
                    <span className={cn(
                        "font-bold",
                        currentStats.percentage >= 60 ? "text-emerald-600 dark:text-emerald-400" :
                        currentStats.percentage >= 40 ? "text-amber-600 dark:text-amber-400" :
                        "text-red-600 dark:text-red-400"
                    )}>
                        {currentStats.percentage}%
                    </span>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-2">
                {periods.map(({ key, label, stats }) => {
                    const status = getLoadStatus(stats.percentage);
                    return (
                        <button
                            key={key}
                            onClick={() => setSelectedPeriod(key)}
                            className={cn(
                                "p-3 rounded-2xl border transition-all text-left",
                                selectedPeriod === key
                                    ? "border-blue-300 dark:border-blue-700 bg-blue-50/50 dark:bg-blue-900/20"
                                    : "border-white/40 dark:border-white/10 bg-white/30 dark:bg-gray-900/20 hover:bg-white/50"
                            )}
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{label}</span>
                                <span className={cn(
                                    "text-[9px] font-bold px-1.5 py-0.5 rounded",
                                    status.color
                                )}>
                                    {stats.percentage}%
                                </span>
                            </div>
                            <div className="text-sm font-bold text-gray-800 dark:text-gray-200">
                                {stats.completed}/{stats.total}
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}

export function CalendarView({ tasks, selectedDate, onDateSelect }: CalendarViewProps): React.JSX.Element {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });
    const firstDayOfWeek = monthStart.getDay();
    
    // Get task count per day
    const getTaskCount = (date: Date): number => {
        return tasks.filter(task => isSameDay(task.date, date)).length;
    };

    const getCompletedCount = (date: Date): number => {
        return tasks.filter(task => isSameDay(task.date, date) && task.completed).length;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-gray-900/40 backdrop-blur-3xl p-6 shadow-2xl shadow-blue-500/5 dark:shadow-black/20"
        >
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    {format(currentMonth, 'MMMM yyyy')}
                </h3>
                <div className="flex gap-2">
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="text-xs px-2 py-1 hover:bg-white/30 dark:hover:bg-white/10 rounded transition-colors"
                    >
                        ←
                    </button>
                    <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="text-xs px-2 py-1 hover:bg-white/30 dark:hover:bg-white/10 rounded transition-colors"
                    >
                        →
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-center text-[10px] font-bold text-gray-400 uppercase">{d}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                
                {daysInMonth.map(date => {
                    const taskCount = getTaskCount(date);
                    const completedCount = getCompletedCount(date);
                    const isSelected = isSameDay(date, selectedDate);
                    const isCurrentDay = isToday(date);
                    
                    return (
                        <button
                            key={date.toISOString()}
                            onClick={() => onDateSelect(date)}
                            className={cn(
                                "relative aspect-square rounded-full flex items-center justify-center text-xs font-medium relative transition-all",
                                isSelected
                                    ? "bg-blue-500 text-white scale-110 shadow-lg"
                                    : isCurrentDay
                                    ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 ring-2 ring-blue-500"
                                    : taskCount > 0
                                    ? "bg-white/60 dark:bg-white/10 text-gray-800 dark:text-gray-300 hover:scale-105"
                                    : "text-gray-400 dark:text-gray-600 hover:bg-white/30 dark:hover:bg-white/5"
                            )}
                        >
                            {format(date, 'd')}

                            {/* Task indicator */}
                            {taskCount > 0 && (
                                <div className="absolute -bottom-1 flex gap-0.5">
                                    {completedCount === taskCount ? (
                                        <div className="w-1 h-1 rounded-full bg-green-500" />
                                    ) : completedCount > 0 ? (
                                        <div className="w-1 h-1 rounded-full bg-amber-500" />
                                    ) : (
                                        <div className="w-1 h-1 rounded-full bg-blue-500" />
                                    )}
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 flex items-center justify-center gap-6 text-[9px] font-medium text-gray-400 uppercase tracking-wider">
                <div className="flex items-center gap-1.5 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Complete
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> In Progress
                </div>
                <div className="flex items-center gap-1.5 opacity-60">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Pending
                </div>
            </div>
        </motion.div>
    );
}

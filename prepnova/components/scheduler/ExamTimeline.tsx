"use client";

import { motion } from "framer-motion";
import { Calendar, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Task } from "./SchedulerSidebar";

interface ExamTimelineProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedDate?: Date;
  setSelectedDate: (date: Date) => void;
}

export function ExamTimeline({ tasks, setTasks, setSelectedDate }: ExamTimelineProps): React.JSX.Element {
    // Group tasks by date
    const tasksByDate = tasks.reduce((acc, task) => {
        const dateKey = format(task.date, 'yyyy-MM-dd');
        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: task.date,
                tasks: []
            };
        }
        acc[dateKey].tasks.push(task);
        return acc;
    }, {} as Record<string, { date: Date; tasks: Task[] }>);

    const events = Object.values(tasksByDate).sort((a, b) => a.date.getTime() - b.date.getTime());

    const getDynamicDate = (date: Date): string => {
        return format(date, 'MMM dd');
    };

    const getRiskColor = (completedCount: number, totalCount: number): string => {
        const percentage = (completedCount / totalCount) * 100;
        if (percentage === 100) return 'text-emerald-600 bg-emerald-50 border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400';
        if (percentage >= 50) return 'text-yellow-600 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400';
        if (percentage > 0) return 'text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-400';
        return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400';
    };

    const toggleTaskComplete = (taskId: string): void => {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-gray-900/40 backdrop-blur-3xl p-6 md:p-8 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 relative overflow-hidden"
        >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-16 gap-6">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                        <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Goal Timeline</h3>
                        <p className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            Track Your Milestones
                            <span className="w-1 h-1 rounded-full bg-gray-300" />
                            <span className="text-amber-600 dark:text-amber-400 font-bold">{tasks.length} Total Tasks</span>
                        </p>
                    </div>
                </div>
            </div>

            {events.length === 0 ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="font-medium">No tasks yet</p>
                    <p className="text-sm mt-1">Select a date below to add your first task</p>
                </div>
            ) : (
                <div className="relative overflow-x-auto py-40 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {/* Scrollable container with space for zig-zag cards */}
                    <div className="min-w-max px-4">
                        {/* Dynamic Progress Line with Gradient */}
                        {(() => {
                            // Calculate the furthest card with ANY tasks (not just completed)
                            let lastActiveIndex = -1;
                            const colorStops: string[] = [];
                            
                            events.forEach((event, index) => {
                                // Track any card that has tasks (not just completed ones)
                                if (event.tasks.length > 0) lastActiveIndex = index;
                            });
                            
                            // If no tasks anywhere, show only gray line (extends to end of last card + margin)
                            const grayLineWidth = events.length > 0 ? (16 + (events.length - 1) * 272 + 256 + 50) : 300;
                            if (lastActiveIndex === -1) {
                                return (
                                    <div className="absolute top-1/2 left-0 h-[2px] bg-gray-700 -translate-y-1/2 hidden md:block rounded-full" style={{ width: `${grayLineWidth}px` }} />
                                );
                            }
                            
                            // Build gradient: account for 16px padding + each card center at 128 + index * 272
                            const padding = 16;
                            let prevPosition = 0;
                            events.slice(0, lastActiveIndex + 1).forEach((event, index) => {
                                const completedCount = event.tasks.filter(t => t.completed).length;
                                const totalCount = event.tasks.length;
                                const isComplete = completedCount === totalCount && totalCount > 0;
                                const isNotStarted = completedCount === 0 && totalCount > 0;
                                // Red for not started, green for complete, blue for in progress
                                const color = isComplete ? '#10b981' : isNotStarted ? '#ef4444' : '#3b82f6';
                                
                                // Add padding offset to dot position calculation
                                const dotPosition = padding + 128 + index * 272;
                                
                                if (index === 0) {
                                    colorStops.push(`${color} 0px`);
                                    colorStops.push(`${color} ${dotPosition}px`);
                                } else {
                                    colorStops.push(`${color} ${prevPosition}px`);
                                    colorStops.push(`${color} ${dotPosition}px`);
                                }
                                prevPosition = dotPosition;
                            });
                            
                            const totalWidth = padding + 128 + lastActiveIndex * 272;
                            const gradientStyle = `linear-gradient(to right, ${colorStops.join(', ')})`;
                            
                            return (
                                <>
                                    {/* Background gray line - extends to end of cards */}
                                    <div className="absolute top-1/2 left-0 h-[2px] bg-gray-700 -translate-y-1/2 hidden md:block rounded-full" style={{ width: `${grayLineWidth}px` }} />
                                    {/* Colored progress line */}
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: totalWidth }}
                                        transition={{ duration: 1.2, delay: 0.2, ease: "circOut" }}
                                        className="absolute top-1/2 left-0 h-[2px] -translate-y-1/2 hidden md:block rounded-full"
                                        style={{ background: gradientStyle }}
                                    />
                                </>
                            );
                        })()}

                        <div className="flex gap-4 relative">
                            {events.map((event, index) => {
                                const completedCount = event.tasks.filter(t => t.completed).length;
                                const totalCount = event.tasks.length;
                                const isCompleted = completedCount === totalCount;
                                const dynamicDate = getDynamicDate(event.date);
                                const riskStyle = getRiskColor(completedCount, totalCount);

                                return (
                                    <div key={index} className="relative group flex flex-col justify-center w-64 flex-shrink-0">

                                        {/* Timeline Dot */}
                                        <div className={cn(
                                            "hidden md:flex absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full z-10 transition-all duration-500 items-center justify-center",
                                            isCompleted ? "bg-green-500 ring-4 ring-green-500/20 shadow-[0_0_20px_rgba(16,185,129,0.5)] scale-110" :
                                                completedCount > 0 ? "bg-blue-500 ring-4 ring-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.5)] scale-110" :
                                                    "bg-red-500 ring-4 ring-red-500/30 shadow-[0_0_35px_rgba(239,68,68,0.7)] scale-110"
                                        )}>
                                            {isCompleted && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                            {completedCount > 0 && !isCompleted && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                                            {completedCount === 0 && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                        </div>

                                        {/* Card Container */}
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.1 * index }}
                                            className={cn(
                                                "relative flex flex-col items-center w-full",
                                                index % 2 === 0 ? "md:-translate-y-[calc(50%+3rem)]" : "md:translate-y-[calc(50%+3rem)]"
                                            )}>

                                            {/* Phase Marker & Date - Fixed z-index */}
                                            <div className={cn(
                                                "hidden md:flex flex-col items-center absolute w-full pointer-events-none z-20",
                                                index % 2 === 0 ? "top-full mt-16" : "bottom-full mb-16"
                                            )}>
                                                <span className={cn(
                                                    "text-xs font-black uppercase tracking-widest mb-1",
                                                    isCompleted ? "text-green-500" : 
                                                    completedCount > 0 ? "text-blue-500" : "text-gray-500"
                                                )}>
                                                    {format(event.date, 'EEEE')}
                                                </span>
                                                <span className="font-bold text-xs text-gray-500 bg-white dark:bg-gray-800 px-2 py-0.5 rounded">{dynamicDate}</span>
                                            </div>

                                            {/* Card Body */}
                                            <div 
                                                onClick={() => setSelectedDate(event.date)}
                                                className={cn(
                                                "w-full p-3 rounded-2xl border transition-all duration-300 relative group/card backdrop-blur-2xl z-5 max-h-[380px] flex flex-col cursor-pointer shadow-lg",
                                                isCompleted 
                                                    ? "bg-white/60 dark:bg-gray-800/60 border-green-400/40 shadow-xl shadow-green-500/20"
                                                    : completedCount > 0
                                                    ? "bg-white/60 dark:bg-gray-800/60 border-blue-400/40 shadow-xl shadow-blue-500/10"
                                                    : "bg-white/40 dark:bg-gray-900/30 border-red-400/40 dark:border-red-500/30 shadow-xl shadow-red-500/25 hover:bg-white/60 dark:hover:bg-gray-800/40 hover:shadow-2xl"
                                            )}>
                                                {/* Mobile details */}
                                                <div className="md:hidden flex items-center justify-between mb-2">
                                                    <span className="text-[10px] font-bold text-gray-500">{dynamicDate}</span>
                                                    <span className="text-[9px] font-bold uppercase bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{format(event.date, 'EEE')}</span>
                                                </div>

                                                <div className="flex items-start justify-between mb-1">
                                                    <h4 className={cn(
                                                        "font-bold text-sm leading-tight",
                                                        completedCount > 0 ? "text-gray-900 dark:text-white" : "text-gray-700 dark:text-gray-300"
                                                    )}>
                                                        {format(event.date, 'MMMM d, yyyy')}
                                                    </h4>

                                                    {/* Risk Badge */}
                                                    <div className="flex-shrink-0 w-2 h-2 rounded-full mt-1"
                                                        style={{
                                                            backgroundColor: isCompleted ? '#10b981' :
                                                                completedCount > 0 ? '#3b82f6' : '#ef4444'
                                                        }}
                                                    />
                                                </div>

                                                {/* Task List Section */}
                                                <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50 space-y-1.5 flex-1 overflow-hidden flex flex-col">
                                                    <div className="flex items-center justify-between flex-shrink-0">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Tasks ({completedCount}/{totalCount})</span>
                                                    </div>

                                                    <div className="space-y-1.5 overflow-y-auto flex-1 pr-2 max-h-[80px]">
                                                        {event.tasks.map(task => (
                                                            <div key={task.id} className="flex items-start gap-2 group/todo">
                                                                <div 
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleTaskComplete(task.id);
                                                                    }}
                                                                    className={cn(
                                                                    "mt-0.5 w-3 h-3 rounded-full border flex items-center justify-center transition-colors flex-shrink-0 cursor-pointer",
                                                                    task.completed
                                                                        ? "bg-blue-500 border-blue-500 text-white"
                                                                        : "border-gray-300 hover:border-blue-400"
                                                                )}>
                                                                    {task.completed && <CheckCircle2 className="h-2 w-2" />}
                                                                </div>
                                                                <span className={cn(
                                                                    "text-[10px] leading-tight transition-colors flex-1",
                                                                    task.completed ? "text-gray-400 line-through" : "text-gray-600 dark:text-gray-300"
                                                                )}>
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 mt-2 pt-2 border-t border-gray-100 dark:border-gray-700/50">
                                                    <div className="flex items-center gap-2">
                                                        <span className={cn(
                                                            "text-[9px] font-bold px-2 py-0.5 rounded-full border border-current",
                                                            riskStyle
                                                        )}>
                                                            {isCompleted ? 'COMPLETE' : completedCount > 0 ? 'IN PROGRESS' : 'NOT STARTED'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Connector Line (Vertical) */}
                                            <div className={cn(
                                                "hidden md:block absolute w-[1px] h-12 bg-gray-200 dark:bg-gray-700 z-0",
                                                index % 2 === 0 ? "top-full" : "bottom-full"
                                            )} />

                                        </motion.div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </motion.div>
    );
}

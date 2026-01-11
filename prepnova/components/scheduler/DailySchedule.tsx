"use client";

import { motion } from "framer-motion";
import { Clock, CheckCircle2, Zap, Edit2, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import type { Task } from "./SchedulerSidebar";

interface DailyScheduleProps {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
  selectedDate: Date;
}

export function DailySchedule({ tasks, setTasks, selectedDate }: DailyScheduleProps): React.JSX.Element {
    const [planTitle, setPlanTitle] = useState("Today's Plan");
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    
    // New task form
    const [newTaskTitle, setNewTaskTitle] = useState("");
    const [newTaskDescription, setNewTaskDescription] = useState("");
    const [newTaskDuration, setNewTaskDuration] = useState("");
    const [newTaskPriority, setNewTaskPriority] = useState("Normal");
    const [editPriority, setEditPriority] = useState("Normal");

    // Filter tasks for selected date
    const selectedDateTasks = tasks.filter(task => isSameDay(task.date, selectedDate));
    const completedCount = selectedDateTasks.filter(i => i.completed).length;
    const progress = selectedDateTasks.length > 0 ? (completedCount / selectedDateTasks.length) * 100 : 0;

    const getPriorityColor = (priority: string): string => {
        switch (priority) {
            case "High": return "text-rose-600 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800";
            case "Medium": return "text-amber-600 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800";
            case "Low": return "text-blue-600 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";
            default: return "text-green-600 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800";
        }
    };

    const toggleComplete = (id: string): void => {
        setTasks(tasks.map(item =>
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    const handleAddTask = (): void => {
        if (!newTaskTitle.trim()) return;

        const newTask: Task = {
            id: crypto.randomUUID(),
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim(),
            date: selectedDate,
            completed: false,
            priority: newTaskPriority,
            priorityColor: getPriorityColor(newTaskPriority),
            duration: newTaskDuration.trim() || undefined,
            createdAt: new Date(),
        };

        setTasks([...tasks, newTask]);
        setNewTaskTitle("");
        setNewTaskDescription("");
        setNewTaskDuration("");
    };

    const handleStartEdit = (task: Task): void => {
        setEditingTaskId(task.id);
        setEditTitle(task.title);
        setEditDescription(task.description);
        setEditPriority(task.priority);
    };

    const handleSaveEdit = (): void => {
        if (!editTitle.trim() || !editingTaskId) return;

        setTasks(tasks.map(t => t.id === editingTaskId
            ? { ...t, title: editTitle.trim(), description: editDescription.trim(), priority: editPriority, priorityColor: getPriorityColor(editPriority) }
            : t
        ));
        setEditingTaskId(null);
    };

    const handleDeleteTask = (taskId: string): void => {
        setTasks(tasks.filter(t => t.id !== taskId));
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="h-full flex flex-col rounded-3xl border border-white/40 dark:border-white/10 bg-white/50 dark:bg-gray-900/40 backdrop-blur-3xl p-6 shadow-2xl shadow-blue-500/5 dark:shadow-black/20 overflow-hidden"
        >
            <div className="flex items-center justify-between mb-6">
                <div className="flex-1">
                    {isEditingTitle ? (
                        <input
                            type="text"
                            value={planTitle}
                            onChange={(e) => setPlanTitle(e.target.value)}
                            onBlur={() => setIsEditingTitle(false)}
                            onKeyDown={(e) => e.key === 'Enter' && setIsEditingTitle(false)}
                            className="text-2xl font-black text-gray-900 dark:text-gray-100 font-display bg-transparent border-b-2 border-blue-500 focus:outline-none w-full"
                            autoFocus
                        />
                    ) : (
                        <div className="flex items-center gap-2 group cursor-pointer" onClick={() => setIsEditingTitle(true)}>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-gray-100 font-display">{planTitle}</h2>
                            <Edit2 className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5 mt-1">
                        <Zap className="h-3.5 w-3.5 text-amber-500" />
                        {format(selectedDate, 'MMMM d, yyyy')}
                    </p>
                </div>
                <div className="text-right">
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Progress</div>
                    <div className="text-xl font-black text-gray-900 dark:text-gray-100">{completedCount}/{selectedDateTasks.length}</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full mb-8 overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                />
            </div>

            <div className="flex-1 space-y-1 overflow-y-auto pr-2 custom-scrollbar max-h-[300px] min-h-[200px]">
                {selectedDateTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p className="text-sm">No tasks for this date</p>
                        <p className="text-xs mt-1">Add a task below to get started</p>
                    </div>
                ) : (
                    selectedDateTasks.map((item, i) => (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 * i }}
                            className={cn(
                                "group relative p-4 rounded-xl transition-all duration-200 border border-transparent",
                                item.completed
                                    ? "opacity-60 bg-gray-50/50 dark:bg-gray-800/30"
                                    : "hover:bg-white/60 dark:hover:bg-white/5 hover:shadow-sm hover:border-gray-100 dark:hover:border-white/5"
                            )}
                        >
                            {editingTaskId === item.id ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                        placeholder="Task title"
                                    />
                                    <textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 resize-none"
                                        rows={2}
                                        placeholder="Description"
                                    />
                                    <select
                                        value={editPriority}
                                        onChange={(e) => setEditPriority(e.target.value)}
                                        className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Normal">🟢 Normal</option>
                                        <option value="Low">🔵 Low Priority</option>
                                        <option value="Medium">🟡 Medium Priority</option>
                                        <option value="High">🔴 High Priority</option>
                                    </select>
                                    <div className="flex gap-2">
                                        <button onClick={handleSaveEdit} className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg">Save</button>
                                        <button onClick={() => setEditingTaskId(null)} className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-lg">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start gap-4">
                                    <button
                                        onClick={() => toggleComplete(item.id)}
                                        className={cn(
                                            "mt-1 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                            item.completed
                                                ? "bg-blue-500 border-blue-500 text-white scale-100"
                                                : "border-gray-300 dark:border-gray-600 text-transparent hover:border-blue-400 hover:scale-110"
                                        )}
                                    >
                                        <CheckCircle2 className="h-3 w-3" strokeWidth={3} />
                                    </button>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className={cn(
                                                "text-sm font-semibold transition-colors",
                                                item.completed ? "text-gray-400 line-through decoration-gray-300" : "text-gray-900 dark:text-gray-200"
                                            )}>
                                                {item.title}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] font-bold px-2 py-0.5 rounded-full border bg-opacity-50",
                                                    item.priorityColor
                                                )}>
                                                    {item.priority}
                                                </span>
                                                <button onClick={() => handleStartEdit(item)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/50 rounded">
                                                    <Edit2 className="w-3 h-3 text-gray-500" />
                                                </button>
                                                <button onClick={() => handleDeleteTask(item.id)} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-50 rounded">
                                                    <Trash2 className="w-3 h-3 text-red-500" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className={cn(
                                            "text-xs leading-relaxed transition-colors",
                                            item.completed ? "text-gray-300" : "text-gray-500 dark:text-gray-400"
                                        )}>
                                            {item.description}
                                        </p>
                                        <div className="flex items-center gap-3 mt-2">
                                            {item.createdAt && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    {format(item.createdAt, 'h:mm a')}
                                                </div>
                                            )}
                                            {item.duration && (
                                                <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-400">
                                                    <Clock className="h-3 w-3" />
                                                    {item.duration}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {i !== selectedDateTasks.length - 1 && (
                                <div className="absolute bottom-0 left-14 right-4 h-[1px] bg-gray-100 dark:bg-gray-800/50 group-hover:hidden" />
                            )}
                        </motion.div>
                    ))
                )}
            </div>

            {/* Add Task Form */}
            <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700/50 space-y-3">
                <input
                    type="text"
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
                    className="w-full px-3 py-2 text-sm rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    placeholder="Task title..."
                />
                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={newTaskPriority}
                        onChange={(e) => setNewTaskPriority(e.target.value)}
                        className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="Normal">🟢 Normal</option>
                        <option value="Low">🔵 Low Priority</option>
                        <option value="Medium">🟡 Medium Priority</option>
                        <option value="High">🔴 High Priority</option>
                    </select>
                    <button
                        onClick={handleAddTask}
                        disabled={!newTaskTitle.trim()}
                        className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-900 dark:bg-white text-white dark:text-black hover:opacity-90 transition-opacity disabled:opacity-50"
                    >
                        <Plus className="w-3 h-3" />
                        Add
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

"use client";

import { useState, type FormEvent } from "react";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import { type TaskFormProps } from "./types";

/**
 * TaskForm component - Form for adding new tasks
 * Validates input and creates tasks for the selected date
 */
export function TaskForm({ selectedDate, onTaskAdd }: TaskFormProps): React.JSX.Element {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    
    if (!title.trim()) {
      return;
    }
    
    onTaskAdd({
      title: title.trim(),
      description: description.trim() || undefined,
      date: selectedDate,
      completed: false,
    });
    
    // Reset form
    setTitle("");
    setDescription("");
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
          Add Task
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {format(selectedDate, 'MMM dd, yyyy')}
        </span>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Title input */}
        <div>
          <label htmlFor="task-title" className="sr-only">
            Task title
          </label>
          <input
            id="task-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
            className="
              w-full px-3 py-2 text-sm rounded-lg
              bg-gray-50 dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
            "
            required
          />
        </div>
        
        {/* Description textarea */}
        <div>
          <label htmlFor="task-description" className="sr-only">
            Task description
          </label>
          <textarea
            id="task-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description (optional)..."
            rows={2}
            className="
              w-full px-3 py-2 text-sm rounded-lg resize-none
              bg-gray-50 dark:bg-gray-700
              border border-gray-200 dark:border-gray-600
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              focus:ring-2 focus:ring-blue-500 focus:border-transparent
              transition-colors
            "
          />
        </div>
        
        {/* Submit button */}
        <button
          type="submit"
          disabled={!title.trim()}
          className="
            w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg
            bg-gradient-to-r from-blue-600 to-purple-600
            text-white shadow-sm
            hover:from-blue-700 hover:to-purple-700
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-all
          "
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      </form>
    </div>
  );
}

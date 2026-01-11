"use client";

import { motion } from "framer-motion";
import { type TimelineNodeProps } from "./types";
import { format } from "date-fns";

/**
 * TimelineNode component - Individual task node with glassmorphism effect
 * Positioned in zig-zag pattern (even indices above, odd indices below timeline)
 */
export function TimelineNode({ task, index, onClick }: TimelineNodeProps): React.JSX.Element {
  const isEven = index % 2 === 0;
  
  return (
    <div
      className="absolute flex flex-col items-center"
      style={{
        left: `${index * 200 + 100}px`,
        [isEven ? 'bottom' : 'top']: '50%',
      }}
    >
      {/* Connector line */}
      <div
        className={`w-0.5 bg-gradient-to-b from-blue-500 to-purple-500 ${
          isEven ? 'mb-2' : 'mt-2 order-last'
        }`}
        style={{ height: '60px' }}
      />
      
      {/* Task card with glassmorphism */}
      <motion.div
        whileHover={{ scale: 1.05, y: isEven ? -5 : 5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => onClick?.(task)}
        className={`
          w-48 p-4 rounded-xl cursor-pointer
          backdrop-blur-md bg-white/10 dark:bg-gray-900/10
          border border-white/20 dark:border-gray-700/20
          shadow-lg hover:shadow-xl transition-shadow
          ${isEven ? '' : 'order-first'}
        `}
      >
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
            {task.title}
          </h3>
          {task.completed && (
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        
        <p className="text-xs text-gray-600 dark:text-gray-300 mb-2">
          {format(task.date, 'MMM dd, yyyy')}
        </p>
        
        {task.description && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}
      </motion.div>
    </div>
  );
}

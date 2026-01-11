"use client";

import { motion } from "framer-motion";
import { type TimelineProps } from "./types";
import { TimelineNode } from "./TimelineNode";

/**
 * Timeline component - Draggable horizontal timeline with task nodes
 * Uses Framer Motion for smooth drag interactions
 */
export function Timeline({ tasks, onTaskClick }: TimelineProps): React.JSX.Element {
  const timelineWidth = Math.max(tasks.length * 200 + 200, 800);
  
  return (
    <div className="relative w-full h-full overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800">
      {/* Empty state */}
      {tasks.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600 dark:text-gray-400 font-medium">No tasks scheduled</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Add your first task below</p>
          </div>
        </div>
      ) : (
        <motion.div
          drag="x"
          dragConstraints={{
            left: -(timelineWidth - 600),
            right: 0,
          }}
          dragElastic={0.1}
          dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
        >
          {/* Central timeline axis */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transform -translate-y-1/2" />
          
          {/* Task nodes */}
          <div className="relative h-full">
            {tasks.map((task, index) => (
              <TimelineNode
                key={task.id}
                task={task}
                index={index}
                onClick={onTaskClick}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

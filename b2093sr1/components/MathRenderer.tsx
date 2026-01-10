"use client";

import React from "react";
import "katex/dist/katex.min.css";

interface MathRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders text with LaTeX math expressions
 * Supports both inline ($...$) and display ($$...$$) math
 */
export function MathRenderer({ content, className = "" }: MathRendererProps) {
  const renderMath = (text: string) => {
    // Split by display math ($$...$$) first
    const displayParts = text.split(/(\$\$[\s\S]+?\$\$)/g);
    
    return displayParts.map((part, i) => {
      if (part.startsWith("$$") && part.endsWith("$$")) {
        // Display math
        const math = part.slice(2, -2);
        return (
          <div key={i} className="my-4 overflow-x-auto">
            <div
              className="text-center"
              dangerouslySetInnerHTML={{
                __html: renderKatex(math, true),
              }}
            />
          </div>
        );
      }
      
      // Split by inline math ($...$)
      const inlineParts = part.split(/(\$[^\$]+?\$)/g);
      
      return inlineParts.map((inlinePart, j) => {
        if (inlinePart.startsWith("$") && inlinePart.endsWith("$") && inlinePart.length > 2) {
          // Inline math
          const math = inlinePart.slice(1, -1);
          return (
            <span
              key={`${i}-${j}`}
              dangerouslySetInnerHTML={{
                __html: renderKatex(math, false),
              }}
            />
          );
        }
        
        // Regular text
        return <span key={`${i}-${j}`}>{inlinePart}</span>;
      });
    });
  };

  const renderKatex = (math: string, displayMode: boolean): string => {
    try {
      // KaTeX must be loaded dynamically on client side
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const katex = require("katex");
      return katex.renderToString(math, {
        displayMode,
        throwOnError: false,
        strict: false,
      });
    } catch (error) {
      console.error("KaTeX rendering error:", error);
      return displayMode ? `$$${math}$$` : `$${math}$`;
    }
  };

  return <div className={className}>{renderMath(content)}</div>;
}

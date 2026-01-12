"use client";

import * as React from "react";

interface PopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface PopoverTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

interface PopoverContentProps {
  children: React.ReactNode;
  align?: "start" | "center" | "end";
  side?: "top" | "bottom" | "left" | "right";
  className?: string;
}

const PopoverContext = React.createContext<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  triggerRef: React.RefObject<HTMLElement | null>;
}>({
  open: false,
  onOpenChange: () => {},
  triggerRef: { current: null },
});

export function Popover({ open, onOpenChange, children }: PopoverProps) {
  const triggerRef = React.useRef<HTMLElement | null>(null);

  return (
    <PopoverContext.Provider value={{ open, onOpenChange, triggerRef }}>
      {children}
    </PopoverContext.Provider>
  );
}

export function PopoverTrigger({ children, asChild }: PopoverTriggerProps) {
  const { onOpenChange, triggerRef } = React.useContext(PopoverContext);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onOpenChange(true);
  };

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement<any>, {
      ref: triggerRef,
      onClick: handleClick,
    });
  }

  return (
    <div ref={triggerRef as React.RefObject<HTMLDivElement>} onClick={handleClick}>
      {children}
    </div>
  );
}

export function PopoverContent({
  children,
  align = "center",
  side = "top",
  className = "",
}: PopoverContentProps) {
  const { open, onOpenChange, triggerRef } = React.useContext(PopoverContext);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [position, setPosition] = React.useState({ top: 0, left: 0 });

  React.useEffect(() => {
    if (open && triggerRef.current && contentRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const contentRect = contentRef.current.getBoundingClientRect();
      
      let top = 0;
      let left = 0;

      // Calculate vertical position
      if (side === "top") {
        top = triggerRect.top - contentRect.height - 4; // Reduced from 8px to 4px
      } else if (side === "bottom") {
        top = triggerRect.bottom + 4; // Reduced from 8px to 4px
      }

      // Calculate horizontal position
      if (align === "start") {
        left = triggerRect.left;
      } else if (align === "end") {
        left = triggerRect.right - contentRect.width;
      } else {
        left = triggerRect.left + (triggerRect.width - contentRect.width) / 2;
      }

      // Ensure content stays within viewport
      const padding = 8;
      if (left < padding) left = padding;
      if (left + contentRect.width > window.innerWidth - padding) {
        left = window.innerWidth - contentRect.width - padding;
      }
      if (top < padding) top = padding;

      setPosition({ top, left });
    }
  }, [open, side, align]);

  React.useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onOpenChange(false);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      ref={contentRef}
      className={`fixed z-50 animate-in fade-in-0 zoom-in-95 ${className}`}
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      {children}
    </div>
  );
}

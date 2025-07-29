import React, { useState, useRef, useCallback } from "react";
import { TimelineEvent } from "@/types/timeline";
import { cn } from "@/lib/utils";

interface TimelineEventComponentProps {
  event: TimelineEvent;
  pixelsPerTimeUnit: number;
  viewStartTime: number;
  isSelected: boolean;
  onClick: () => void;
  onMove: (eventId: string, newStartTime: number, newEndTime: number) => void;
  top: number;
  height: number;
  isMultiCharacter?: boolean;
}

export const TimelineEventComponent: React.FC<TimelineEventComponentProps> = ({
  event,
  pixelsPerTimeUnit,
  viewStartTime,
  isSelected,
  onClick,
  onMove,
  top,
  height,
  isMultiCharacter = false,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState<"start" | "end" | null>(null);
  const [dragStart, setDragStart] = useState({
    x: 0,
    startTime: 0,
    endTime: 0,
  });
  const eventRef = useRef<HTMLDivElement>(null);
  const wasMoved = useRef(false);
  const finalTimes = useRef<{ startTime: number; endTime: number } | null>(
    null
  );

  const eventDuration = event.endTime - event.startTime;
  const eventWidth = eventDuration * pixelsPerTimeUnit;
  const eventLeft = (event.startTime - viewStartTime) * pixelsPerTimeUnit;

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        e.stopPropagation();
        wasMoved.current = false;
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          startTime: event.startTime,
          endTime: event.endTime,
        });
      }
    },
    [event.startTime, event.endTime]
  );

  const handleResizeStart = useCallback(
    (e: React.MouseEvent, side: "start" | "end") => {
      e.stopPropagation();
      wasMoved.current = false;
      setIsResizing(side);
      setDragStart({
        x: e.clientX,
        startTime: event.startTime,
        endTime: event.endTime,
      });
    },
    [event.startTime, event.endTime]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if ((isDragging || isResizing) && eventRef.current) {
        const deltaX = e.clientX - dragStart.x;
        if (Math.abs(deltaX) > 2) {
          wasMoved.current = true;
        }
        const deltaTime = deltaX / pixelsPerTimeUnit;

        let newStartTime = event.startTime;
        let newEndTime = event.endTime;

        if (isDragging) {
          newStartTime = dragStart.startTime + deltaTime;
          newEndTime = dragStart.endTime + deltaTime;
        } else if (isResizing === "start") {
          newStartTime = Math.min(
            dragStart.startTime + deltaTime,
            dragStart.endTime - 0.1
          );
          newEndTime = dragStart.endTime;
        } else if (isResizing === "end") {
          newEndTime = Math.max(
            dragStart.endTime + deltaTime,
            dragStart.startTime + 0.1
          );
          newStartTime = dragStart.startTime;
        }

        const newLeft = (newStartTime - viewStartTime) * pixelsPerTimeUnit;
        const newWidth = (newEndTime - newStartTime) * pixelsPerTimeUnit;

        eventRef.current.style.left = `${Math.max(0, newLeft)}px`;
        eventRef.current.style.width = `${Math.max(20, newWidth)}px`;

        finalTimes.current = { startTime: newStartTime, endTime: newEndTime };
      }
    },
    [
      isDragging,
      isResizing,
      dragStart,
      pixelsPerTimeUnit,
      event.startTime,
      event.endTime,
      viewStartTime,
    ]
  );

  const handleMouseUp = useCallback(() => {
    if ((isDragging || isResizing) && wasMoved.current && finalTimes.current) {
      onMove(
        event._id,
        finalTimes.current.startTime,
        finalTimes.current.endTime
      );
    }
    setIsDragging(false);
    setIsResizing(null);
    finalTimes.current = null;
  }, [isDragging, isResizing, onMove, event._id]);

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

  const eventColor = event.color;

  return (
    <div
      ref={eventRef}
      className={cn(
        "absolute rounded-lg cursor-pointer select-none duration-200 group pointer-events-auto",
        "border-2 border-transparent",
        isSelected && "border-timeline-selected shadow-timeline-hover",
        isDragging && "shadow-shadow-hover scale-105",
        "hover:shadow-shadow-event hover:bg-opacity-90"
      )}
      style={{
        left: Math.max(0, eventLeft),
        width: Math.max(20, eventWidth),
        height: height - 8,
        top: top + 4,
        backgroundColor: eventColor,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        if (!wasMoved.current) {
          onClick();
        }
      }}
    >
      {/* Resize handles */}
      <div
        className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => handleResizeStart(e, "start")}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize bg-background/20 opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={(e) => handleResizeStart(e, "end")}
      />

      {/* Event content */}
      <div className="p-2 h-full flex flex-col justify-center text-white overflow-hidden">
        <div className="font-semibold text-sm truncate">{event.title}</div>
        {height > 40 && event.description && (
          <div className="text-xs opacity-90 truncate">{event.description}</div>
        )}
        {isMultiCharacter && (
          <div className="text-xs opacity-75 font-medium">Multi-Character</div>
        )}
      </div>
    </div>
  );
};

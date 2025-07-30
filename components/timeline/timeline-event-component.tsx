import React from "react";
import { TimelineEvent } from "@/types/timeline";
import { cn } from "@/lib/utils";

interface TimelineEventComponentProps {
  event: Omit<TimelineEvent, "startTime" | "endTime"> & {
    startTime: number;
    endTime: number;
  };
  pixelsPerTimeUnit: number;
  viewStartTime: number;
  isSelected: boolean;
  onClick: () => void;
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
  top,
  height,
  isMultiCharacter = false,
}) => {
  const eventDuration = event.endTime - event.startTime;
  const eventWidth = eventDuration * pixelsPerTimeUnit;
  const eventLeft = (event.startTime - viewStartTime) * pixelsPerTimeUnit;

  const eventColor = event.color;

  return (
    <div
      className={cn(
        "absolute rounded-lg cursor-pointer select-none duration-200 group pointer-events-auto",
        "border-2 border-transparent",
        isSelected && "border-timeline-selected shadow-timeline-hover",
        "hover:shadow-shadow-event hover:bg-opacity-90"
      )}
      style={{
        left: Math.max(0, eventLeft),
        width: Math.max(20, eventWidth),
        height: height - 8,
        top: top + 4,
        backgroundColor: eventColor,
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
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

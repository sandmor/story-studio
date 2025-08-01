import React from "react";
import { TimelineEvent, Character } from "@/types/timeline";
import { TimelineEventComponent } from "./timeline-event-component";

interface TimelineEventGroupProps {
  event: Omit<TimelineEvent, "startTime" | "endTime"> & {
    startTime: number;
    endTime: number;
  };
  visibleCharacters: Character[];
  pixelsPerSecond: number;
  viewStartTime: number;
  isSelected: boolean;
  onClick: (
    event: Omit<TimelineEvent, "startTime" | "endTime"> & {
      startTime: number;
      endTime: number;
    }
  ) => void;
}

const groupAdjacentNumbers = (numbers: number[]): number[][] => {
  if (numbers.length === 0) {
    return [];
  }
  // Ensure unique and sorted
  const sorted = [...new Set(numbers)].sort((a, b) => a - b);
  if (sorted.length === 0) {
    return [];
  }

  const groups: number[][] = [[sorted[0]]];

  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] === sorted[i - 1] + 1) {
      groups[groups.length - 1].push(sorted[i]);
    } else {
      groups.push([sorted[i]]);
    }
  }
  return groups;
};

export const TimelineEventGroup: React.FC<TimelineEventGroupProps> = ({
  event,
  visibleCharacters,
  pixelsPerSecond,
  viewStartTime,
  isSelected,
  onClick,
}) => {
  const characterIndexMap = new Map(
    visibleCharacters.map((char, index) => [char._id, index])
  );

  const trackIndices = event.participants
    .map((id) => characterIndexMap.get(id))
    .filter((index): index is number => index !== undefined);

  if (trackIndices.length === 0) {
    return null;
  }

  const trackGroups = groupAdjacentNumbers(trackIndices);

  return (
    <>
      {trackGroups.map((group, index) => {
        if (group.length === 0) return null;
        const startTrack = group[0];
        const trackSpan = group.length;

        const top = startTrack * 80; // 80 is track height
        const height = trackSpan * 80;

        return (
          <TimelineEventComponent
            key={`${event._id}-${index}`}
            event={event}
            pixelsPerSecond={pixelsPerSecond}
            viewStartTime={viewStartTime}
            isSelected={isSelected}
            onClick={() => onClick(event)}
            top={top}
            height={height}
            isMultiCharacter={event.participants.length > 1}
          />
        );
      })}
    </>
  );
};
import React from "react";
import { TimelineEvent, Character } from "@/types/timeline";
import { TimelineEventComponent } from "./timeline-event-component";

interface TimelineEventGroupProps {
  event: TimelineEvent;
  visibleCharacters: Character[];
  pixelsPerTimeUnit: number;
  viewStartTime: number;
  isSelected: boolean;
  onClick: (event: TimelineEvent) => void;
  onMove: (eventId: string, newStartTime: number, newEndTime: number) => void;
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
  pixelsPerTimeUnit,
  viewStartTime,
  isSelected,
  onClick,
  onMove,
}) => {
  const characterIndexMap = new Map(
    visibleCharacters.map((char, index) => [char.id, index])
  );

  const trackIndices = event.characterIds
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
            key={`${event.id}-${index}`}
            event={event}
            pixelsPerTimeUnit={pixelsPerTimeUnit}
            viewStartTime={viewStartTime}
            isSelected={isSelected}
            onClick={() => onClick(event)}
            onMove={onMove}
            top={top}
            height={height}
            isMultiCharacter={event.characterIds.length > 1}
          />
        );
      })}
    </>
  );
};

import React from "react";
import { Character, TimelineEvent } from "@/types/timeline";
import { CharacterTrack } from "./character-track";
import { TimelineGrid, TimelineHeader } from "./timeline-grid";
import { TimelineEventGroup } from "./timeline-event-group";

interface TimelineContentProps {
  characters: Character[];
  events: TimelineEvent[];
  pixelsPerTimeUnit: number;
  viewStartTime: number;
  viewEndTime: number;
  selectedEventId: string | null;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
  rightHeaderRef: React.RefObject<HTMLDivElement | null>;
  onEventClick: (event: TimelineEvent) => void;
  onEventMove: (
    eventId: string,
    newStartTime: number,
    newEndTime: number
  ) => void;
  onHorizontalScroll: () => void;
}

export const TimelineContent: React.FC<TimelineContentProps> = ({
  characters,
  events,
  pixelsPerTimeUnit,
  viewStartTime,
  viewEndTime,
  selectedEventId,
  viewportRef,
  rightPanelRef,
  rightHeaderRef,
  onEventClick,
  onEventMove,
  onHorizontalScroll,
}) => {
  const visibleCharacters = characters
    .filter((char) => char.visible)
    .sort((a, b) => a.order - b.order);

  const timeRange = viewEndTime - viewStartTime;

  return (
    <div ref={viewportRef} className="flex-1 flex flex-col overflow-hidden">
      <div
        ref={rightHeaderRef}
        className="h-16 border-b bg-muted/30 backdrop-blur-sm sticky top-0 z-10 overflow-hidden"
      >
        <TimelineHeader
          startTime={viewStartTime}
          endTime={viewEndTime}
          pixelsPerTimeUnit={pixelsPerTimeUnit}
        />
      </div>

      <div
        ref={rightPanelRef}
        className="flex-1 relative overflow-auto bg-timeline-track"
        onScroll={onHorizontalScroll}
      >
        <div
          className="relative"
          style={{
            width: timeRange * pixelsPerTimeUnit,
            height: visibleCharacters.length * 80,
          }}
        >
          <TimelineGrid
            startTime={viewStartTime}
            endTime={viewEndTime}
            pixelsPerTimeUnit={pixelsPerTimeUnit}
            characterCount={visibleCharacters.length}
          />

          {visibleCharacters.map((character, index) => (
            <CharacterTrack
              key={character.id}
              character={character}
              trackIndex={index}
            />
          ))}

          <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
            {events.map((event) => (
              <TimelineEventGroup
                key={event.id}
                event={event}
                visibleCharacters={visibleCharacters}
                pixelsPerTimeUnit={pixelsPerTimeUnit}
                viewStartTime={viewStartTime}
                isSelected={selectedEventId === event.id}
                onClick={onEventClick}
                onMove={onEventMove}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

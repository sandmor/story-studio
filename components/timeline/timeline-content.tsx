import React from "react";
import { Character, TimelineEvent } from "@/types/timeline";
import { CharacterTrack } from "./character-track";
import { TimelineRuler, TimelineRulerHeader } from "./timeline-ruler";
import { TimelineEventGroup } from "./timeline-event-group";

interface TimelineContentProps {
  characters: Character[];
  events: (Omit<TimelineEvent, "startTime" | "endTime"> & {
    startTime: number;
    endTime: number;
  })[];
  pixelsPerTimeUnit: number;
  viewStartTime: number;
  viewEndTime: number;
  selectedEventId: string | null;
  viewportRef: React.RefObject<HTMLDivElement | null>;
  rightPanelRef: React.RefObject<HTMLDivElement | null>;
  rightHeaderRef: React.RefObject<HTMLDivElement | null>;
  onEventClick: (
    event: Omit<TimelineEvent, "startTime" | "endTime"> & {
      startTime: number;
      endTime: number;
    }
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
        <TimelineRulerHeader
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
            minWidth: "100%",
            height: visibleCharacters.length * 80,
          }}
        >
          <TimelineRuler
            startTime={viewStartTime}
            endTime={viewEndTime}
            pixelsPerTimeUnit={pixelsPerTimeUnit}
            characterCount={visibleCharacters.length}
          />

          {visibleCharacters.map((character, index) => (
            <CharacterTrack
              key={character._id}
              character={character}
              trackIndex={index}
            />
          ))}

          <div className="absolute top-0 left-0 h-full w-full pointer-events-none">
            {events.map((event) => (
              <TimelineEventGroup
                key={event._id}
                event={event}
                visibleCharacters={visibleCharacters}
                pixelsPerTimeUnit={pixelsPerTimeUnit}
                viewStartTime={viewStartTime}
                isSelected={selectedEventId === event._id}
                onClick={onEventClick}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

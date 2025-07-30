import React, { useRef, useCallback } from "react";
import { Character, TimelineEvent, TimelineEventInput } from "@/types/timeline";
import { EventModal } from "./event-modal";
import { CharacterSidebar } from "./character-sidebar";
import { TimelineContent } from "./timeline-content";
import { useTimelineViewport } from "@/hooks/use-timeline-viewport";
import { useSyncScrolls } from "@/hooks/use-sync-scrolls";
import { Id } from "@/convex/_generated/dataModel";

interface TimelineViewProps {
  characters: Character[];
  events: (Omit<TimelineEvent, "startTime" | "endTime"> & {
    startTime: number;
    endTime: number;
  })[];
  onCharacterUpdate: (character: Character) => void;
  onEventUpdate: (
    event: Omit<TimelineEvent, "startTime" | "endTime"> & {
      startTime: number;
      endTime: number;
    }
  ) => void;
  onEventCreate: (event: TimelineEventInput) => void;
  onEventDelete: (eventId: string) => void;
  projectId: Id<"projects">;
  showEventModal: boolean;
  editingEvent:
    | (Omit<TimelineEvent, "startTime" | "endTime"> & {
        startTime: number;
        endTime: number;
      })
    | null;
  onEventClick: (
    event: Omit<TimelineEvent, "startTime" | "endTime"> & {
      startTime: number;
      endTime: number;
    }
  ) => void;
  closeModal: () => void;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  characters,
  events,
  onCharacterUpdate,
  onEventUpdate,
  onEventCreate,
  onEventDelete,
  projectId,
  showEventModal,
  editingEvent,
  onEventClick,
  closeModal,
}) => {
  // Custom hooks for state management
  const { pixelsPerTimeUnit, viewStartTime, viewEndTime, viewportRef } =
    useTimelineViewport();

  // Refs for scroll synchronization
  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const rightHeaderRef = useRef<HTMLDivElement>(null);

  // Custom hook for scroll synchronization
  useSyncScrolls({ leftPanelRef, rightPanelRef });

  // Event handlers
  const handleEventSave = useCallback(
    (eventData: TimelineEventInput) => {
      if (editingEvent) {
        onEventUpdate({
          ...(editingEvent as any), // Already has the correct shape
          ...eventData,
        });
      } else {
        onEventCreate({ ...eventData, projectId: projectId });
      }
      closeModal();
    },
    [editingEvent, onEventUpdate, onEventCreate, closeModal, projectId]
  );

  const handleHorizontalScroll = useCallback(() => {
    if (rightHeaderRef.current && rightPanelRef.current) {
      rightHeaderRef.current.scrollLeft = rightPanelRef.current.scrollLeft;
    }
  }, []);

  const handleEventDelete = useCallback(() => {
    if (editingEvent) {
      onEventDelete(editingEvent._id);
      closeModal();
    }
  }, [editingEvent, onEventDelete, closeModal]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-secondary/20">
      <div className="flex-1 flex overflow-hidden">
        {/* Character Sidebar */}
        <CharacterSidebar characters={characters} leftPanelRef={leftPanelRef} />

        {/* Timeline Content */}
        <TimelineContent
          characters={characters}
          events={events}
          pixelsPerTimeUnit={pixelsPerTimeUnit}
          viewStartTime={viewStartTime}
          viewEndTime={viewEndTime}
          selectedEventId={editingEvent?._id || null}
          viewportRef={viewportRef}
          rightPanelRef={rightPanelRef}
          rightHeaderRef={rightHeaderRef}
          onEventClick={onEventClick}
          onHorizontalScroll={handleHorizontalScroll}
        />
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={showEventModal}
        event={editingEvent}
        characters={characters}
        onSave={handleEventSave}
        onClose={closeModal}
        onDelete={editingEvent ? handleEventDelete : undefined}
        projectId={projectId}
      />
    </div>
  );
};

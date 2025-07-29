import React, { useState, useRef, useCallback, useEffect } from "react";
import { Character, TimelineEvent } from "@/types/timeline";
import { CharacterTrack } from "./character-track";
import { TimelineGrid, TimelineHeader } from "./timeline-grid";
import { EventModal } from "./event-modal";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { TimelineEventGroup } from "./timeline-event-group";

interface TimelineViewProps {
  characters: Character[];
  events: TimelineEvent[];
  onCharacterUpdate: (character: Character) => void;
  onEventUpdate: (event: TimelineEvent) => void;
  onEventCreate: (event: Omit<TimelineEvent, "id">) => void;
  onEventDelete: (eventId: string) => void;
  viewStartTime: number;
  viewEndTime: number;
}

export const TimelineView: React.FC<TimelineViewProps> = ({
  characters,
  events,
  onCharacterUpdate,
  onEventUpdate,
  onEventCreate,
  onEventDelete,
  viewStartTime,
  viewEndTime,
}) => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);
  const rightHeaderRef = useRef<HTMLDivElement>(null);
  const isSyncingLeftScroll = useRef(false);
  const isSyncingRightScroll = useRef(false);

  const visibleCharacters = characters
    .filter((char) => char.visible)
    .sort((a, b) => a.order - b.order);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEventId(event.id);
    setEditingEvent(event);
    setShowEventModal(true);
  }, []);

  const handleCreateEvent = useCallback(() => {
    setEditingEvent(null);
    setShowEventModal(true);
  }, []);

  const handleEventSave = useCallback(
    (eventData: Omit<TimelineEvent, "id">) => {
      if (editingEvent) {
        onEventUpdate({ ...eventData, id: editingEvent.id });
      } else {
        onEventCreate(eventData);
      }
      setShowEventModal(false);
      setEditingEvent(null);
    },
    [editingEvent, onEventUpdate, onEventCreate]
  );

  const handleEventMove = useCallback(
    (eventId: string, newStartTime: number, newEndTime: number) => {
      const originalEvent = events.find((e) => e.id === eventId);
      if (originalEvent) {
        onEventUpdate({
          ...originalEvent,
          startTime: newStartTime,
          endTime: newEndTime,
        });
      }
    },
    [events, onEventUpdate]
  );

  const timeRange = viewEndTime - viewStartTime;
  const pixelsPerTimeUnit = 800 / timeRange; // Adjust based on zoom level

  useEffect(() => {
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    if (!leftPanel || !rightPanel) return;

    const handleLeftScroll = () => {
      if (!isSyncingLeftScroll.current) {
        isSyncingRightScroll.current = true;
        rightPanel.scrollTop = leftPanel.scrollTop;
      }
      isSyncingLeftScroll.current = false;
    };

    const handleRightScroll = () => {
      if (!isSyncingRightScroll.current) {
        isSyncingLeftScroll.current = true;
        leftPanel.scrollTop = rightPanel.scrollTop;
      }
      isSyncingRightScroll.current = false;
    };

    leftPanel.addEventListener("scroll", handleLeftScroll);
    rightPanel.addEventListener("scroll", handleRightScroll);

    return () => {
      leftPanel.removeEventListener("scroll", handleLeftScroll);
      rightPanel.removeEventListener("scroll", handleRightScroll);
    };
  }, []);

  const handleHorizontalScroll = () => {
    if (rightHeaderRef.current && rightPanelRef.current) {
      rightHeaderRef.current.scrollLeft = rightPanelRef.current.scrollLeft;
    }
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-background to-secondary/20">
      {/* Timeline Header */}
      <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Timeline Manager
          </h2>
          <div className="flex gap-2">
            <Button onClick={handleCreateEvent} className="gap-2" size="sm">
              <Plus className="w-4 h-4" />
              Add Event
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r bg-card/30 backdrop-blur-sm flex flex-col">
          <div className="h-16 border-b flex items-center justify-center bg-muted/50 sticky top-0 z-10">
            <span className="font-semibold text-muted-foreground">
              Characters
            </span>
          </div>
          <div ref={leftPanelRef} className="flex-1 overflow-y-auto">
            {visibleCharacters.map((character) => (
              <div
                key={character.id}
                className="h-20 border-b border-timeline-grid flex items-center px-4 bg-timeline-track hover:bg-timeline-track-alt transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full shadow-sm"
                    style={{ backgroundColor: character.color }}
                  />
                  <span className="font-medium text-sm">{character.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
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
            onScroll={handleHorizontalScroll}
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
                    onClick={handleEventClick}
                    onMove={handleEventMove}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={editingEvent}
          characters={characters}
          onSave={handleEventSave}
          onClose={() => {
            setShowEventModal(false);
            setEditingEvent(null);
          }}
          onDelete={
            editingEvent
              ? () => {
                  onEventDelete(editingEvent.id);
                  setShowEventModal(false);
                  setEditingEvent(null);
                }
              : undefined
          }
        />
      )}
    </div>
  );
};

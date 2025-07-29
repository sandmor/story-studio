import { useState, useCallback } from "react";
import { TimelineEvent } from "@/types/timeline";

export const useEventModal = () => {
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEventId(event.id);
    setEditingEvent(event);
    setShowEventModal(true);
  }, []);

  const handleCreateEvent = useCallback(() => {
    setEditingEvent(null);
    setShowEventModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowEventModal(false);
    setEditingEvent(null);
    setSelectedEventId(null);
  }, []);

  return {
    selectedEventId,
    showEventModal,
    editingEvent,
    handleEventClick,
    handleCreateEvent,
    closeModal,
  };
};

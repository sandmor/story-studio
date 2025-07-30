import { useState, useCallback } from "react";
import { TimelineEvent } from "@/types/timeline";

export const useEventModal = () => {
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<TimelineEvent | null>(null);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setEditingEvent(event);
    setShowEventModal(true);
  }, []);

  const handleCreateEvent = useCallback(() => {
    setEditingEvent(null);
    setShowEventModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowEventModal(false);
  }, []);

  return {
    showEventModal,
    editingEvent,
    handleEventClick,
    handleCreateEvent,
    closeModal,
  };
};

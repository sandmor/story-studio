"use client";

import { CharacterPanel } from "@/components/character-panel";
import { DEFAULT_COLORS } from "@/components/color-picker";
import { TimelineView } from "@/components/timeline/timeline-view";
import { Character, TimelineEvent } from "@/types/timeline";
import { useState } from "react";
import { toast } from "sonner";

export default function Home() {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: "1",
      name: "Alice",
      color: "#3B82F6",
      visible: true,
      order: 1,
    },
    {
      id: "2",
      name: "Bob",
      color: "#EF4444",
      visible: true,
      order: 2,
    },
    {
      id: "3",
      name: "Charlie",
      color: "#10B981",
      visible: true,
      order: 3,
    },
  ]);

  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      title: "Meeting at Cafe",
      description: "Alice and Bob meet for coffee",
      startTime: 1,
      endTime: 3,
      characterIds: ["1", "2"],
      color: DEFAULT_COLORS[0],
    },
    {
      id: "2",
      title: "Solo Journey",
      description: "Charlie travels alone",
      startTime: 2,
      endTime: 5,
      characterIds: ["3"],
      color: DEFAULT_COLORS[2],
    },
    {
      id: "3",
      title: "Group Adventure",
      description: "All three embark on an adventure",
      startTime: 6,
      endTime: 10,
      characterIds: ["1", "2", "3"],
      color: DEFAULT_COLORS[1],
    },
  ]);

  const handleCharacterCreate = (characterData: Omit<Character, "id">) => {
    const newCharacter: Character = {
      ...characterData,
      id: Date.now().toString(),
    };
    setCharacters((prev) => [...prev, newCharacter]);
    toast.success(`Character "${newCharacter.name}" created!`);
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    setCharacters((prev) =>
      prev.map((char) =>
        char.id === updatedCharacter.id ? updatedCharacter : char
      )
    );
    toast.success(`Character "${updatedCharacter.name}" updated!`);
  };

  const handleCharacterDelete = (characterId: string) => {
    const character = characters.find((c) => c.id === characterId);
    if (!character) return;

    // Remove character from events
    setEvents((prev) =>
      prev
        .map((event) => ({
          ...event,
          characterIds: event.characterIds.filter((id) => id !== characterId),
        }))
        .filter((event) => event.characterIds.length > 0)
    );

    setCharacters((prev) => prev.filter((char) => char.id !== characterId));
    toast.success(`Character "${character.name}" deleted!`);
  };

  const handleCharacterReorder = (reorderedCharacters: Character[]) => {
    setCharacters(reorderedCharacters);
  };

  const handleEventCreate = (eventData: Omit<TimelineEvent, "id">) => {
    const newEvent: TimelineEvent = {
      ...eventData,
      id: Date.now().toString(),
    };
    setEvents((prev) => [...prev, newEvent]);
    toast.success(`Event "${newEvent.title}" created!`);
  };

  const handleEventUpdate = (updatedEvent: TimelineEvent) => {
    setEvents((prev) =>
      prev.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    toast.success(`Event "${updatedEvent.title}" updated!`);
  };

  const handleEventDelete = (eventId: string) => {
    const event = events.find((e) => e.id === eventId);
    setEvents((prev) => prev.filter((event) => event.id !== eventId));
    if (event) {
      toast.success(`Event "${event.title}" deleted!`);
    }
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Character Management Panel */}
      <CharacterPanel
        characters={characters}
        onCharacterCreate={handleCharacterCreate}
        onCharacterUpdate={handleCharacterUpdate}
        onCharacterDelete={handleCharacterDelete}
        onCharacterReorder={handleCharacterReorder}
      />

      {/* Timeline View */}
      <div className="flex-1 flex flex-col">
        <TimelineView
          characters={characters}
          events={events}
          onCharacterUpdate={handleCharacterUpdate}
          onEventCreate={handleEventCreate}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      </div>
    </div>
  );
}

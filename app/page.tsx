"use client";

import { api } from "@/convex/_generated/api";
import { CharacterPanel } from "@/components/character-panel";
import { TimelineView } from "@/components/timeline/timeline-view";
import {
  Character,
  TimelineEvent,
  CharacterInput,
  TimelineEventInput,
} from "@/types/timeline";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

export default function Home() {
  const characters = useQuery(api.characters.get) || [];
  const events = useQuery(api.events.list) || [];

  const createCharacter = useMutation(api.characters.create);
  const updateCharacter = useMutation(api.characters.update);
  const deleteCharacter = useMutation(api.characters.deleteCharacter);
  const reorderCharacters = useMutation(api.characters.reorder);

  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const deleteEvent = useMutation(api.events.deleteEvent);

  const handleCharacterCreate = (characterData: CharacterInput) => {
    createCharacter(characterData).then(() => {
      toast.success(`Character "${characterData.name}" created!`);
    });
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    const { _id, _creationTime, ...rest } = updatedCharacter;
    updateCharacter({ id: _id, ...rest }).then(() => {
      toast.success(`Character "${updatedCharacter.name}" updated!`);
    });
  };

  const handleCharacterDelete = (characterId: string) => {
    const character = characters.find((c) => c._id === characterId);
    if (!character) return;
    deleteCharacter({ id: character._id }).then(() => {
      toast.success(`Character "${character.name}" deleted!`);
    });
  };

  const handleCharacterReorder = (reorderedCharacters: Character[]) => {
    reorderCharacters({
      reorderedCharacters: reorderedCharacters.map(({ _id, order }) => ({
        _id,
        order,
      })),
    });
  };

  const handleEventCreate = (eventData: TimelineEventInput) => {
    createEvent(eventData).then(() => {
      toast.success(`Event "${eventData.title}" created!`);
    });
  };

  const handleEventUpdate = (updatedEvent: TimelineEvent) => {
    const { _id, _creationTime, ...rest } = updatedEvent;
    updateEvent({ id: _id, ...rest }).then(() => {
      toast.success(`Event "${updatedEvent.title}" updated!`);
    });
  };

  const handleEventDelete = (eventId: string) => {
    const event = events.find((e) => e._id === eventId);
    if (!event) return;
    deleteEvent({ id: event._id }).then(() => {
      toast.success(`Event "${event.title}" deleted!`);
    });
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

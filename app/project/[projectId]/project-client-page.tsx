"use client";

import { usePreloadedQuery, useMutation, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CharacterPanel } from "@/components/character-panel";
import { TimelineView } from "@/components/timeline/timeline-view";
import { SpreadsheetView } from "@/components/spreadsheet/spreadsheet-view";
import {
  Character,
  TimelineEvent,
  CharacterInput,
  TimelineEventInput,
} from "@/types/timeline";
import { toast } from "sonner";
import { Id } from "@/convex/_generated/dataModel";
import { useParams } from "next/navigation";
import { useViewStore } from "@/stores/use-view-store";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectClientPage({
  preloadedCharacters,
  preloadedEvents,
}: {
  preloadedCharacters: Preloaded<typeof api.characters.get>;
  preloadedEvents: Preloaded<typeof api.events.list>;
}) {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;

  const characters = usePreloadedQuery(preloadedCharacters) || [];
  const events = usePreloadedQuery(preloadedEvents) || [];

  const { view, setView } = useViewStore();

  const createCharacter = useMutation(api.characters.create);
  const updateCharacter = useMutation(api.characters.update);
  const deleteCharacter = useMutation(api.characters.deleteCharacter);
  const reorderCharacters = useMutation(api.characters.reorder);

  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const deleteEvent = useMutation(api.events.deleteEvent);

  const handleCharacterCreate = (characterData: CharacterInput) => {
    createCharacter({ ...characterData, projectId: projectId }).then(() => {
      toast.success(`Character "${characterData.name}" created!`);
    });
  };

  const handleCharacterUpdate = (updatedCharacter: Character) => {
    const { _id, _creationTime, projectId, ...rest } = updatedCharacter;
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
    createEvent({ ...eventData, projectId: projectId }).then(() => {
      toast.success(`Event "${eventData.title}" created!`);
    });
  };

  const handleEventUpdate = (updatedEvent: TimelineEvent) => {
    const { _id, _creationTime, projectId, ...rest } = updatedEvent;
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
      <CharacterPanel
        characters={characters}
        onCharacterCreate={handleCharacterCreate}
        onCharacterUpdate={handleCharacterUpdate}
        onCharacterDelete={handleCharacterDelete}
        onCharacterReorder={handleCharacterReorder}
      />
      <div className="flex-1 flex flex-col">
        <Tabs value={view} onValueChange={(value) => setView(value as "timeline" | "spreadsheet")} className="h-full flex flex-col">
          <TabsList className="mx-4 mt-4 self-start">
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
            <TabsTrigger value="spreadsheet">Spreadsheet</TabsTrigger>
          </TabsList>
          <TabsContent value="timeline" className="flex-1">
            <TimelineView
              characters={characters}
              events={events}
              onCharacterUpdate={handleCharacterUpdate}
              onEventCreate={handleEventCreate}
              onEventUpdate={handleEventUpdate}
              onEventDelete={handleEventDelete}
              projectId={projectId}
            />
          </TabsContent>
          <TabsContent value="spreadsheet" className="flex-1">
            <SpreadsheetView
              events={events}
              characters={characters}
              onEventUpdate={handleEventUpdate}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

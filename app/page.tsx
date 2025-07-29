"use client";

import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CharacterPanel } from "@/components/character-panel";
import { TimelineView } from "@/components/timeline/timeline-view";
import {
  Character,
  TimelineEvent,
  CharacterInput,
  TimelineEventInput,
} from "@/types/timeline";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Id } from "@/convex/_generated/dataModel";

export default function Home() {
  return (
    <>
      <Authenticated>
        <div className="h-screen flex flex-col">
          <header className="flex items-center justify-between p-4 bg-background border-b">
            <h1 className="text-xl font-bold">Story Studio</h1>
            <UserButton />
          </header>
          <Content />
        </div>
      </Authenticated>
      <Unauthenticated>
        <div className="h-screen flex flex-col items-center justify-center bg-background">
          <h1 className="text-4xl font-bold mb-4">Welcome to Story Studio</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Sign in to create and manage your story timelines.
          </p>
          <SignInButton />
        </div>
      </Unauthenticated>
    </>
  );
}

function Content() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { user } = useUser();
  const getOrCreateUser = useMutation(api.users.getOrCreate);
  const [userId, setUserId] = useState<Id<"users"> | null>(null);

  useEffect(() => {
    if (isLoading || !isAuthenticated || !user) return;
    getOrCreateUser({
      clerkId: user.id,
      name: user.fullName || user.username || "",
    }).then(setUserId);
  }, [isAuthenticated, isLoading, getOrCreateUser, user]);

  const projects = useQuery(api.projects.getForCurrentUser) || [];
  const createProject = useMutation(api.projects.create);
  const [selectedProjectId, setSelectedProjectId] = useState<Id<"projects"> | null>(
    null
  );

  useEffect(() => {
    if (projects.length > 0) {
      setSelectedProjectId(projects[0]._id);
    } else if (userId) {
      createProject({ name: "My First Project" }).then(setSelectedProjectId);
    }
  }, [projects, createProject, userId]);

  const characters =
    useQuery(
      api.characters.get,
      selectedProjectId ? { projectId: selectedProjectId } : "skip"
    ) || [];
  const events =
    useQuery(
      api.events.list,
      selectedProjectId ? { projectId: selectedProjectId } : "skip"
    ) || [];

  const createCharacter = useMutation(api.characters.create);
  const updateCharacter = useMutation(api.characters.update);
  const deleteCharacter = useMutation(api.characters.deleteCharacter);
  const reorderCharacters = useMutation(api.characters.reorder);

  const createEvent = useMutation(api.events.create);
  const updateEvent = useMutation(api.events.update);
  const deleteEvent = useMutation(api.events.deleteEvent);

  const handleCharacterCreate = (characterData: CharacterInput) => {
    if (!selectedProjectId) return;
    createCharacter({ ...characterData, projectId: selectedProjectId }).then(
      () => {
        toast.success(`Character "${characterData.name}" created!`);
      }
    );
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
    if (!selectedProjectId) return;
    createEvent({ ...eventData, projectId: selectedProjectId }).then(() => {
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

  if (!selectedProjectId) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p>Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 bg-gradient-to-br from-background via-background to-secondary/10">
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
          projectId={selectedProjectId}
        />
      </div>
    </div>
  );
}

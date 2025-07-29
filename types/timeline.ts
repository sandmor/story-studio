import type { Doc, Id } from "@/convex/_generated/dataModel";

export type Character = Doc<"characters">;
export type TimelineEvent = Doc<"timeline_events">;

// Type aliases
export type CharacterId = Id<"characters">;
export type TimelineEventId = Id<"timeline_events">;

// Clean input types for creating new entities (without Convex metadata)
export type CharacterInput = Omit<Character, "_id" | "_creationTime" | "projectId"> & { projectId?: Id<"projects"> };
export type TimelineEventInput = Omit<TimelineEvent, "_id" | "_creationTime" | "projectId"> & { projectId?: Id<"projects"> };

// State management types
export interface TimelineState {
  characters: Character[];
  events: TimelineEvent[];
  viewStartTime: number;
  viewEndTime: number;
  selectedEventId: string | null;
  selectedCharacterIds: string[];
}

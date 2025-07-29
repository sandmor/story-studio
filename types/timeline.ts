export interface Character {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  order: number;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  startTime: number; // Custom time unit
  endTime: number;
  characterIds: string[]; // Array of character IDs involved
  color: string;
}

export interface TimelineState {
  characters: Character[];
  events: TimelineEvent[];
  viewStartTime: number;
  viewEndTime: number;
  selectedEventId: string | null;
  selectedCharacterIds: string[];
}

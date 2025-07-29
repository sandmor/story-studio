import React from "react";
import { Character } from "@/types/timeline";

interface CharacterTrackProps {
  character: Character;
  trackIndex: number;
}

export const CharacterTrack: React.FC<CharacterTrackProps> = ({
  trackIndex,
}) => {
  const bgClass =
    trackIndex % 2 === 0 ? "bg-timeline-track" : "bg-timeline-track-alt";

  return (
    <div
      className={`relative h-20 border-b border-timeline-grid ${bgClass} hover:bg-timeline-hover/5 transition-colors`}
    ></div>
  );
};

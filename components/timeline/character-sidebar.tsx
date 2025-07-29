import React from "react";
import { Character } from "@/types/timeline";

interface CharacterSidebarProps {
  characters: Character[];
  leftPanelRef: React.RefObject<HTMLDivElement | null>;
}

export const CharacterSidebar: React.FC<CharacterSidebarProps> = ({
  characters,
  leftPanelRef,
}) => {
  const visibleCharacters = characters
    .filter((char) => char.visible)
    .sort((a, b) => a.order - b.order);

  return (
    <div className="w-64 border-r bg-card/30 backdrop-blur-sm flex flex-col">
      <div className="h-16 border-b flex items-center justify-center bg-muted/50 sticky top-0 z-10">
        <span className="font-semibold text-muted-foreground">Characters</span>
      </div>
      <div ref={leftPanelRef} className="flex-1 overflow-y-auto">
        {visibleCharacters.map((character) => (
          <div
            key={character._id}
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
  );
};

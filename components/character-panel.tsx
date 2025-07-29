import React, { useState } from "react";
import { Character, CharacterInput } from "@/types/timeline";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Plus, Eye, EyeOff, Edit2, Trash2, GripVertical } from "lucide-react";
import { Label } from "@/components/ui/label";
import { ColorPicker, DEFAULT_COLORS } from "@/components/color-picker";

interface CharacterPanelProps {
  characters: Character[];
  onCharacterCreate: (character: CharacterInput) => void;
  onCharacterUpdate: (character: Character) => void;
  onCharacterDelete: (characterId: string) => void;
  onCharacterReorder: (characters: Character[]) => void;
}

export const CharacterPanel: React.FC<CharacterPanelProps> = ({
  characters,
  onCharacterCreate,
  onCharacterUpdate,
  onCharacterDelete,
  onCharacterReorder,
}) => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const [newCharacterName, setNewCharacterName] = useState("");
  const [newCharacterColor, setNewCharacterColor] = useState(DEFAULT_COLORS[2]);

  const handleCreateCharacter = () => {
    if (!newCharacterName.trim()) return;

    const maxOrder = Math.max(0, ...characters.map((c) => c.order));
    onCharacterCreate({
      name: newCharacterName.trim(),
      color: newCharacterColor,
      visible: true,
      order: maxOrder + 1,
    });

    setNewCharacterName("");
    setNewCharacterColor(DEFAULT_COLORS[2]);
    setShowCreateModal(false);
  };

  const handleEditCharacter = (character: Character) => {
    setEditingCharacter(character);
    setNewCharacterName(character.name);
    setNewCharacterColor(character.color);
    setShowCreateModal(true);
  };

  const handleUpdateCharacter = () => {
    if (!editingCharacter || !newCharacterName.trim()) return;

    onCharacterUpdate({
      ...editingCharacter,
      name: newCharacterName.trim(),
      color: newCharacterColor,
    });

    setEditingCharacter(null);
    setNewCharacterName("");
    setNewCharacterColor(DEFAULT_COLORS[2]);
    setShowCreateModal(false);
  };

  const toggleCharacterVisibility = (character: Character) => {
    onCharacterUpdate({
      ...character,
      visible: !character.visible,
    });
  };

  const sortedCharacters = [...characters].sort((a, b) => a.order - b.order);

  return (
    <div className="w-80 border-r bg-card/50 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Characters</h3>
          <Button
            size="sm"
            onClick={() => {
              setEditingCharacter(null);
              setNewCharacterName("");
              setNewCharacterColor(DEFAULT_COLORS[2]);
              setShowCreateModal(true);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Character List */}
      <div className="flex-1 overflow-auto p-2 space-y-2">
        {sortedCharacters.map((character) => (
          <div
            key={character._id}
            className={`p-3 rounded-lg border transition-all ${
              character.visible
                ? "bg-background border-border"
                : "bg-muted/50 border-muted opacity-60"
            }`}
          >
            <div className="flex items-center gap-2">
              <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
              <div
                className="w-4 h-4 rounded-full border"
                style={{ backgroundColor: character.color }}
              />
              <span className="flex-1 font-medium text-sm">
                {character.name}
              </span>

              <div className="flex items-center gap-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleCharacterVisibility(character)}
                  className="w-8 h-8 p-0"
                >
                  {character.visible ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleEditCharacter(character)}
                  className="w-8 h-8 p-0"
                >
                  <Edit2 className="w-4 h-4" />
                </Button>

                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onCharacterDelete(character._id)}
                  className="w-8 h-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}

        {characters.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p className="text-sm">No characters yet</p>
            <p className="text-xs mt-1">
              Add characters to start building your timeline
            </p>
          </div>
        )}
      </div>

      {/* Create/Edit Character Modal */}
      <Dialog
        open={showCreateModal}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            setEditingCharacter(null);
          }
          setShowCreateModal(isOpen);
        }}
      >
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>
              {editingCharacter ? "Edit Character" : "Create Character"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label htmlFor="characterName">Name</Label>
              <Input
                id="characterName"
                value={newCharacterName}
                onChange={(e) => setNewCharacterName(e.target.value)}
                placeholder="e.g., Sir Reginald"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="characterColor">Color</Label>
              <div className="mt-1">
                <ColorPicker
                  value={newCharacterColor}
                  onChange={setNewCharacterColor}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={
                editingCharacter ? handleUpdateCharacter : handleCreateCharacter
              }
              disabled={!newCharacterName.trim()}
            >
              {editingCharacter ? "Update" : "Create"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

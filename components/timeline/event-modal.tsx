import React, { useState, useEffect } from "react";
import { TimelineEvent, Character } from "@/types/timeline";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Type, Text, Clock, Palette, Users } from "lucide-react";
import { ColorPicker, DEFAULT_COLORS } from "@/components/color-picker";

interface EventModalProps {
  event: TimelineEvent | null;
  characters: Character[];
  onSave: (event: Omit<TimelineEvent, "id">) => void;
  onClose: () => void;
  onDelete?: () => void;
}

export const EventModal: React.FC<EventModalProps> = ({
  event,
  characters,
  onSave,
  onClose,
  onDelete,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(1);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>(
    []
  );
  const [color, setColor] = useState(DEFAULT_COLORS[2]);

  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description || "");
      setStartTime(event.startTime);
      setEndTime(event.endTime);
      setSelectedCharacterIds(event.characterIds);
      setColor(event.color);
    } else {
      setTitle("");
      setDescription("");
      setStartTime(0);
      setEndTime(1);
      setSelectedCharacterIds([]);
      setColor(DEFAULT_COLORS[2]);
    }
  }, [event]);

  const handleSave = () => {
    if (!title.trim() || selectedCharacterIds.length === 0) return;

    onSave({
      title: title.trim(),
      description: description.trim(),
      startTime,
      endTime: Math.max(endTime, startTime + 0.1),
      characterIds: selectedCharacterIds,
      color: color,
    });
  };

  const handleCharacterToggle = (characterId: string) => {
    setSelectedCharacterIds((prev) =>
      prev.includes(characterId)
        ? prev.filter((id) => id !== characterId)
        : [...prev, characterId]
    );
  };

  const isValid = title.trim() && selectedCharacterIds.length > 0;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{event ? "Edit Event" : "Create Event"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="space-y-2">
            <Label htmlFor="title">
              <Type className="w-4 h-4 inline-block mr-2" />
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., The Grand Coronation"
              className="mt-1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              <Text className="w-4 h-4 inline-block mr-2" />
              Description
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A brief summary of what happens in this event..."
              className="mt-1"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">
                <Clock className="w-4 h-4 inline-block mr-2" />
                Start Time
              </Label>
              <Input
                id="startTime"
                type="number"
                value={startTime}
                onChange={(e) => setStartTime(Number(e.target.value))}
                className="mt-1"
                step="0.1"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">
                <Clock className="w-4 h-4 inline-block mr-2" />
                End Time
              </Label>
              <Input
                id="endTime"
                type="number"
                value={endTime}
                onChange={(e) => setEndTime(Number(e.target.value))}
                className="mt-1"
                step="0.1"
                min={startTime + 0.1}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              <Users className="w-4 h-4 inline-block mr-2" />
              Characters Involved
            </Label>
            <div className="mt-2 p-2 border rounded-md max-h-36 overflow-y-auto">
              <div className="grid grid-cols-2 gap-2">
                {characters.map((character) => (
                  <div
                    key={character.id}
                    className="flex items-center space-x-2 p-1 rounded-md hover:bg-accent"
                  >
                    <Checkbox
                      id={`char-${character.id}`}
                      checked={selectedCharacterIds.includes(character.id)}
                      onCheckedChange={() =>
                        handleCharacterToggle(character.id)
                      }
                    />
                    <Label
                      htmlFor={`char-${character.id}`}
                      className="flex items-center gap-2 text-sm font-normal cursor-pointer"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: character.color }}
                      />
                      {character.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">
              <Palette className="w-4 h-4 inline-block mr-2" />
              Event Color
            </Label>
            <ColorPicker value={color} onChange={setColor} />
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {onDelete && event && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDelete}
                className="text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="w-5 h-5" />
                <span className="sr-only">Delete Event</span>
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!isValid}>
              {event ? "Update Event" : "Create Event"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

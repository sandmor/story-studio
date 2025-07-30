import React, { useState, useEffect } from "react";
import {
  TimelineEvent,
  Character,
  CharacterId,
  TimelineEventInput,
} from "@/types/timeline";
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
import { Id } from "@/convex/_generated/dataModel";

interface EventModalProps {
  event: TimelineEvent | null;
  characters: Character[];
  onSave: (event: TimelineEventInput) => void;
  onClose: () => void;
  onDelete?: () => void;
  projectId: Id<"projects">;
  isOpen: boolean;
}

const DEFAULT_EVENT_STATE = {
  title: "",
  description: "",
  startTime: 0,
  endTime: 1,
  participants: [],
  color: DEFAULT_COLORS[2],
};

export const EventModal: React.FC<EventModalProps> = ({
  event,
  characters,
  onSave,
  onClose,
  onDelete,
  projectId,
  isOpen,
}) => {
  const [formState, setFormState] = useState<Omit<TimelineEventInput, "projectId">>(DEFAULT_EVENT_STATE);

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setFormState({
          title: event.title,
          description: event.description,
          startTime: event.startTime,
          endTime: event.endTime,
          participants: event.participants,
          color: event.color,
        });
      } else {
        setFormState(DEFAULT_EVENT_STATE);
      }
    }
  }, [isOpen, event]);

  const handleSave = () => {
    if (!formState.title.trim() || formState.participants.length === 0) return;

    onSave({
      ...formState,
      endTime: Math.max(formState.endTime, formState.startTime + 0.1),
      projectId,
    });
  };

  const handleCharacterToggle = (characterId: CharacterId) => {
    setFormState((prev) => ({
      ...prev,
      participants: prev.participants.includes(characterId)
        ? prev.participants.filter((id) => id !== characterId)
        : [...prev.participants, characterId],
    }));
  };

  const handleInputChange = (
    field: keyof typeof formState,
    value: string | number
  ) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const isValid = formState.title.trim() && formState.participants.length > 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
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
              value={formState.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
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
              value={formState.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
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
                value={formState.startTime}
                onChange={(e) =>
                  handleInputChange("startTime", Number(e.target.value))
                }
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
                value={formState.endTime}
                onChange={(e) =>
                  handleInputChange("endTime", Number(e.target.value))
                }
                className="mt-1"
                step="0.1"
                min={formState.startTime + 0.1}
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
                    key={character._id}
                    className="flex items-center space-x-2 p-1 rounded-md hover:bg-accent"
                  >
                    <Checkbox
                      id={`char-${character._id}`}
                      checked={formState.participants.includes(character._id)}
                      onCheckedChange={() =>
                        handleCharacterToggle(character._id)
                      }
                    />
                    <Label
                      htmlFor={`char-${character._id}`}
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
            <ColorPicker
              value={formState.color}
              onChange={(color) => handleInputChange("color", color)}
            />
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

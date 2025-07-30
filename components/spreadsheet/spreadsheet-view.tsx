"use client";

import React, { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Character, TimelineEvent } from "@/types/timeline";
import { EditableTableCell } from "./editable-table-cell";
import { Id } from "@/convex/_generated/dataModel";
import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpreadsheetViewProps {
  events: TimelineEvent[];
  characters: Character[];
  onEventUpdate: (event: TimelineEvent) => void;
}

type SortableKey = keyof TimelineEvent | "duration";

export const SpreadsheetView: React.FC<SpreadsheetViewProps> = ({
  events,
  characters,
  onEventUpdate,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: SortableKey;
    direction: "ascending" | "descending";
  } | null>({ key: "startTime", direction: "ascending" });

  const handleSave = (
    eventId: Id<"timeline_events">,
    field: keyof TimelineEvent,
    value: string | number
  ) => {
    const eventToUpdate = events.find((e) => e._id === eventId);
    if (eventToUpdate) {
      const updatedValue =
        typeof eventToUpdate[field] === "number" ? Number(value) : value;
      const updatedEvent = { ...eventToUpdate, [field]: updatedValue };
      onEventUpdate(updatedEvent);
    }
  };

  const getCharacterName = (characterId: Id<"characters">) => {
    const character = characters.find((c) => c._id === characterId);
    return character ? character.name : "Unknown";
  };

  const sortedEvents = useMemo(() => {
    let sortableItems = [...events];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        if (sortConfig.key === "duration") {
          aValue = a.endTime - a.startTime;
          bValue = b.endTime - b.startTime;
        } else {
          aValue = a[sortConfig.key as keyof TimelineEvent];
          bValue = b[sortConfig.key as keyof TimelineEvent];
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [events, sortConfig]);

  const requestSort = (key: SortableKey) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const renderHeader = (key: SortableKey, label: string, className?: string) => {
    const isSorted = sortConfig?.key === key;
    const SortIcon =
      sortConfig?.direction === "ascending" ? ArrowUp : ArrowDown;

    return (
      <TableHead className={className}>
        <Button variant="ghost" onClick={() => requestSort(key)} className="px-2 py-1">
          {label}
          <div className="w-5 h-5 ml-2">
            {isSorted ? (
              <SortIcon className="h-4 w-4" />
            ) : (
              <ChevronsUpDown className="h-4 w-4 text-muted-foreground/50" />
            )}
          </div>
        </Button>
      </TableHead>
    );
  };

  return (
    <div className="h-full overflow-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {renderHeader("title", "Title", "w-[200px]")}
            {renderHeader("startTime", "Start Time")}
            {renderHeader("endTime", "End Time")}
            {renderHeader("duration", "Duration")}
            {renderHeader("description", "Description", "w-[400px]")}
            {renderHeader("participants", "Participants")}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedEvents.map((event) => (
            <TableRow key={event._id}>
              <TableCell>
                <EditableTableCell
                  value={event.title}
                  onSave={(value) => handleSave(event._id, "title", value)}
                />
              </TableCell>
              <TableCell>
                <EditableTableCell
                  value={String(event.startTime)}
                  onSave={(value) => handleSave(event._id, "startTime", value)}
                />
              </TableCell>
              <TableCell>
                <EditableTableCell
                  value={String(event.endTime)}
                  onSave={(value) => handleSave(event._id, "endTime", value)}
                />
              </TableCell>
              <TableCell>{event.endTime - event.startTime}</TableCell>
              <TableCell>
                <EditableTableCell
                  value={event.description}
                  onSave={(value) =>
                    handleSave(event._id, "description", value)
                  }
                  type="textarea"
                />
              </TableCell>
              <TableCell>
                {event.participants
                  .map((id: Id<"characters">) => getCharacterName(id))
                  .join(", ")}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

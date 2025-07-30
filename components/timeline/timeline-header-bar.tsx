import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

interface TimelineHeaderBarProps {
  onCreateEvent: () => void;
  projectId: Id<"projects">;
}

export const TimelineHeaderBar: React.FC<TimelineHeaderBarProps> = ({
  onCreateEvent,
  projectId,
}) => {
  return (
    <div className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-20">
      <div className="flex items-center justify-between p-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Timeline Manager
        </h2>
        <div className="flex gap-2">
          <Button onClick={onCreateEvent} className="gap-2" size="sm">
            <Plus className="w-4 h-4" />
            Add Event
          </Button>
          <Link href={`/project/${projectId}/settings`}>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

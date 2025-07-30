"use client";

import { usePreloadedQuery, useMutation, Preloaded } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export default function DashboardClientPage({
  preloaded,
}: {
  preloaded: Preloaded<typeof api.projects.getForCurrentUser>;
}) {
  const projects = usePreloadedQuery(preloaded);
  const createProject = useMutation(api.projects.create);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreateDialogOpen, setCreateDialogOpen] = useState(false);

  const handleCreateProject = async () => {
    if (!newProjectName.trim()) return;
    try {
      await createProject({ name: newProjectName.trim() });
      toast.success("Project created successfully!");
      setNewProjectName("");
      setCreateDialogOpen(false);
    } catch (error) {
      toast.error("Failed to create project.");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Your Projects</h1>
        <Dialog open={isCreateDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a new project</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="col-span-3"
                  placeholder="My Awesome Story"
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleCreateProject}>Create</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border-dashed border-2 rounded-lg">
          <h2 className="text-xl font-semibold">No projects yet</h2>
          <p className="text-muted-foreground mt-2">
            Get started by creating your first project.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {projects.map((project) => (
            <Link href={`/project/${project._id}`} key={project._id}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                  <CardDescription>
                    Last modified:{" "}
                    {new Date(project._creationTime).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Click to open the timeline.
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
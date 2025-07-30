"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function ProjectSettingsPage() {
  const params = useParams();
  const projectId = params.projectId as Id<"projects">;
  const project = useQuery(api.projects.get, { id: projectId });
  const updateProject = useMutation(api.projects.update);
  const deleteProject = useMutation(api.projects.deleteProject);
  const router = useRouter();
  const [projectName, setProjectName] = useState("");

  useEffect(() => {
    if (project) {
      setProjectName(project.name);
    }
  }, [project]);

  const handleRenameProject = async () => {
    if (!projectName.trim() || !project) return;
    try {
      await updateProject({ id: project._id, name: projectName.trim() });
      toast.success("Project renamed successfully!");
    } catch (error) {
      toast.error("Failed to rename project.");
    }
  };

  const handleDeleteProject = async () => {
    if (!project) return;
    try {
      await deleteProject({ id: project._id });
      toast.success("Project deleted successfully!");
      router.push("/dashboard");
    } catch (error) {
      toast.error("Failed to delete project.");
    }
  };

  if (!project) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">
        Settings for {project.name}
      </h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Rename Project</CardTitle>
            <CardDescription>
              Change the name of your project.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleRenameProject}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle>Delete Project</CardTitle>
            <CardDescription>
              Permanently delete this project and all of its data. This action
              cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Project</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your project and remove your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteProject}>
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

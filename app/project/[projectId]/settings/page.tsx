import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import SettingsClientPage from "./settings-client-page";
import { Id } from "@/convex/_generated/dataModel";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: Id<"projects"> }>;
}) {
  const { projectId } = await params;
  const preloadedProject = await preloadQuery(api.projects.get, {
    id: projectId,
  });
  return <SettingsClientPage preloadedProject={preloadedProject} />;
}

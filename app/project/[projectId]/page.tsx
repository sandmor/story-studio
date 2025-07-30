import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import ProjectClientPage from "./project-client-page";
import { Id } from "@/convex/_generated/dataModel";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ projectId: Id<"projects"> }>;
}) {
  const { projectId } = await params;

  const preloadedCharacters = await preloadQuery(api.characters.get, {
    projectId,
  });
  const preloadedEvents = await preloadQuery(api.events.list, {
    projectId,
  });
  return (
    <ProjectClientPage
      preloadedCharacters={preloadedCharacters}
      preloadedEvents={preloadedEvents}
    />
  );
}

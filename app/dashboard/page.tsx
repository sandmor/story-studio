import { preloadQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import DashboardClientPage from "./dashboard-client-page";

export default async function DashboardPage() {
  const preloaded = await preloadQuery(api.projects.getForCurrentUser);
  return <DashboardClientPage preloaded={preloaded} />;
}

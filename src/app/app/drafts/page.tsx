import type { Metadata } from "next";
import { DraftsView } from "@/components/app/drafts-view";

export const metadata: Metadata = { title: "Drafts" };

export default function DraftsPage() {
  return <DraftsView />;
}

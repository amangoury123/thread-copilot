import type { Metadata } from "next";
import { DraftEditor } from "@/components/app/draft-editor";

export const metadata: Metadata = { title: "Edit draft" };

export default async function DraftPage({ params }: PageProps<"/app/drafts/[id]">) {
  const { id } = await params;
  return <DraftEditor id={id} />;
}

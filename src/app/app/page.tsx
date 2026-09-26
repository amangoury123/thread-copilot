import type { Metadata } from "next";
import { GenerateView } from "@/components/app/generate-view";

export const metadata: Metadata = { title: "Generate" };

export default function GeneratePage() {
  return <GenerateView />;
}

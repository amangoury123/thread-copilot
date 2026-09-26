import type { Metadata } from "next";
import { OptimizeView } from "@/components/app/optimize-view";

export const metadata: Metadata = { title: "Optimize" };

export default function OptimizePage() {
  return <OptimizeView />;
}

import Link from "next/link";
import { MessageSquareTextIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  href?: string;
  className?: string;
  onClick?: () => void;
}

export function Logo({ href = "/", className, onClick }: LogoProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn("flex items-center gap-2 font-semibold tracking-tight", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm shadow-primary/30">
        <MessageSquareTextIcon className="size-4" />
      </span>
      <span>Thread Copilot</span>
    </Link>
  );
}

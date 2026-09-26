"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileTextIcon, SettingsIcon, SparklesIcon, WandSparklesIcon } from "lucide-react";
import { Logo } from "@/components/brand/logo";
import { PREVIEW_AUTHOR } from "@/components/thread/tweet-card";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { UsageMeter } from "./usage-meter";

const NAV_ITEMS = [
  { href: "/app", label: "Generate", icon: SparklesIcon },
  { href: "/app/optimize", label: "Optimize", icon: WandSparklesIcon },
  { href: "/app/drafts", label: "Drafts", icon: FileTextIcon },
  { href: "/app/settings", label: "Settings", icon: SettingsIcon },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/app" ? pathname === "/app" : pathname.startsWith(href);
}

/** Shared between the desktop sidebar and the mobile Sheet. */
export function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col gap-6 p-4">
      <Logo href="/app" onClick={onNavigate} className="px-2 pt-1" />

      <nav className="flex flex-col gap-1" aria-label="Main">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-3">
        <UsageMeter />
        <div className="flex items-center gap-3 px-1">
          <Avatar className="size-8">
            <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
              {PREVIEW_AUTHOR.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1 text-sm leading-tight">
            <p className="truncate font-medium">{PREVIEW_AUTHOR.name}</p>
            <p className="truncate text-muted-foreground">{PREVIEW_AUTHOR.handle}</p>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r bg-sidebar lg:block">
      <SidebarContent />
    </aside>
  );
}

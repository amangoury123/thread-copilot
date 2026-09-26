"use client";

import { useState, useSyncExternalStore, type FormEvent } from "react";
import { Loader2Icon, MonitorIcon, MoonIcon, RotateCcwIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { resetDemoData } from "@/lib/api/threads";
import { PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";
import { PREVIEW_AUTHOR } from "@/components/thread/tweet-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "./page-header";
import { UsageMeter } from "./usage-meter";
import { useUsage } from "./usage-provider";

const THEMES = [
  { value: "light", label: "Light", icon: SunIcon },
  { value: "dark", label: "Dark", icon: MoonIcon },
  { value: "system", label: "System", icon: MonitorIcon },
] as const;

const noopSubscribe = () => () => {};

export function SettingsView() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Manage your profile, plan, and preferences." />
      <div className="space-y-6">
        <ProfileSection />
        <PlanSection />
        <AppearanceSection />
        <DemoDataSection />
      </div>
    </div>
  );
}

function ProfileSection() {
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    toast.success("Profile saved", { description: "Profiles will sync once accounts are live." });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is how you appear in thread previews.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
            <Avatar className="size-14">
              <AvatarFallback className="bg-primary/10 text-lg font-medium text-primary">
                {PREVIEW_AUTHOR.initials}
              </AvatarFallback>
            </Avatar>
            <Button type="button" variant="outline" size="sm" disabled>
              Change photo
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue={PREVIEW_AUTHOR.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="handle">X handle</Label>
              <Input id="handle" defaultValue={PREVIEW_AUTHOR.handle} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" defaultValue="you@example.com" disabled />
          </div>
          <Button type="submit">Save profile</Button>
        </form>
      </CardContent>
    </Card>
  );
}

function PlanSection() {
  const { usage } = useUsage();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Plan
          {usage ? (
            <Badge variant={usage.plan === "pro" ? "default" : "secondary"}>
              {PLANS[usage.plan].name}
            </Badge>
          ) : (
            <Skeleton className="h-5 w-12 rounded-full" />
          )}
        </CardTitle>
        <CardDescription>
          Free includes 5 threads per month. Pro is unlimited for {PLANS.pro.price}
          {PLANS.pro.period}.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UsageMeter className="bg-muted/30" />
      </CardContent>
    </Card>
  );
}

function AppearanceSection() {
  const { theme, setTheme } = useTheme();
  // The active theme is only known on the client; avoid highlighting anything during SSR.
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose light, dark, or follow your system setting.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Theme">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = mounted && theme === value;
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => {
                  setTheme(value);
                  toast.success(`Theme set to ${label.toLowerCase()}`);
                }}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border p-4 text-sm transition-colors",
                  active
                    ? "border-primary bg-primary/5 text-primary"
                    : "hover:border-foreground/20 hover:bg-muted/50",
                )}
              >
                <Icon className="size-5" />
                {label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function DemoDataSection() {
  const { refreshUsage } = useUsage();
  const [resetting, setResetting] = useState(false);

  async function handleReset() {
    setResetting(true);
    try {
      await resetDemoData();
      await refreshUsage();
      toast.success("Demo data reset", { description: "Sample drafts and usage restored." });
    } finally {
      setResetting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Demo data</CardTitle>
        <CardDescription>
          Everything is stored in this browser until accounts are live. Reset to restore the sample
          drafts and usage.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="outline" onClick={() => void handleReset()} disabled={resetting}>
          {resetting ? <Loader2Icon className="animate-spin" /> : <RotateCcwIcon />}
          Reset demo data
        </Button>
      </CardContent>
    </Card>
  );
}

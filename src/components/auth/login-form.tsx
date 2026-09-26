"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MailIcon } from "lucide-react";
import { toast } from "sonner";
import { GoogleIcon } from "@/components/brand/icons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

// UI only: auth arrives with Supabase. Every path just goes to /app for now.
export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  function handleGoogle() {
    router.push("/app");
  }

  function handleMagicLink(event: FormEvent) {
    event.preventDefault();
    toast.success("Magic link sent", { description: `Demo mode: signing you in as ${email}.` });
    router.push("/app");
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome to Thread Copilot</CardTitle>
        <CardDescription>Log in or create an account to start writing.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <Button type="button" variant="outline" size="lg" className="w-full" onClick={handleGoogle}>
          <GoogleIcon className="size-4" />
          Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <Separator className="flex-1" />
          <span className="text-xs text-muted-foreground">or</span>
          <Separator className="flex-1" />
        </div>

        <form onSubmit={handleMagicLink} className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <Button type="submit" size="lg" className="w-full">
            <MailIcon />
            Send magic link
          </Button>
        </form>

        <p className="text-center text-xs text-muted-foreground">
          By continuing you agree to our Terms and Privacy Policy.{" "}
          <Link href="/pricing" className="text-primary hover:underline">
            See pricing
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}

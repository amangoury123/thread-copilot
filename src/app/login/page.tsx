import type { Metadata } from "next";
import { Logo } from "@/components/brand/logo";
import { LoginForm } from "@/components/auth/login-form";
import { ThemeToggle } from "@/components/theme/theme-toggle";

export const metadata: Metadata = { title: "Log in" };

export default function LoginPage() {
  return (
    <div className="relative flex min-h-dvh flex-col">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(ellipse_at_top,var(--color-primary)_0%,transparent_65%)] opacity-10"
      />
      <header className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Logo />
        <ThemeToggle />
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <LoginForm />
      </main>
    </div>
  );
}

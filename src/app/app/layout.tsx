import { MobileNav } from "@/components/app/mobile-nav";
import { Sidebar } from "@/components/app/sidebar";
import { UsageProvider } from "@/components/app/usage-provider";

export default function AppLayout({ children }: LayoutProps<"/app">) {
  return (
    <UsageProvider>
      <div className="flex min-h-dvh w-full">
        <Sidebar />
        <div className="flex min-w-0 flex-1 flex-col">
          <MobileNav />
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            {children}
          </main>
        </div>
      </div>
    </UsageProvider>
  );
}

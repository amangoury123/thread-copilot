import { Skeleton } from "@/components/ui/skeleton";

export function ThreadSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card" aria-busy="true" aria-label="Loading thread">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="flex gap-3 px-4 pt-4 pb-3">
          <div className="flex flex-col items-center">
            <Skeleton className="size-10 rounded-full" />
            {i < count - 1 && <div className="mt-1 w-0.5 flex-1 rounded-full bg-border" />}
          </div>
          <div className="flex-1 space-y-2.5 pb-2">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-3.5 w-20" />
              <Skeleton className="ml-auto h-4 w-9 rounded-full" />
            </div>
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-11/12" />
            <Skeleton className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

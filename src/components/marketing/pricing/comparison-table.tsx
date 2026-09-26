import { CheckIcon, MinusIcon } from "lucide-react";
import { COMPARISON_ROWS, PLAN_ORDER, PLANS } from "@/lib/plans";
import { cn } from "@/lib/utils";

export function ComparisonTable() {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card">
      <table className="w-full min-w-[560px] border-collapse text-sm">
        <caption className="sr-only">Plan feature comparison</caption>
        <thead>
          <tr className="border-b">
            <th scope="col" className="sticky left-0 z-10 bg-card px-4 py-4 text-left font-medium text-muted-foreground">
              Features
            </th>
            {PLAN_ORDER.map((id) => (
              <th
                key={id}
                scope="col"
                className={cn("px-4 py-4 text-center font-semibold", PLANS[id].highlighted && "text-primary")}
              >
                {PLANS[id].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row.label} className="border-b last:border-b-0">
              <th scope="row" className="sticky left-0 z-10 bg-card px-4 py-3 text-left font-normal">
                <span className="block">{row.label}</span>
                {row.note && <span className="block text-xs text-muted-foreground">{row.note}</span>}
              </th>
              {PLAN_ORDER.map((id) => {
                const value = row.values[id];
                return (
                  <td
                    key={id}
                    className={cn("px-4 py-3 text-center", PLANS[id].highlighted && "bg-primary/[0.03]")}
                  >
                    {value === true ? (
                      <CheckIcon className="mx-auto size-4 text-primary" aria-label="Included" />
                    ) : value === false ? (
                      <MinusIcon className="mx-auto size-4 text-muted-foreground/50" aria-label="Not included" />
                    ) : (
                      <span className="font-medium tabular-nums">{value}</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

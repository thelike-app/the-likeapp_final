import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export type SportType = "NBA" | "Football";

interface SportToggleProps {
  selected: SportType;
  onChange: (sport: SportType) => void;
}

export function SportToggle({ selected, onChange }: SportToggleProps) {
  return (
    <div className="flex items-center justify-center gap-0 border border-border">
      <button
        onClick={() => onChange("NBA")}
        className={cn(
          "px-6 py-2 text-sm font-medium transition-all duration-200",
          selected === "NBA"
            ? "bg-foreground text-background"
            : "bg-background text-muted-foreground hover:text-foreground"
        )}
      >
        NBA
      </button>
      <button
        disabled
        className="px-6 py-2 text-sm font-medium transition-all duration-200 border-l border-border bg-background text-muted-foreground/50 cursor-not-allowed relative"
      >
        <span className="line-through">Football</span>
        <X className="w-3 h-3 absolute top-1 right-1 text-muted-foreground/50" />
      </button>
    </div>
  );
}

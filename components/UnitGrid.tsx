import { cn } from "@/lib/utils";

interface UnitGridProps {
  sqFt: number;
  className?: string;
  cellClassName?: string;
  maxCells?: number;
}

/**
 * Renders a literal grid of unit squares to represent square footage —
 * the signature visual device for the product (we sell space, so we show space).
 * Each visible cell represents a chunk of sqFt, scaled so the grid stays readable.
 */
export default function UnitGrid({
  sqFt,
  className,
  cellClassName,
  maxCells = 40,
}: UnitGridProps) {
  const unit = Math.max(1, Math.ceil(sqFt / maxCells));
  const cellCount = Math.min(maxCells, Math.round(sqFt / unit));
  const cols = Math.ceil(Math.sqrt(cellCount * 1.6));

  return (
    <div
      className={cn("grid gap-[3px]", className)}
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      role="img"
      aria-label={`${sqFt} square feet, shown as a scaled grid`}
    >
      {Array.from({ length: cellCount }).map((_, i) => (
        <div
          key={i}
          className={cn("aspect-square rounded-[2px] bg-magenta/80", cellClassName)}
        />
      ))}
    </div>
  );
}

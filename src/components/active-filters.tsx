"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Item } from "@/lib/boss-data";

interface ActiveFiltersProps {
  selectedLevels: number[];
  selectedTypes: string[];
  selectedRegions: string[];
  selectedItem: Item | null;
  onClearLevels: () => void;
  onClearTypes: () => void;
  onClearRegions: () => void;
  onClearItem: () => void;
  onClearAll: () => void;
  totalResults: number;
}

export function ActiveFilters({
  selectedLevels,
  selectedTypes,
  selectedRegions,
  selectedItem,
  onClearLevels,
  onClearTypes,
  onClearRegions,
  onClearItem,
  onClearAll,
  totalResults,
}: ActiveFiltersProps) {
  const hasFilters =
    selectedLevels.length > 0 ||
    selectedTypes.length > 0 ||
    selectedRegions.length > 0 ||
    selectedItem;

  if (!hasFilters) {
    return (
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <span>Showing all {totalResults} bosses</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {totalResults} boss{totalResults !== 1 ? "es" : ""} found
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAll}
          className="text-xs h-7"
        >
          Clear all
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {selectedLevels.length > 0 && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">
            <span>
              {selectedLevels.length} level range
              {selectedLevels.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={onClearLevels}
              className="hover:bg-primary/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {selectedTypes.length > 0 && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-accent/20 text-accent border border-accent/30">
            <span>{selectedTypes.join(", ")}</span>
            <button
              onClick={onClearTypes}
              className="hover:bg-accent/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {selectedRegions.length > 0 && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-secondary text-secondary-foreground border border-border">
            <span>
              {selectedRegions.length} region
              {selectedRegions.length > 1 ? "s" : ""}
            </span>
            <button
              onClick={onClearRegions}
              className="hover:bg-muted rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}

        {selectedItem && (
          <div className="flex items-center gap-1 text-xs px-2 py-1 rounded bg-primary/20 text-primary border border-primary/30">
            <span>{selectedItem.icon}</span>
            <span>{selectedItem.name}</span>
            <button
              onClick={onClearItem}
              className="hover:bg-primary/20 rounded p-0.5"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

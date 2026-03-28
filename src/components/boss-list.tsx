"use client";

import { type Boss } from "@/lib/boss-data";
import { BossCard } from "./boss-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface BossListProps {
  bosses: Boss[];
  onBossSelect: (boss: Boss) => void;
  selectedBoss?: Boss | null;
}

export function BossList({
  bosses,
  onBossSelect,
  selectedBoss,
}: BossListProps) {
  if (bosses.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No bosses match your filters</p>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Try adjusting your search criteria
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-100 pr-4">
      <div className="space-y-2">
        {bosses.map((boss) => (
          <div
            key={boss.id}
            onClick={() => onBossSelect(boss)}
            className={`transition-all ${
              selectedBoss?.id === boss.id
                ? "ring-2 ring-primary rounded-lg"
                : ""
            }`}
          >
            <BossCard boss={boss} compact />
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

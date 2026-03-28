"use client";

import { useState, useMemo } from "react";
import { SearchPanel } from "./search-panel";
import { LevelFilter } from "./level-filter";
import { BossList } from "./boss-list";
import { ActiveFilters } from "./active-filters";
import { bosses, getBossesByItem, type Boss, type Item } from "@/lib/boss-data";

interface SidebarProps {
  selectedBoss: Boss | null;
  onBossSelect: (boss: Boss | null) => void;
}

export function Sidebar({ selectedBoss, onBossSelect }: SidebarProps) {
  const [selectedLevelRanges, setSelectedLevelRanges] = useState<
    { min: number; max: number }[]
  >([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const handleLevelToggle = (min: number, max: number) => {
    setSelectedLevelRanges((prev) => {
      const exists = prev.some((r) => r.min === min && r.max === max);
      if (exists) {
        return prev.filter((r) => !(r.min === min && r.max === max));
      }
      return [...prev, { min, max }];
    });
  };

  const handleTypeToggle = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type],
    );
  };

  const handleRegionToggle = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region)
        ? prev.filter((r) => r !== region)
        : [...prev, region],
    );
  };

  const handleItemSelect = (item: Item) => {
    setSelectedItem(item);
  };

  const handleBossSelect = (boss: Boss) => {
    onBossSelect(boss);
  };

  const filteredBosses = useMemo(() => {
    let result = bosses;

    // Filter by item drop
    if (selectedItem) {
      result = getBossesByItem(selectedItem.id);
    }

    // Filter by level ranges
    if (selectedLevelRanges.length > 0) {
      result = result.filter((boss) =>
        selectedLevelRanges.some(
          (range) => boss.level >= range.min && boss.level <= range.max,
        ),
      );
    }

    // Filter by type
    if (selectedTypes.length > 0) {
      result = result.filter((boss) => selectedTypes.includes(boss.type));
    }

    // Filter by region
    if (selectedRegions.length > 0) {
      result = result.filter((boss) => selectedRegions.includes(boss.region));
    }

    return result;
  }, [selectedLevelRanges, selectedTypes, selectedRegions, selectedItem]);

  const selectedLevels = selectedLevelRanges.flatMap((r) => [r.min, r.max]);

  return (
    <div className="w-full lg:w-96 space-y-4 overflow-hidden">
      <SearchPanel
        onBossSelect={handleBossSelect}
        onItemSelect={handleItemSelect}
      />

      <LevelFilter
        selectedLevels={selectedLevels}
        onLevelToggle={handleLevelToggle}
        selectedTypes={selectedTypes}
        onTypeToggle={handleTypeToggle}
        selectedRegions={selectedRegions}
        onRegionToggle={handleRegionToggle}
      />

      <div className="bg-card rounded-lg border border-border p-4">
        <ActiveFilters
          selectedLevels={selectedLevels}
          selectedTypes={selectedTypes}
          selectedRegions={selectedRegions}
          selectedItem={selectedItem}
          onClearLevels={() => setSelectedLevelRanges([])}
          onClearTypes={() => setSelectedTypes([])}
          onClearRegions={() => setSelectedRegions([])}
          onClearItem={() => setSelectedItem(null)}
          onClearAll={() => {
            setSelectedLevelRanges([]);
            setSelectedTypes([]);
            setSelectedRegions([]);
            setSelectedItem(null);
          }}
          totalResults={filteredBosses.length}
        />

        <div className="mt-4 pt-4 border-t border-border">
          <BossList
            bosses={filteredBosses}
            onBossSelect={handleBossSelect}
            selectedBoss={selectedBoss}
          />
        </div>
      </div>
    </div>
  );
}

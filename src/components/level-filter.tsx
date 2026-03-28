"use client";

import { levelRanges, bossTypes, regions } from "@/lib/boss-data";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ChevronDown, ChevronUp, Skull, Shield, MapPin } from "lucide-react";
import { useState } from "react";

interface LevelFilterProps {
  selectedLevels: number[];
  onLevelToggle: (min: number, max: number) => void;
  selectedTypes: string[];
  onTypeToggle: (type: string) => void;
  selectedRegions: string[];
  onRegionToggle: (region: string) => void;
}

export function LevelFilter({
  selectedLevels,
  onLevelToggle,
  selectedTypes,
  onTypeToggle,
  selectedRegions,
  onRegionToggle,
}: LevelFilterProps) {
  const [expandedSections, setExpandedSections] = useState({
    level: true,
    type: true,
    region: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const isLevelRangeSelected = (min: number, max: number) => {
    return selectedLevels.some((lvl) => lvl >= min && lvl <= max);
  };

  return (
    <div className="bg-card rounded-lg border border-border p-4 space-y-4">
      {/* Level Range Section */}
      <div>
        <button
          onClick={() => toggleSection("level")}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <div className="flex items-center gap-2">
            <Skull className="h-4 w-4 text-primary" />
            <h3 className="font-(family-name:--font-cinzel) text-sm font-semibold text-foreground">
              Level Range
            </h3>
          </div>
          {expandedSections.level ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {expandedSections.level && (
          <div className="space-y-2">
            {levelRanges.map((range) => (
              <div key={range.label} className="flex items-center gap-2">
                <Checkbox
                  id={`level-${range.min}-${range.max}`}
                  checked={isLevelRangeSelected(range.min, range.max)}
                  onCheckedChange={() => onLevelToggle(range.min, range.max)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`level-${range.min}-${range.max}`}
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex-1"
                >
                  {range.label}
                </Label>
                <span className="text-xs text-muted-foreground/60">
                  ({range.min}-{range.max})
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Boss Type Section */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => toggleSection("type")}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-accent" />
            <h3 className="font-(family-name:--font-cinzel) text-sm font-semibold text-foreground">
              Boss Type
            </h3>
          </div>
          {expandedSections.type ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {expandedSections.type && (
          <div className="space-y-2">
            {bossTypes.map((type) => (
              <div key={type.value} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type.value}`}
                  checked={selectedTypes.includes(type.value)}
                  onCheckedChange={() => onTypeToggle(type.value)}
                  className="border-border data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                />
                <Label
                  htmlFor={`type-${type.value}`}
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer flex-1"
                >
                  {type.label}
                </Label>
                <div
                  className={`w-2 h-2 rounded-full ${
                    type.value === "epic"
                      ? "bg-accent"
                      : type.value === "raid"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                  }`}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Region Section */}
      <div className="border-t border-border pt-4">
        <button
          onClick={() => toggleSection("region")}
          className="flex items-center justify-between w-full text-left mb-3"
        >
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            <h3 className="font-(family-name:--font-cinzel) text-sm font-semibold text-foreground">
              Region
            </h3>
          </div>
          {expandedSections.region ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        {expandedSections.region && (
          <div className="space-y-2 max-h-50 overflow-y-auto">
            {regions.map((region) => (
              <div key={region} className="flex items-center gap-2">
                <Checkbox
                  id={`region-${region}`}
                  checked={selectedRegions.includes(region)}
                  onCheckedChange={() => onRegionToggle(region)}
                  className="border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label
                  htmlFor={`region-${region}`}
                  className="text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {region}
                </Label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

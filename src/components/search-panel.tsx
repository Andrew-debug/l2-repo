"use client";

import { useState, useMemo } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  bosses,
  items,
  searchBosses,
  searchItems,
  getBossesByItem,
  type Boss,
  type Item,
} from "@/lib/boss-data";

interface SearchPanelProps {
  onBossSelect: (boss: Boss) => void;
  onItemSelect: (item: Item) => void;
}

export function SearchPanel({ onBossSelect, onItemSelect }: SearchPanelProps) {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"boss" | "item">("boss");

  const bossResults = useMemo(() => {
    if (!query.trim()) return bosses.slice(0, 5);
    return searchBosses(query);
  }, [query]);

  const itemResults = useMemo(() => {
    if (!query.trim()) return items.slice(0, 5);
    return searchItems(query);
  }, [query]);

  const results = activeTab === "boss" ? bossResults : itemResults;

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={
              activeTab === "boss" ? "Search bosses..." : "Search items..."
            }
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 bg-secondary/50 border-border focus:border-primary"
          />
          {query && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => setQuery("")}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-4 p-1 bg-secondary/50 rounded-md">
        <button
          className={`flex-1 text-sm py-1.5 px-3 rounded transition-colors ${
            activeTab === "boss"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("boss")}
        >
          By Boss
        </button>
        <button
          className={`flex-1 text-sm py-1.5 px-3 rounded transition-colors ${
            activeTab === "item"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={() => setActiveTab("item")}
        >
          By Item Drop
        </button>
      </div>

      {/* Results */}
      <div className="space-y-2 max-h-75 overflow-y-auto">
        {activeTab === "boss" ? (
          bossResults.length > 0 ? (
            bossResults.map((boss) => (
              <button
                key={boss.id}
                onClick={() => onBossSelect(boss)}
                className="w-full text-left p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-foreground">
                    {boss.name}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      boss.type === "epic"
                        ? "bg-accent/20 text-accent"
                        : boss.type === "raid"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {boss.type}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span>Lv. {boss.level}</span>
                  <span>•</span>
                  <span>{boss.location}</span>
                </div>
              </button>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">
              No bosses found
            </p>
          )
        ) : itemResults.length > 0 ? (
          itemResults.map((item) => {
            const droppingBosses = getBossesByItem(item.id);
            return (
              <button
                key={item.id}
                onClick={() => onItemSelect(item)}
                className="w-full text-left p-3 rounded-md bg-secondary/30 hover:bg-secondary/50 border border-transparent hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium text-foreground">
                      {item.name}
                    </span>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded font-medium ${
                      item.grade === "S80" || item.grade === "S"
                        ? "bg-accent/20 text-accent"
                        : item.grade === "A"
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {item.grade}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="capitalize">{item.type}</span>
                  <span>•</span>
                  <span>
                    {droppingBosses.length} boss
                    {droppingBosses.length !== 1 ? "es" : ""}
                  </span>
                </div>
              </button>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground py-4">
            No items found
          </p>
        )}
      </div>
    </div>
  );
}

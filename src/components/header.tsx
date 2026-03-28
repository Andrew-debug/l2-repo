"use client";

import { Sword, Map, Crown } from "lucide-react";

export function Header() {
  return (
    <header className="border-b border-border/50 bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Crown className="h-8 w-8 text-primary" />
              <Sword className="h-4 w-4 text-accent absolute -bottom-1 -right-1" />
            </div>
            <div>
              <h1 className="font-cinzel text-xl font-bold text-foreground tracking-wide">
                L2 Boss Tracker
              </h1>
              <p className="text-xs text-muted-foreground">
                Lineage 2 Raid Boss Map
              </p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
            >
              <Map className="h-4 w-4" />
              World Map
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Boss List
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Drop Table
            </a>
            <a
              href="#"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Timers
            </a>
          </nav>

          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Chronicle: Interlude
            </span>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { Header } from "@/components/header";
import { MapPlaceholder } from "@/components/map-placeholder";
import { Sidebar } from "@/components/sidebar";
import { BossCard } from "@/components/boss-card";
import { type Boss } from "@/lib/boss-data";
import {
  PanelLeftClose,
  PanelLeft,
  Info,
  HelpCircle,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const [selectedBoss, setSelectedBoss] = useState<Boss | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="bg-background flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Sidebar Toggle for Mobile */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden fixed bottom-4 right-4 z-50 h-12 w-12 rounded-full bg-card border-border shadow-lg"
        >
          {sidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeft className="h-5 w-5" />
          )}
        </Button>

        {/* Sidebar */}
        <aside
          className={`
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          fixed lg:relative inset-y-0 left-0 z-40
          lg:translate-x-0 transition-transform duration-300 ease-in-out
          bg-background lg:bg-transparent p-4 pr-0 overflow-y-auto
          border-r border-border lg:border-0
        `}
        >
          <Sidebar selectedBoss={selectedBoss} onBossSelect={setSelectedBoss} />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-background/80 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="size-100  p-4 flex flex-col gap-4">
          {/* Selected Boss Details */}
          {selectedBoss && (
            <div className="lg:max-w-xl">
              <BossCard
                boss={selectedBoss}
                onClose={() => setSelectedBoss(null)}
              />
            </div>
          )}

          {/* Map Area */}
          <div className="size-100">
            <MapPlaceholder />
          </div>

          {/* Quick Stats Footer */}
          {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-primary">21</div>
              <div className="text-xs text-muted-foreground">Total Bosses</div>
            </div>
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-accent">9</div>
              <div className="text-xs text-muted-foreground">Epic Bosses</div>
            </div>
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-foreground">38</div>
              <div className="text-xs text-muted-foreground">Unique Drops</div>
            </div>
            <div className="bg-card rounded-lg border border-border p-3 text-center">
              <div className="text-2xl font-bold text-primary">9</div>
              <div className="text-xs text-muted-foreground">Regions</div>
            </div>
          </div> */}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50 py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <a
                href="#"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Info className="h-3 w-3" />
                About
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <HelpCircle className="h-3 w-3" />
                FAQ
              </a>
              <a
                href="#"
                className="hover:text-primary transition-colors flex items-center gap-1"
              >
                <Users className="h-3 w-3" />
                Discord
              </a>
            </div>
            <p className="text-xs text-muted-foreground/70">
              L2 Boss Tracker • Not affiliated with NCsoft
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { MapPlaceholder } from "@/components/map-placeholder";
import Map from "@/components/map/Map";
import { MapProvider } from "@/components/providers/MapProvider";
import { IconStateButton } from "@/components/ui/icon-state-button";
import { L2Icon } from "@/components/ui/l2-icon";
import L2Window from "@/components/ui/l2-window";
import { Header } from "@/components/header";
import { HelpCircle, Info, Users } from "lucide-react";
import Chat from "@/components/chat/chat";
import SystemMenu from "@/components/ui-l2/system-menu";
import BossLevelNavigator from "@/components/ui-l2/boss/level-navigator";
import { BossSelectionProvider } from "@/components/providers/BossSelectionProvider";
import { BossPositionsProvider } from "@/components/providers/BossPositionsProvider";
import { BossRespawnProvider } from "@/components/providers/BossRespawnProvider";
import { BossLootDisplay } from "@/components/ui-l2/boss/loot-display";
import BossInfoDisplay from "@/components/ui-l2/boss/info-display";
import UpcomingSpawns from "@/components/ui-l2/boss/upcoming-spawns";
import RespawnSettings from "@/components/ui-l2/boss/respawn-settings";
async function handleCloseAction() {
  "use server";
  console.log("This logs in your VSCode terminal, not the browser");
  // Update database here
}

export default function Home() {
  return (
    <div className="relative w-full h-dvh overflow-hidden">
      {/* <Header /> */}
      {/* <MainPage /> */}

      <BossSelectionProvider>
        <BossPositionsProvider>
          <BossRespawnProvider>
            <div className="flex gap-4">
              <BossLevelNavigator />
              <MapProvider>
                <Map />
              </MapProvider>
              <BossLootDisplay />
              <BossInfoDisplay />
              <UpcomingSpawns />
              <RespawnSettings />
            </div>
          </BossRespawnProvider>
        </BossPositionsProvider>
      </BossSelectionProvider>

      {/* <Chat /> */}

      <SystemMenu />

      {/* <footer className="border-t border-border bg-card/50 py-4">
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
      </footer> */}

      {/* <L2Window /> */}
    </div>
  );
}

import { MapPlaceholder } from "@/components/map-placeholder";
import { MapProvider } from "@/components/providers/MapProvider";
import { IconStateButton } from "@/components/ui/icon-state-button";
import { L2Icon } from "@/components/ui/l2-icon";
import { Header } from "@/components/header";
import { HelpCircle, Info, Users } from "lucide-react";
import Chat from "@/components/chat/chat";
import MenuSection from "@/components/ui-l2/menu-section";
import { BossSelectionProvider } from "@/components/providers/BossSelectionProvider";
import { BossPositionsProvider } from "@/components/providers/BossPositionsProvider";
import { BossRespawnProvider } from "@/components/providers/BossRespawnProvider";
import { BossItemFilterProvider } from "@/components/providers/BossItemFilterProvider";
import { BossLevelFilterProvider } from "@/components/providers/BossLevelFilterProvider";
import { RaidBossesPanelProvider } from "@/components/providers/RaidBossesPanelProvider";
import { DropListPanelProvider } from "@/components/providers/DropListPanelProvider";
import { UpcomingSpawnsPanelProvider } from "@/components/providers/UpcomingSpawnsPanelProvider";
import { NpcInfoPanelProvider } from "@/components/providers/NpcInfoPanelProvider";
import { BackgroundDimProvider } from "@/components/providers/BackgroundDimProvider";
import { HeaderVisibilityProvider } from "@/components/providers/HeaderVisibilityProvider";
import { EnterChatProvider } from "@/components/providers/EnterChatProvider";
import { Background } from "@/components/background";
import { PageTitleBanner } from "@/components/ui-l2/page-title-banner";
import { EpicBossStatusRail } from "@/components/ui-l2/epic-boss-status-rail";
import { MainContentRow } from "@/components/ui-l2/main-content-row";
import { OptionsPanelProvider } from "@/components/providers/OptionsPanelProvider";
import { OptionsWindow } from "@/components/ui-l2/options-window";
import { RespawnChip } from "@/components/ui-l2/boss/respawn-chip";
async function handleCloseAction() {
  "use server";
  console.log("This logs in your VSCode terminal, not the browser");
  // Update database here
}

export default function Home() {
  return (
    <EnterChatProvider>
      <BackgroundDimProvider>
        <HeaderVisibilityProvider>
          <div className="relative w-full h-dvh overflow-hidden border border-window-inner-gray">
            <BossRespawnProvider>
              <Background />
              <EpicBossStatusRail />
              <PageTitleBanner />

              {/* <Header /> */}
              {/* <MainPage /> */}

              <OptionsPanelProvider>
                <OptionsWindow />

                <MapProvider>
                  <RaidBossesPanelProvider>
                    <DropListPanelProvider>
                      <UpcomingSpawnsPanelProvider>
                        <NpcInfoPanelProvider>
                          <BossSelectionProvider>
                            <BossPositionsProvider>
                              <BossItemFilterProvider>
                                <BossLevelFilterProvider>
                                  <MainContentRow />

                                  <RespawnChip />

                                  {/* <Chat /> */}

                                  <MenuSection />
                                </BossLevelFilterProvider>
                              </BossItemFilterProvider>
                            </BossPositionsProvider>
                          </BossSelectionProvider>
                        </NpcInfoPanelProvider>
                      </UpcomingSpawnsPanelProvider>
                    </DropListPanelProvider>
                  </RaidBossesPanelProvider>
                </MapProvider>
              </OptionsPanelProvider>
            </BossRespawnProvider>

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
          </div>
        </HeaderVisibilityProvider>
      </BackgroundDimProvider>
    </EnterChatProvider>
  );
}

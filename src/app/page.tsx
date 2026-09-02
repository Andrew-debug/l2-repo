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
import { MobileSplash } from "@/components/mobile-splash";
async function handleCloseAction() {
  "use server";
  console.log("This logs in your VSCode terminal, not the browser");
  // Update database here
}

export default function Home() {
  return (
    <>
      {/* MobileSplash is `desktop:hidden` internally; this whole app below
          is `hidden desktop:block` — "desktop" is a custom variant (see
          globals.css) requiring BOTH width >= 1023px AND height >= 863px,
          not just a wide-enough viewport, so a short window counts as
          mobile too. Below that threshold, only the splash renders
          (visually; see MobileSplash's own comment on the CSS-only
          tradeoff); at/above it, only the real app does. The app itself has
          no touch/small-screen layout at all (draggable windows, a Konva
          canvas map, keyboard shortcuts), so there's no responsive version
          of it to fall back to — mobile gets a dedicated screen instead. */}
      <MobileSplash />
      <div className="hidden h-dvh w-full desktop:block">
        <EnterChatProvider>
          <BackgroundDimProvider>
            <HeaderVisibilityProvider>
              <div className="relative w-full h-dvh overflow-hidden border border-window-inner-gray">
                {/* Only server-rendered link into the crawlable /bosses
                    pages — everything else on this screen is a client
                    component, and the boss map itself renders to a
                    <canvas> that search engines can't read at all. */}
                <a
                  href="/bosses"
                  className="absolute bottom-1 left-1 z-50 text-[10px] tracking-wide text-white/25 hover:text-white/60"
                >
                  Full boss list &amp; drop tables
                </a>
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
      </div>
    </>
  );
}

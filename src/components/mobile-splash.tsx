import Image from "next/image";
import Link from "next/link";

// The actual app (draggable windows, a Konva canvas map, keyboard
// shortcuts, drag-and-drop) is mouse/keyboard-driven and doesn't have a
// touch layout — rather than ship a broken half-working experience on
// phones, mobile gets this single static screen instead, with a link into
// the plain-HTML /bosses pages (built for exactly this: browsing bosses and
// drops without the map). Desktop is untouched — see page.tsx's `desktop:`
// split (a custom variant, see globals.css: width >= 1023px AND height >=
// 863px, not just a wide-enough viewport).
export function MobileSplash() {
  return (
    <div className="relative flex h-dvh w-full flex-col items-center justify-center overflow-hidden bg-background text-center desktop:hidden">
      <Image
        src="/bosses/epic/Valakas/Valakas.webp"
        alt=""
        fill
        quality={90}
        // Explicit "100vw" (this is `fill`'s implicit default anyway,
        // spelled out only to silence Next's dev-mode "missing sizes"
        // warning) — see background.tsx's own comment on why an
        // accurate-but-small hint makes painterly source art look worse,
        // not better, once Next's optimizer resizes+recompresses it.
        sizes="100vw"
        priority
        className="object-cover"
        style={{ objectPosition: "60% center" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(5,7,10,0.5) 0%, rgba(5,7,10,0.72) 55%, rgba(5,7,10,0.94) 100%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-5 px-6">
        <div>
          <div
            className="font-marcellus text-[24px] leading-none tracking-[0.17em] text-[#e8dcc0]"
            style={{
              textShadow: "0 0 14px rgba(189,174,132,0.4), 1px 1px 0 #000",
            }}
          >
            LINEAGE 2
          </div>
          <div className="mt-1.5 flex items-center justify-center gap-2">
            <div className="h-px w-8 bg-linear-to-r from-[#bdae84]/0 to-[#bdae84]/70" />
            <span className="font-marcellus text-[13px] tracking-[0.26em] text-system-text">
              BOSS TRACKER
            </span>
            <div className="h-px w-8 bg-linear-to-r from-[#bdae84]/70 to-[#bdae84]/0" />
          </div>
        </div>

        <div className="title-banner-frame max-w-xs rounded px-5 py-4">
          <p className="text-[14px] leading-relaxed text-foreground/90">
            The live boss map is built for desktop — mouse-driven windows and
            keyboard shortcuts that don&apos;t translate to a phone.
          </p>
          <p className="mt-2.5 text-[13px] leading-relaxed text-foreground/60">
            You can still browse every raid and epic boss, its stats, and its
            full drop list here on mobile.
          </p>
        </div>

        <Link
          href="/bosses"
          className="gold-button rounded px-6 py-3 text-[14px] tracking-wide text-button-text"
        >
          Browse Bosses &amp; Drops
        </Link>
      </div>
    </div>
  );
}

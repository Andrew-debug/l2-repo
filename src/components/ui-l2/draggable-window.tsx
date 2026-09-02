"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

const DRAG_THRESHOLD_PX = 4;

// How far past an edge — the viewport's or another window's — the pointer
// has to travel beyond the point where the window first hits it, before
// the window actually follows it past that point. Shared by both kinds of
// stickiness so they always feel the same.
const STICKY_BREAKAWAY_PX = 15;

// How close the window's edge has to get to an edge it isn't touching yet
// — again the viewport's or another window's — before it snaps the rest
// of the way there on its own, instantly. Same constant for both kinds of
// stickiness, same as STICKY_BREAKAWAY_PX above.
const MAGNETIC_SNAP_PX = 5;

// Shared across every DraggableWindow instance — whichever window was most
// recently interacted with claims the next value, so it renders above every
// window that hasn't been touched since (not just whichever is later in the
// DOM). Module-level on purpose: all windows live in one page, so a plain
// global counter is simpler than threading a context through every panel.
let topZIndex = 10;

// Persists the front-to-back stacking order across reloads, for windows
// that opt in via the `id` prop — back-to-front, so the last entry is
// topmost. Kept as one shared array (not a zIndex number per window) since
// only the *relative* order matters; storing raw zIndex values would drift
// from topZIndex's own numbering the moment either side changed
// independently.
const STACK_ORDER_STORAGE_KEY = "l2-window-stack-order";
// Fired by clearPersistedStackOrder so every mounted id-bearing
// DraggableWindow drops back to zIndex 0 immediately — same live-reset
// approach as usePersistedOffset's OFFSETS_RESET_EVENT, for the same
// reason (no page reload, no central store of z-indexes to update
// directly).
const STACK_ORDER_RESET_EVENT = "l2-window-stack-order-reset";

function readStackOrder(): string[] {
  try {
    const raw = window.localStorage.getItem(STACK_ORDER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

// Moves `id` to the top of the persisted order (adding it if new) and
// writes the result back — called every time a window with an id is
// brought to front, so the order always reflects "most recently focused
// last."
function bumpStackOrder(id: string) {
  try {
    const next = readStackOrder().filter((existing) => existing !== id);
    next.push(id);
    window.localStorage.setItem(STACK_ORDER_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Private browsing / quota exceeded — order just won't survive reload.
  }
}

// Clears the persisted stacking order — used by Options' "Initialize"
// (positions/stacking only) and the System Menu's "Restart" (full reset).
export function clearPersistedStackOrder() {
  try {
    window.localStorage.removeItem(STACK_ORDER_STORAGE_KEY);
  } catch {
    // Non-fatal — see bumpStackOrder.
  }
  topZIndex = 10; // back to the module's original starting value
  window.dispatchEvent(new Event(STACK_ORDER_RESET_EVENT));
}

// Reserved stacking band for `alwaysOnTop` windows (currently just Options)
// — comfortably above anything the dynamic topZIndex race above could climb
// to through ordinary clicking/dragging, but below ConfirmDialog's fixed
// z-999, which must stay above literally everything (see confirm-dialog.tsx).
const ALWAYS_ON_TOP_Z_INDEX = 500;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

// Clamps `desired` (the raw, unresisted screen coordinate) to [min, max],
// then lets it bleed past that boundary only after STICKY_BREAKAWAY_PX of
// extra travel — continuously, so there's no jump at the breakaway point.
// Coming from the other direction, it doesn't wait for an exact
// pixel-perfect touch either: once within MAGNETIC_SNAP_PX of a bound it
// hasn't reached yet, it snaps straight to it, no easing — a magnet, not a
// glide.
function applyStickyBound(desired: number, min: number, max: number): number {
  const clamped = clamp(desired, min, max);
  const overflow = desired - clamped;
  if (overflow === 0) {
    const distanceToMin = desired - min;
    const distanceToMax = max - desired;
    if (distanceToMin <= MAGNETIC_SNAP_PX && distanceToMin <= distanceToMax)
      return min;
    if (distanceToMax <= MAGNETIC_SNAP_PX) return max;
    return clamped;
  }
  const eased =
    Math.sign(overflow) * Math.max(0, Math.abs(overflow) - STICKY_BREAKAWAY_PX);
  return clamped + eased;
}

interface StickyGroup {
  register: (element: HTMLDivElement) => () => void;
  membersRef: React.RefObject<Set<HTMLDivElement>>;
}

const StickyGroupContext = createContext<StickyGroup | null>(null);

interface StickyWindowGroupProps {
  children: ReactNode;
}

// Wrap a set of DraggableWindows in this so they stick to *each other*, the
// same way every window already sticks to the viewport edge: drag one close
// to another and it stops flush against it, then bleeds through only after
// STICKY_BREAKAWAY_PX of extra pointer travel. Windows outside the group (or
// not wrapped in one at all) are unaffected — plain viewport-edge stickiness
// still applies to them.
export function StickyWindowGroup({ children }: StickyWindowGroupProps) {
  const membersRef = useRef<Set<HTMLDivElement>>(new Set());
  const register = useCallback((element: HTMLDivElement) => {
    membersRef.current.add(element);
    return () => membersRef.current.delete(element);
  }, []);
  const value = useMemo(() => ({ register, membersRef }), [register]);

  return (
    <StickyGroupContext.Provider value={value}>
      {children}
    </StickyGroupContext.Provider>
  );
}

type BoundSide = "min" | "max";

// Which wall of `other` a `size`-long window (positioned at `desiredNear`)
// should be defended against crossing, and where that wall sits — or null
// if `desiredNear` is genuinely overlapping `other` on this axis, with no
// single defendable side. Recomputed fresh every frame from the live
// (unclamped) desired position, not a position snapshotted once at drag
// start — two windows anchored flush against each other (the common
// default layout here) start every drag already touching, where a
// start-position-only check can't tell left from right and would end up
// defending neither.
//
// The overlapping case is deliberately left undefended rather than guessed
// at (e.g. from drag direction): a window that starts flush/overlapping
// and is dragged away is *departing* the overlap, not pressing into it —
// resistance only makes sense once it reaches a clean, unambiguous side
// and tries to cross back in, which the two branches below already cover.
// Guessing a side during the ambiguous phase produces a wall with no
// physical basis, and when the geometry later resolves to one of the real
// branches, discarding that guess in favor of the real one is a visible
// jump — the exact bug this was rewritten to fix.
function pickCollisionSide(
  desiredNear: number,
  size: number,
  otherNear: number,
  otherFar: number,
): { side: BoundSide; bound: number } | null {
  const desiredFar = desiredNear + size;
  if (desiredFar <= otherNear) return { side: "max", bound: otherNear - size };
  if (desiredNear >= otherFar) return { side: "min", bound: otherFar };
  return null;
}

const DragStartContext = createContext<((e: React.MouseEvent) => void) | null>(
  null,
);

interface DraggableWindowProps {
  // Wrap whichever part of the window should start a drag — typically the
  // Header — in <DragHandle>. Everything else renders untouched.
  children: ReactNode;
  className?: string;
  // Starting offset, read once at mount. Pair with onOffsetChange to persist
  // position across a caller that unmounts this window on close instead of
  // just hiding it (e.g. a toggled popup) — the offset otherwise resets
  // because it lives in this component's own state.
  initialOffset?: { x: number; y: number };
  onOffsetChange?: (offset: { x: number; y: number }) => void;
  // Centers the window in the viewport the first time it's laid out, by
  // measuring its own rendered size — for a window that starts closed
  // (mounted invisibly, per the reserve-layout-space convention) and should
  // still open in the middle the first time, rather than wherever its own
  // static position happens to fall. Ignored if initialOffset is given (an
  // explicit starting position wins), and only ever applied once — dragging
  // afterward, even while invisible, takes over from there like any other
  // window.
  centered?: boolean;
  // Pins this window's stacking order at ALWAYS_ON_TOP_Z_INDEX instead of
  // letting it join the normal "most recently clicked wins" race — so it
  // stays above every regular window even when the user clicks or drags one
  // of them afterward, not just until the next time this window itself is
  // touched. Still draggable/clickable itself; it just never needs (or
  // gets) raised any higher, since nothing but ConfirmDialog's fixed z-999
  // outranks it.
  alwaysOnTop?: boolean;
  // Stable identity for persisting this window's place in the front-to-back
  // stacking order across reloads (see bumpStackOrder/readStackOrder above).
  // Omit for windows where stacking order doesn't matter or shouldn't
  // persist (alwaysOnTop windows, one-off dialogs).
  id?: string;
  // For windows that unmount on close (e.g. SystemMenuPanel) instead of
  // staying mounted and toggling invisible like most others — without this,
  // remounting just restores whatever stacking position was persisted from
  // last time, which can still be buried under a window raised since. This
  // makes mounting behave like a fresh click: jump straight to the front
  // and bump the persisted order, instead of restoring the old position.
  raiseOnMount?: boolean;
  // Corrects this window's offset to keep it fully within the viewport —
  // checked whenever this prop is truthy (mount, or a caller flipping it
  // true) and again on every window resize afterward. Only ever passed on
  // the small folded-icon form of a window: the sticky-edge resistance in
  // handleDragStart below still lets a drag *bleed* past the viewport edge
  // once the pointer travels far enough (see STICKY_BREAKAWAY_PX) — fine
  // for a full-size window, which is big enough that some part almost
  // always stays reachable even at an extreme offset, but a 30px fold icon
  // pushed past the edge that way has nothing left on screen to click and
  // drag back. Corrects whichever axis actually overflowed and leaves the
  // other alone, landing exactly on the screen edge at its current
  // position rather than re-centering the whole thing.
  snapIntoViewport?: boolean;
}

// Holding the mouse down on a <DragHandle> and moving repositions the whole
// window via a CSS transform, leaving its layout slot (and any position:
// absolute/static from the caller's className) alone. A plain click with no
// real movement passes through normally, so a handle's own buttons (e.g.
// Header's fold/close) keep working. Dragging resists leaving the viewport
// — the window sticks to the edge until the pointer pushes past it far
// enough to break away — and, if wrapped in a StickyWindowGroup, resists
// overlapping any other window in that group the same way. Clicking
// anywhere in the window (not just a handle) raises it above every other
// one, and it stays raised — a buried window's handle can end up hidden
// under a taller neighbor, so the body has to work as a lift too, or
// there'd be no way to reach it again.
export function DraggableWindow({
  children,
  className,
  initialOffset,
  onOffsetChange,
  centered,
  alwaysOnTop,
  id,
  raiseOnMount,
  snapIntoViewport,
}: DraggableWindowProps) {
  const [offset, setOffsetState] = useState(initialOffset ?? { x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(0);
  const elementRef = useRef<HTMLDivElement>(null);
  const stickyGroup = useContext(StickyGroupContext);

  // Restores this window's place in the persisted stacking order on mount.
  // z-index (unlike dragged position) doesn't get the same
  // invisible-until-hydrated treatment usePersistedOffset uses for the
  // SSR-vs-client mismatch: two windows would have to both sit at their
  // (also-still-settling) default positions AND actually overlap for a
  // wrong z-index to be visible for that one frame, which is a much
  // narrower window than position's guaranteed-visible jump.
  useLayoutEffect(() => {
    if (!id) return;
    if (raiseOnMount) {
      topZIndex += 1;
      setZIndex(topZIndex);
      bumpStackOrder(id);
      return;
    }
    const order = readStackOrder();
    const index = order.indexOf(id);
    // Seed the shared counter above every restored index so the next fresh
    // bringToFront (topZIndex += 1) can't collide with a restored value.
    topZIndex = Math.max(topZIndex, order.length + 10);
    if (index !== -1) setZIndex(index + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!id) return;
    const handleReset = () => setZIndex(0);
    window.addEventListener(STACK_ORDER_RESET_EVENT, handleReset);
    return () =>
      window.removeEventListener(STACK_ORDER_RESET_EVENT, handleReset);
  }, [id]);

  // Runs once, before paint, so there's no visible flash at the un-centered
  // static position first. The delta is computed from wherever the element
  // actually laid out (rect.left/top), not assumed to be 0 — so this works
  // regardless of the caller's own positioning classes.
  useLayoutEffect(() => {
    if (!centered || initialOffset) return;
    const element = elementRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    setOffsetState({
      x: (window.innerWidth - rect.width) / 2 - rect.left,
      y: (window.innerHeight - rect.height) / 2 - rect.top,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Beyond seeding the initial position, also resync whenever `initialOffset`
  // changes to a value this instance didn't itself just emit — lets two
  // DraggableWindows that stay mounted simultaneously share one lifted
  // offset (e.g. Map's folded icon and its full window) and stay in lockstep
  // without either ever unmounting. Bails out via the functional update when
  // the value already matches, so this doesn't fight this window's own drag:
  // dragging sets `offset` locally and calls onOffsetChange in the same
  // handler, so by the time the echoed prop comes back down it's already
  // equal and this is a no-op.
  // useLayoutEffect, not useEffect: a caller correcting its own initialOffset
  // right after mount (e.g. usePersistedOffset hydrating from localStorage in
  // its own layout effect) needs that correction to land here before the
  // browser's next paint — a plain effect runs after paint, which meant this
  // still visibly rendered at the stale value for one frame even once the
  // caller itself was already fixed.
  useLayoutEffect(() => {
    if (!initialOffset) return;
    setOffsetState((prev) =>
      prev.x === initialOffset.x && prev.y === initialOffset.y
        ? prev
        : initialOffset,
    );
  }, [initialOffset]);

  useEffect(() => {
    const element = elementRef.current;
    if (!stickyGroup || !element) return;
    return stickyGroup.register(element);
  }, [stickyGroup]);

  // Read from inside handleDragStart instead of depending on it directly.
  // handleDragStart is only ever *invoked* at mousedown, so it doesn't need
  // to be recreated every time offset changes — but if it were, the new
  // function would be a new DragStartContext value, re-rendering every
  // DragHandle consumer (e.g. the Header) on every single drag frame, for
  // no visible benefit.
  const offsetRef = useRef(offset);
  offsetRef.current = offset;

  // Same reasoning as offsetRef — read the latest callback at mouseup
  // without making handleDragStart depend on (and get recreated by) it.
  const onOffsetChangeRef = useRef(onOffsetChange);
  onOffsetChangeRef.current = onOffsetChange;

  // See snapIntoViewport's own doc comment above. useLayoutEffect (not
  // useEffect) so a correction lands before paint — same "avoid a visible
  // flash at the wrong position" reasoning as the initialOffset resync
  // effect above. offset.x/offset.y are in the dependency list (not just
  // snapIntoViewport) so this also re-checks whenever the shared offset
  // changes afterward — e.g. that same resync effect syncing in an
  // already-out-of-bounds value inherited from the window's full-size form.
  useLayoutEffect(() => {
    if (!snapIntoViewport) return;
    const element = elementRef.current;
    if (!element) return;

    const clamp = () => {
      const rect = element.getBoundingClientRect();
      let dx = 0;
      if (rect.right > window.innerWidth) dx = rect.right - window.innerWidth;
      else if (rect.left < 0) dx = rect.left;
      let dy = 0;
      if (rect.bottom > window.innerHeight)
        dy = rect.bottom - window.innerHeight;
      else if (rect.top < 0) dy = rect.top;
      if (dx === 0 && dy === 0) return;
      setOffsetState((prev) => {
        const next = { x: prev.x - dx, y: prev.y - dy };
        onOffsetChangeRef.current?.(next);
        return next;
      });
    };

    clamp();
    window.addEventListener("resize", clamp);
    return () => window.removeEventListener("resize", clamp);
  }, [snapIntoViewport, offset.x, offset.y]);

  const bringToFront = useCallback(() => {
    if (alwaysOnTop) return; // pinned — see ALWAYS_ON_TOP_Z_INDEX above
    topZIndex += 1;
    setZIndex(topZIndex);
    if (id) bumpStackOrder(id);
  }, [alwaysOnTop, id]);

  const handleDragStart = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // left click only
    const element = elementRef.current;
    if (!element) return;

    const startMouse = { x: e.clientX, y: e.clientY };
    const startOffset = offsetRef.current;
    const startRect = element.getBoundingClientRect();
    let didDrag = false;
    let latestOffset = startOffset;

    // mousemove can fire far more often than the screen actually
    // repaints — doing a React state update on every single event, rather
    // than once per rendered frame, is what was making the drag feel
    // staggered instead of smooth. Only the latest pointer position is
    // kept between frames; the real work happens at most once per rAF tick.
    let latestMouse = startMouse;
    let rafId: number | null = null;

    // Once a clean (unambiguous) side is found for a neighbor on an axis,
    // remember it — crossing the wall by definition enters "overlapping",
    // which pickCollisionSide treats as ambiguous, so without this the
    // wall would vanish the instant it's actually reached (the very
    // opposite of resisting further travel into it). Cleared whenever the
    // perpendicular gate drops, so a gesture that starts inside an
    // overlap (nothing clean was ever seen) still correctly gets no wall.
    const lastCleanXSide = new Map<
      HTMLDivElement,
      { side: BoundSide; bound: number }
    >();
    const lastCleanYSide = new Map<
      HTMLDivElement,
      { side: BoundSide; bound: number }
    >();

    const applyFrame = () => {
      rafId = null;
      const dx = latestMouse.x - startMouse.x;
      const dy = latestMouse.y - startMouse.y;
      if (!didDrag && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;
      didDrag = true;

      const desiredLeft = startRect.left + dx;
      const desiredTop = startRect.top + dy;

      let minX = 0;
      let maxX = window.innerWidth - startRect.width;
      let minY = 0;
      let maxY = window.innerHeight - startRect.height;

      const members = stickyGroup?.membersRef.current;
      if (members) {
        for (const other of members) {
          if (other === element) continue;
          const rect = other.getBoundingClientRect();

          const verticalOverlap =
            desiredTop < rect.bottom &&
            rect.top < desiredTop + startRect.height;
          let xPick = verticalOverlap
            ? pickCollisionSide(
                desiredLeft,
                startRect.width,
                rect.left,
                rect.right,
              )
            : null;
          if (!verticalOverlap) {
            lastCleanXSide.delete(other);
          } else if (xPick) {
            lastCleanXSide.set(other, xPick);
          } else {
            xPick = lastCleanXSide.get(other) ?? null;
          }
          if (xPick) {
            if (xPick.side === "max") maxX = Math.min(maxX, xPick.bound);
            else minX = Math.max(minX, xPick.bound);
          }

          const horizontalOverlap =
            desiredLeft < rect.right &&
            rect.left < desiredLeft + startRect.width;
          let yPick = horizontalOverlap
            ? pickCollisionSide(
                desiredTop,
                startRect.height,
                rect.top,
                rect.bottom,
              )
            : null;
          if (!horizontalOverlap) {
            lastCleanYSide.delete(other);
          } else if (yPick) {
            lastCleanYSide.set(other, yPick);
          } else {
            yPick = lastCleanYSide.get(other) ?? null;
          }
          if (yPick) {
            if (yPick.side === "max") maxY = Math.min(maxY, yPick.bound);
            else minY = Math.max(minY, yPick.bound);
          }
        }
      }

      const appliedLeft = applyStickyBound(desiredLeft, minX, maxX);
      const appliedTop = applyStickyBound(desiredTop, minY, maxY);

      latestOffset = {
        x: startOffset.x + (appliedLeft - startRect.left),
        y: startOffset.y + (appliedTop - startRect.top),
      };
      // Mutate the transform directly instead of going through React state
      // on every frame — a setState here re-renders this window's whole
      // subtree (Header, WindowBorder, every icon button inside it) 60
      // times a second for the length of the drag, which is what was still
      // costing enough to feel laggy even after the onOffsetChange fix.
      // React is only told the real value once, at mouseup.
      if (element) {
        element.style.transform = `translate(${latestOffset.x}px, ${latestOffset.y}px)`;
      }
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      latestMouse = { x: moveEvent.clientX, y: moveEvent.clientY };
      if (rafId === null) {
        rafId = requestAnimationFrame(applyFrame);
      }
    };

    const handleMouseUp = () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      // Only now does React find out the position changed — this is what
      // actually drives a re-render, with the real offset in state so later
      // re-renders for unrelated reasons don't snap back to a stale value.
      if (didDrag) {
        setOffsetState(latestOffset);
        onOffsetChangeRef.current?.(latestOffset);
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  }, []);

  return (
    <div
      ref={elementRef}
      // Baseline pointer-events-auto, overridable by the caller's own
      // conditional pointer-events-none (e.g. `!isOpen && "invisible
      // pointer-events-none"`) via cn()'s tailwind-merge — every window
      // needs this explicit value, not just the inherited default, once an
      // ancestor (MainContentRow) sets pointer-events-none on itself so
      // clicks over a *closed* window's empty slot fall through to the
      // epic-boss background art beneath instead of being swallowed by that
      // ancestor. Without this, setting pointer-events-none up there would
      // make every window — even open ones — silently unclickable, since
      // pointer-events inherits.
      className={cn("pointer-events-auto", className)}
      style={{
        transform:
          offset.x || offset.y
            ? `translate(${offset.x}px, ${offset.y}px)`
            : undefined,
        zIndex: alwaysOnTop ? ALWAYS_ON_TOP_Z_INDEX : zIndex || undefined,
      }}
      onMouseDownCapture={bringToFront}
    >
      <DragStartContext.Provider value={handleDragStart}>
        {children}
      </DragStartContext.Provider>
    </div>
  );
}

interface DragHandleProps {
  children: ReactNode;
  className?: string;
}

// Marks its children as a place a DraggableWindow can be grabbed from. Must
// be used inside a DraggableWindow.
export function DragHandle({ children, className }: DragHandleProps) {
  const handleDragStart = useContext(DragStartContext);
  return (
    <div
      onMouseDown={handleDragStart ?? undefined}
      // Browsers make <img> elements natively draggable, which hijacks
      // mouse events mid-drag (no more mousemove, mouseup never fires) and
      // leaves this handle's own drag logic stuck. Only matters when a
      // handle's content isn't otherwise covered by a non-image layer (e.g.
      // Header's title/buttons overlay already blocks this) — prevented
      // unconditionally here so no handle can hit it.
      onDragStart={(e) => e.preventDefault()}
      className={cn("cursor-move", className)}
    >
      {children}
    </div>
  );
}

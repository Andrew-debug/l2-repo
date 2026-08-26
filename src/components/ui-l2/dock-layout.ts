// Shared between MenuSection (the always-visible dock) and SystemMenuPanel
// (the toggleable list above it) so the panel opens flush above the dock's
// toolbar specifically, not the whole dock (which is wider once the side
// handle is included). Both need this exact value, not independently
// guessed/hardcoded ones that can silently drift apart.
export const DOCK_CONTENT_WIDTH = "w-36";

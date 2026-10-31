// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

import { React } from "./rt";

// The view's zoom, shared by the canvas and the status bar's zoom controls,
// which core mounts apart. Null fits the photo. One per window, like the view.

type Zoom = number | null;

let zoom: Zoom = null;
const listeners = new Set<() => void>();

export function getZoom(): Zoom {
  return zoom;
}

export function setZoom(next: Zoom): void {
  if (next === zoom) return;
  zoom = next;
  for (const l of [...listeners]) l();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => void listeners.delete(listener);
}

export function useZoom(): Zoom {
  return React.useSyncExternalStore(subscribe, getZoom);
}

// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// The slice of Safelight's extension API this extension touches, mirrored from
// the app's src/extensions/types.ts, src/extensions/ui-kit.tsx,
// src/modules/develop/DevelopStage.tsx, src/ui/ZoomControls.tsx and
// src/catalog/types.ts. Extensions are standalone bundles, so the host's source
// is not on the type path; React types come from @types/react (dev only).

import type { ComponentType, ReactNode } from "react";

/** A catalogue photo, with the fields this extension reads. */
export interface CatalogPhoto {
  id: string;
  filename: string;
}

export interface DevelopCanvasProps {
  /** The view's zoom: null fits the photo, 1 is 100%. */
  zoom: number | null;
  onZoomChange(zoom: number | null): void;
  /** Shown in the surround while no photo is open. */
  empty?: ReactNode;
}

export interface ZoomControlsProps {
  zoom: number | null;
  onChange(zoom: number | null): void;
}

export interface ModuleContribution {
  id: string;
  label: string;
  component: ComponentType;
  statusBar?: ComponentType;
}

/** A stylesheet applied to every app window after the core styles. Extension
 *  rules are unlayered, so they win over Tailwind utility classes; disabling
 *  the extension removes the sheet. */
export interface StylesheetContribution {
  id: string;
  css: string;
}

/** The theme's CSS variables as `var(--color-…)` strings. */
export interface UiTokens {
  readonly textMuted: string;
}

export interface SafelightAPI {
  version: 1;
  extensionId: string;
  react: typeof import("react");
  registerModule(c: ModuleContribution): void;
  registerStylesheet(c: StylesheetContribution): void;
  ui: { tokens: UiTokens };
  components: {
    /** The surround and the active photo's canvas, with its overlays; loads
     *  the photo's edit as it opens. */
    DevelopCanvas: ComponentType<DevelopCanvasProps>;
    ZoomControls: ComponentType<ZoomControlsProps>;
    SurroundControl: ComponentType;
    DisplayTransformControl: ComponentType;
    ProcessingUpdateControl: ComponentType;
    ProofToggle: ComponentType;
    AssessmentToggle: ComponentType;
    /** Every component registered into the named core slot. */
    Slot: ComponentType<{ name: string }>;
  };
  catalog: {
    /** The photo open in Develop, or undefined. React hook. */
    useActivePhoto(): CatalogPhoto | undefined;
    /** The name a photo is shown by: its filename, with a virtual copy's name added. */
    photoDisplayName(photo: CatalogPhoto): string;
  };
}

export interface ExtensionModule {
  activate(api: SafelightAPI): void;
  deactivate?(): void;
}

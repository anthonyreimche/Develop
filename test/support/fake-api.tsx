// A stand-in Safelight API over real React and zustand. Core's canvas and view
// controls are markers that show the props they were given: the canvas its zoom
// (and the empty state with no photo open), the zoom controls their zoom and a
// button per level. The active photo comes from a real store.

import * as React from "react";
import { create } from "zustand";
import type {
  CatalogPhoto,
  CullingShortcutOptions,
  DevelopCanvasProps,
  ModuleContribution,
  SafelightAPI,
  StylesheetContribution,
  ZoomControlsProps,
} from "../../src/safelight";

export interface Rig {
  api: SafelightAPI;
  setActivePhoto(photo: CatalogPhoto | undefined): void;
  modules: ModuleContribution[];
  stylesheets: StylesheetContribution[];
  /** The options of each culling-shortcut mount still mounted. */
  culling: CullingShortcutOptions[];
}

export function photo(id: string, extra: Partial<CatalogPhoto> & { copyName?: string } = {}): CatalogPhoto {
  return { id, filename: `${id}.ARW`, ...extra };
}

const marker = (name: string) => () => <span data-control={name} />;

function ZoomControls({ zoom, onChange }: ZoomControlsProps) {
  return (
    <div data-control="zoom" data-zoom={String(zoom)}>
      <button onClick={() => onChange(null)}>Fit</button>
      <button onClick={() => onChange(1)}>100%</button>
    </div>
  );
}

/** `photoMetadata: false` stands for a Safelight before 3.2.8, without
 *  PhotoMetadataControl. */
export function fakeApi({ photoMetadata = true }: { photoMetadata?: boolean } = {}): Rig {
  const modules: ModuleContribution[] = [];
  const stylesheets: StylesheetContribution[] = [];
  const culling: CullingShortcutOptions[] = [];
  const active = create<{ photo: CatalogPhoto | undefined }>()(() => ({ photo: undefined }));

  function DevelopCanvas({ zoom, onZoomChange, empty }: DevelopCanvasProps) {
    const p = active((s) => s.photo);
    return (
      <div data-canvas-surround data-zoom={String(zoom)}>
        {p ? <button onClick={() => onZoomChange(2)}>Zoom canvas</button> : empty}
      </div>
    );
  }

  const api: SafelightAPI = {
    version: 1,
    extensionId: "safelight.develop",
    react: React,
    registerModule: (c) => void modules.push(c),
    registerStylesheet: (c) => void stylesheets.push(c),
    ui: { tokens: { textMuted: "var(--color-text-muted)" } },
    components: {
      DevelopCanvas,
      ZoomControls,
      SurroundControl: marker("surround"),
      DisplayTransformControl: marker("display-transform"),
      ProcessingUpdateControl: marker("processing-update"),
      ProofToggle: marker("proof"),
      AssessmentToggle: marker("assess"),
      ...(photoMetadata ? { PhotoMetadataControl: marker("photo-metadata") } : {}),
      Slot: ({ name }) => <span data-control={`slot:${name}`} />,
    },
    catalog: {
      useActivePhoto: () => active((s) => s.photo),
      usePhotoActions: () => ({ onContextMenu: () => {}, overlays: <span data-control="photo-actions" /> }),
      useCullingShortcuts: (options = {}) => {
        const { sizeSteps, rowSteps } = options;
        React.useEffect(() => {
          const mount = { sizeSteps, rowSteps };
          culling.push(mount);
          return () => void culling.splice(culling.indexOf(mount), 1);
        }, [sizeSteps, rowSteps]);
      },
      photoDisplayName: (p) => {
        const copy = (p as CatalogPhoto & { copyName?: string }).copyName;
        if (!copy) return p.filename;
        const dot = p.filename.lastIndexOf(".");
        return `${p.filename.slice(0, dot)}_${copy}${p.filename.slice(dot)}`;
      },
    },
  };

  return {
    api,
    setActivePhoto: (p) => active.setState({ photo: p }),
    modules,
    stylesheets,
    culling,
  };
}

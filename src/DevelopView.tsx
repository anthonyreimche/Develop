// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

import { React, api } from "./rt";
import type { UiTokens } from "./safelight";
import { setZoom, useZoom } from "./zoom";

const C = "sl-develop";

export function developCss(t: UiTokens): string {
  return `
:where(.${C}-empty) { text-align: center; color: ${t.textMuted}; }
:where(.${C}-empty-title) { font-size: 0.875rem; line-height: 1.25rem; }
:where(.${C}-empty-hint) { font-size: 0.75rem; line-height: 1rem; }
:where(.${C}-status) { display: flex; width: 100%; align-items: center; justify-content: space-between; }
:where(.${C}-controls) { display: flex; align-items: center; gap: 12px; }
`;
}

// The module's main view: core's canvas of the active photo. The Edit stack,
// tools and the other panels are placed by the dock around it. The view opens
// fitted, as it did built in: leaving Develop forgets the zoom.
export function DevelopView() {
  const zoom = useZoom();
  React.useEffect(() => () => setZoom(null), []);
  return (
    <api.components.DevelopCanvas
      zoom={zoom}
      onZoomChange={setZoom}
      empty={
        <div className={`${C}-empty`}>
          <p className={`${C}-empty-title`}>No photo selected</p>
          <p className={`${C}-empty-hint`}>Select a photo in Library to begin editing</p>
        </div>
      }
    />
  );
}

// The photo's name, then the toolbar slot and the view controls. Nothing at all
// with no photo open, so core hides the bar.
export function DevelopStatusBar() {
  const photo = api.catalog.useActivePhoto();
  const zoom = useZoom();
  const {
    Slot,
    AssessmentToggle,
    ProofToggle,
    ProcessingUpdateControl,
    DisplayTransformControl,
    SurroundControl,
    ZoomControls,
  } = api.components;
  if (!photo) return null;
  return (
    <div className={`${C}-status`}>
      <span>{api.catalog.photoDisplayName(photo)}</span>
      <div className={`${C}-controls`}>
        <Slot name="develop-toolbar" />
        <AssessmentToggle />
        <ProofToggle />
        <ProcessingUpdateControl />
        <DisplayTransformControl />
        <SurroundControl />
        <ZoomControls zoom={zoom} onChange={setZoom} />
      </div>
    </div>
  );
}

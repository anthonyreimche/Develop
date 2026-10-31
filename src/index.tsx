// Safelight — founded and principally authored by Anthony Reimche.
// Copyright (C) 2026 Anthony Reimche. Licensed under the GNU GPL v3 with an
// attribution-preservation term (GPL v3 §7b) — see LICENSE. This notice must
// be preserved in derived versions.

// Registers the Develop module: core's editing canvas with its status bar. It
// was built into Safelight until 3.2.0 and keeps the module id "develop", so
// saved layouts, pop-out windows and shortcuts that name it still find it.

import { DevelopStatusBar, DevelopView, developCss } from "./DevelopView";
import { initRuntime } from "./rt";
import type { SafelightAPI } from "./safelight";

export const MODULE_ID = "develop";
export const STYLESHEET_ID = "safelight.develop.styles";

export function activate(host: SafelightAPI): void {
  initRuntime(host);
  host.registerStylesheet({ id: STYLESHEET_ID, css: developCss(host.ui.tokens) });
  host.registerModule({
    id: MODULE_ID,
    label: "Develop",
    component: DevelopView,
    statusBar: DevelopStatusBar,
  });
}

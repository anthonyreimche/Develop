// The Develop module as it was built in: the module it registers, core's canvas
// with the zoom it shares with the status bar, the empty state, and the status
// bar's name and controls in their order.

import { afterEach, describe, expect, it } from "vitest";
import * as React from "react";
import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { activate, MODULE_ID, STYLESHEET_ID } from "../src/index";
import { DevelopStatusBar, DevelopView } from "../src/DevelopView";
import { getZoom, setZoom } from "../src/zoom";
import { fakeApi, photo, type Rig } from "./support/fake-api";

afterEach(() => {
  cleanup();
  setZoom(null);
});

function rig(): Rig {
  const r = fakeApi();
  activate(r.api);
  return r;
}

const canvasZoom = () => document.querySelector<HTMLElement>("[data-canvas-surround]")?.dataset.zoom;
const barZoom = () => document.querySelector<HTMLElement>('[data-control="zoom"]')?.dataset.zoom;

describe("activate", () => {
  it("registers the Develop module under its built-in id, with its status bar", () => {
    const r = rig();
    expect(MODULE_ID).toBe("develop");
    expect(r.modules).toEqual([
      { id: "develop", label: "Develop", component: DevelopView, statusBar: DevelopStatusBar },
    ]);
  });

  it("registers one stylesheet whose every rule has no specificity of its own", () => {
    const r = rig();
    expect(r.stylesheets.map((s) => s.id)).toEqual([STYLESHEET_ID]);
    const selectors = r.stylesheets[0].css
      .split("\n")
      .filter((line) => line.includes("{"))
      .map((line) => line.slice(0, line.indexOf("{")).trim());
    expect(selectors.length).toBeGreaterThan(0);
    for (const s of selectors) expect(s.startsWith(":where(")).toBe(true);
  });
});

describe("DevelopView", () => {
  it("says how to begin while no photo is open", () => {
    rig();
    render(<DevelopView />);
    expect(screen.getByText("No photo selected")).toBeTruthy();
    expect(screen.getByText("Select a photo in Library to begin editing")).toBeTruthy();
  });

  it("opens fitted and shares its zoom with the status bar both ways", () => {
    const r = rig();
    r.setActivePhoto(photo("a"));
    render(
      <>
        <DevelopView />
        <DevelopStatusBar />
      </>,
    );
    expect([canvasZoom(), barZoom()]).toEqual(["null", "null"]);

    fireEvent.click(screen.getByRole("button", { name: "Zoom canvas" }));
    expect([canvasZoom(), barZoom()]).toEqual(["2", "2"]);

    fireEvent.click(screen.getByRole("button", { name: "100%" }));
    expect([canvasZoom(), barZoom()]).toEqual(["1", "1"]);
  });

  it("forgets the zoom when Develop closes, so it opens fitted again", () => {
    const r = rig();
    r.setActivePhoto(photo("a"));
    const { unmount } = render(<DevelopView />);
    fireEvent.click(screen.getByRole("button", { name: "Zoom canvas" }));
    expect(getZoom()).toBe(2);
    unmount();
    expect(getZoom()).toBeNull();
  });
});

describe("DevelopStatusBar", () => {
  it("renders nothing with no photo open", () => {
    rig();
    const { container } = render(<DevelopStatusBar />);
    expect(container.childNodes.length).toBe(0);
  });

  it("names the photo, a virtual copy by its copy name", () => {
    const r = rig();
    r.setActivePhoto(photo("a", { copyName: "copy" }));
    render(<DevelopStatusBar />);
    expect(screen.getByText("a_copy.ARW")).toBeTruthy();
  });

  it("lays out the toolbar slot and the view controls in core's order", () => {
    const r = rig();
    r.setActivePhoto(photo("a"));
    render(<DevelopStatusBar />);
    const order = [...document.querySelectorAll<HTMLElement>("[data-control]")].map((e) => e.dataset.control);
    expect(order).toEqual([
      "slot:develop-toolbar",
      "assess",
      "proof",
      "processing-update",
      "display-transform",
      "surround",
      "zoom",
    ]);
  });

  it("follows the photo that is open", () => {
    const r = rig();
    r.setActivePhoto(photo("a"));
    render(<DevelopStatusBar />);
    act(() => r.setActivePhoto(photo("b")));
    expect(screen.getByText("b.ARW")).toBeTruthy();
    act(() => r.setActivePhoto(undefined));
    expect(screen.queryByText("b.ARW")).toBeNull();
  });
});

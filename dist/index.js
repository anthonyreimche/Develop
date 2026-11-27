//#region src/rt.ts
var e, t;
function n(n) {
	t = n, e = n.react;
}
//#endregion
//#region src/zoom.ts
var r = null, i = /* @__PURE__ */ new Set();
function a() {
	return r;
}
function o(e) {
	if (e !== r) {
		r = e;
		for (let e of [...i]) e();
	}
}
function s(e) {
	return i.add(e), () => void i.delete(e);
}
function c() {
	return e.useSyncExternalStore(s, a);
}
//#endregion
//#region src/DevelopView.tsx
var l = "sl-develop";
function u(e) {
	return `
:where(.${l}-empty) { text-align: center; color: ${e.textMuted}; }
:where(.${l}-empty-title) { font-size: 0.875rem; line-height: 1.25rem; }
:where(.${l}-empty-hint) { font-size: 0.75rem; line-height: 1rem; }
:where(.${l}-status) { display: flex; width: 100%; align-items: center; justify-content: space-between; }
:where(.${l}-controls) { display: flex; align-items: center; gap: 12px; }
:where(.${l}-photo) { display: flex; min-width: 0; align-items: center; gap: 12px; }
:where(.${l}-name) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
`;
}
function d() {
	let n = c();
	return e.useEffect(() => () => o(null), []), /* @__PURE__ */ e.createElement(e.Fragment, null, t.components.PhotoMetadataControl && /* @__PURE__ */ e.createElement(f, null), /* @__PURE__ */ e.createElement(t.components.DevelopCanvas, {
		zoom: n,
		onZoomChange: o,
		empty: /* @__PURE__ */ e.createElement("div", { className: `${l}-empty` }, /* @__PURE__ */ e.createElement("p", { className: `${l}-empty-title` }, "No photo selected"), /* @__PURE__ */ e.createElement("p", { className: `${l}-empty-hint` }, "Select a photo in Library to begin editing"))
	}));
}
function f() {
	return t.catalog.useCullingShortcuts({
		sizeSteps: !1,
		rowSteps: !1
	}), t.catalog.usePhotoActions().overlays;
}
function p() {
	let n = t.catalog.useActivePhoto(), r = c(), { Slot: i, AssessmentToggle: a, ProofToggle: s, ProcessingUpdateControl: u, DisplayTransformControl: d, SurroundControl: f, ZoomControls: p, PhotoMetadataControl: m } = t.components;
	return n ? /* @__PURE__ */ e.createElement("div", { className: `${l}-status` }, /* @__PURE__ */ e.createElement("div", { className: `${l}-photo` }, /* @__PURE__ */ e.createElement("span", { className: `${l}-name` }, t.catalog.photoDisplayName(n)), m && /* @__PURE__ */ e.createElement(m, null)), /* @__PURE__ */ e.createElement("div", { className: `${l}-controls` }, /* @__PURE__ */ e.createElement(i, { name: "develop-toolbar" }), /* @__PURE__ */ e.createElement(a, null), /* @__PURE__ */ e.createElement(s, null), /* @__PURE__ */ e.createElement(u, null), /* @__PURE__ */ e.createElement(d, null), /* @__PURE__ */ e.createElement(f, null), /* @__PURE__ */ e.createElement(p, {
		zoom: r,
		onChange: o
	}))) : null;
}
//#endregion
//#region src/index.tsx
var m = "develop", h = "safelight.develop.styles";
function g(e) {
	n(e), e.registerStylesheet({
		id: h,
		css: u(e.ui.tokens)
	}), e.registerModule({
		id: m,
		label: "Develop",
		component: d,
		statusBar: p
	});
}
//#endregion
export { m as MODULE_ID, h as STYLESHEET_ID, g as activate };

//# sourceMappingURL=index.js.map
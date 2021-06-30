import {
  T,
  e,
  h,
  n,
  r
} from "./chunk.5PIDMFOE.js";
import {
  __decorateClass
} from "./chunk.IHGPZX35.js";

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/tab-panel/tab-panel.scss
var tab_panel_default = ":host {\n  position: relative;\n  box-sizing: border-box;\n}\n:host *, :host *:before, :host *:after {\n  box-sizing: inherit;\n}\n\n[hidden] {\n  display: none !important;\n}\n\n:host {\n  display: block;\n}\n\n.tab-panel {\n  border: solid 1px transparent;\n  padding: 20px 20px;\n}";

// src/components/tab-panel/tab-panel.ts
var id = 0;
var SlTabPanel = class extends h {
  constructor() {
    super(...arguments);
    this.componentId = `tab-panel-${++id}`;
    this.name = "";
    this.active = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.id = this.id || this.componentId;
  }
  render() {
    this.style.display = this.active ? "block" : "none";
    return T`
      <div
        part="base"
        class="tab-panel"
        role="tabpanel"
        aria-selected=${this.active ? "true" : "false"}
        aria-hidden=${this.active ? "false" : "true"}
      >
        <slot></slot>
      </div>
    `;
  }
};
SlTabPanel.styles = r(tab_panel_default);
__decorateClass([
  e()
], SlTabPanel.prototype, "name", 2);
__decorateClass([
  e({ type: Boolean, reflect: true })
], SlTabPanel.prototype, "active", 2);
SlTabPanel = __decorateClass([
  n("sl-tab-panel")
], SlTabPanel);
var tab_panel_default2 = SlTabPanel;

export {
  tab_panel_default2 as tab_panel_default
};

import {
  requestInclude
} from "./chunk.DTM5B7PO.js";
import {
  event,
  watch
} from "./chunk.XX234VRK.js";
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

// _uyihdawu1:/Users/claviska/Projects/shoelace/src/components/include/include.scss
var include_default = ":host {\n  display: block;\n}";

// src/components/include/include.ts
var SlInclude = class extends h {
  constructor() {
    super(...arguments);
    this.mode = "cors";
    this.allowScripts = false;
  }
  connectedCallback() {
    super.connectedCallback();
    this.loadSource();
  }
  executeScript(script) {
    const newScript = document.createElement("script");
    [...script.attributes].map((attr) => newScript.setAttribute(attr.name, attr.value));
    newScript.textContent = script.textContent;
    script.parentNode.replaceChild(newScript, script);
  }
  async loadSource() {
    try {
      const src = this.src;
      const file = await requestInclude(src, this.mode);
      if (src !== this.src) {
        return;
      }
      if (!file) {
        return;
      }
      if (!file.ok) {
        this.slError.emit({ detail: { status: file.status } });
        return;
      }
      this.innerHTML = file.html;
      if (this.allowScripts) {
        [...this.querySelectorAll("script")].map((script) => this.executeScript(script));
      }
      this.slLoad.emit();
    } catch (e2) {
      this.slError.emit({ detail: { status: -1 } });
    }
  }
  render() {
    return T`<slot></slot>`;
  }
};
SlInclude.styles = r(include_default);
__decorateClass([
  e()
], SlInclude.prototype, "src", 2);
__decorateClass([
  e()
], SlInclude.prototype, "mode", 2);
__decorateClass([
  e({ attribute: "allow-scripts", type: Boolean })
], SlInclude.prototype, "allowScripts", 2);
__decorateClass([
  event("sl-load")
], SlInclude.prototype, "slLoad", 2);
__decorateClass([
  event("sl-error")
], SlInclude.prototype, "slError", 2);
__decorateClass([
  watch("src")
], SlInclude.prototype, "loadSource", 1);
SlInclude = __decorateClass([
  n("sl-include")
], SlInclude);
var include_default2 = SlInclude;

export {
  include_default2 as include_default
};

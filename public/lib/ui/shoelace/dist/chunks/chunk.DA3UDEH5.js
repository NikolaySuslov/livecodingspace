import {
  i,
  s,
  t
} from "./chunk.VIWFLAGR.js";
import {
  w
} from "./chunk.5PIDMFOE.js";

// node_modules/lit-html/directives/style-map.js
var i2 = i(class extends s {
  constructor(t2) {
    var e;
    if (super(t2), t2.type !== t.ATTRIBUTE || t2.name !== "style" || ((e = t2.strings) === null || e === void 0 ? void 0 : e.length) > 2)
      throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).reduce((e, r) => {
      const s2 = t2[r];
      return s2 == null ? e : e + `${r = r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g, "-$&").toLowerCase()}:${s2};`;
    }, "");
  }
  update(e, [r]) {
    const { style: s2 } = e.element;
    if (this.St === void 0) {
      this.St = new Set();
      for (const t2 in r)
        this.St.add(t2);
      return this.render(r);
    }
    this.St.forEach((t2) => {
      r[t2] == null && (this.St.delete(t2), t2.includes("-") ? s2.removeProperty(t2) : s2[t2] = "");
    });
    for (const t2 in r) {
      const e2 = r[t2];
      e2 != null && (this.St.add(t2), t2.includes("-") ? s2.setProperty(t2, e2) : s2[t2] = e2);
    }
    return w;
  }
});

export {
  i2 as i
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

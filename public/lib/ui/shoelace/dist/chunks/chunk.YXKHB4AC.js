import {
  i,
  s,
  t
} from "./chunk.VIWFLAGR.js";
import {
  w
} from "./chunk.5PIDMFOE.js";

// node_modules/lit-html/directives/class-map.js
var e = i(class extends s {
  constructor(t2) {
    var s2;
    if (super(t2), t2.type !== t.ATTRIBUTE || t2.name !== "class" || ((s2 = t2.strings) === null || s2 === void 0 ? void 0 : s2.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(t2) {
    return Object.keys(t2).filter((s2) => t2[s2]).join(" ");
  }
  update(s2, [r]) {
    if (this.bt === void 0) {
      this.bt = new Set();
      for (const t2 in r)
        r[t2] && this.bt.add(t2);
      return this.render(r);
    }
    const i2 = s2.element.classList;
    this.bt.forEach((t2) => {
      t2 in r || (i2.remove(t2), this.bt.delete(t2));
    });
    for (const t2 in r) {
      const s3 = !!r[t2];
      s3 !== this.bt.has(t2) && (s3 ? (i2.add(t2), this.bt.add(t2)) : (i2.remove(t2), this.bt.delete(t2)));
    }
    return w;
  }
});

export {
  e
};
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

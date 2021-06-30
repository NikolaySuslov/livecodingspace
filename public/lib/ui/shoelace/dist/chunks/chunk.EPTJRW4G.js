import {
  i,
  s,
  t
} from "./chunk.VIWFLAGR.js";
import {
  A,
  w
} from "./chunk.5PIDMFOE.js";

// node_modules/lit-html/directives/unsafe-html.js
var n = class extends s {
  constructor(i2) {
    if (super(i2), this.vt = A, i2.type !== t.CHILD)
      throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(r) {
    if (r === A)
      return this.Vt = void 0, this.vt = r;
    if (r === w)
      return r;
    if (typeof r != "string")
      throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (r === this.vt)
      return this.Vt;
    this.vt = r;
    const s2 = [r];
    return s2.raw = s2, this.Vt = { _$litType$: this.constructor.resultType, strings: s2, values: [] };
  }
};
n.directiveName = "unsafeHTML", n.resultType = 1;
var o = i(n);

export {
  n,
  o
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

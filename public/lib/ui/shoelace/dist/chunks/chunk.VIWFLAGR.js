// node_modules/lit-html/directive.js
var t = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 };
var i = (t2) => (...i2) => ({ _$litDirective$: t2, values: i2 });
var s = class {
  constructor(t2) {
  }
  T(t2, i2, s2) {
    this.\u03A3dt = t2, this.M = i2, this.\u03A3ct = s2;
  }
  S(t2, i2) {
    return this.update(t2, i2);
  }
  update(t2, i2) {
    return this.render(...i2);
  }
};

export {
  t,
  i,
  s
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

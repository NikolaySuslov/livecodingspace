'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var solidJs = require('solid-js');
var stream = require('stream');

const booleans = ["allowfullscreen", "allowpaymentrequest", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "ismap", "itemscope", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected", "truespeed"];
const BooleanAttributes = new Set(booleans);
const Aliases = {
  className: "class",
  htmlFor: "for"
};

function renderToString(code, options = {}) {
  solidJs.sharedConfig.context = {
    id: "",
    count: 0
  };
  return {
    html: resolveSSRNode(code()),
    script: generateHydrationScript(options)
  };
}
function renderToStringAsync(code, options = {}) {
  options = {
    timeoutMs: 30000,
    ...options
  };
  let resources;
  solidJs.sharedConfig.context = {
    id: "",
    count: 0,
    resources: resources = {},
    suspense: {},
    async: true
  };
  const timeout = new Promise((_, reject) => setTimeout(() => reject("renderToString timed out"), options.timeoutMs));
  return Promise.race([solidJs.awaitSuspense(code), timeout]).then(res => {
    return {
      html: resolveSSRNode(res),
      script: generateHydrationScript({
        resources,
        ...options
      })
    };
  });
}
function renderToNodeStream(code, options = {}) {
  const stream$1 = new stream.Readable({
    read() {}
  });
  solidJs.sharedConfig.context = {
    id: "",
    count: 0,
    streaming: true,
    suspense: {}
  };
  let count = 0,
      completed = 0,
      checkEnd = () => {
    if (completed === count) stream$1.push(null);
  };
  solidJs.sharedConfig.context.writeResource = (id, p) => {
    count++;
    Promise.resolve().then(() => stream$1.push(`<script${options.nonce ? ` nonce="${options.nonce}"` : ""}>_$HYDRATION.startResource("${id}")</script>`));
    p.then(d => {
      stream$1.push(`<script${options.nonce ? ` nonce="${options.nonce}"` : ""}>_$HYDRATION.resolveResource("${id}", ${(JSON.stringify(d) || "undefined").replace(/'/g, "\\'").replace(/\\\"/g, '\\\\\\"')})</script>`);
      ++completed && checkEnd();
    });
  };
  stream$1.push(resolveSSRNode(code()));
  setTimeout(checkEnd);
  return {
    stream: stream$1,
    script: generateHydrationScript({
      streaming: true,
      ...options
    })
  };
}
function renderToWebStream(code, options = {}) {
  let checkEnd;
  const tmp = [];
  const encoder = new TextEncoder();
  const done = new Promise(resolve => {
    checkEnd = () => {
      if (completed === count) resolve();
    };
  });
  solidJs.sharedConfig.context = {
    id: "",
    count: 0,
    streaming: true
  };
  let count = 0,
      completed = 0,
      writer = {
    write(payload) {
      tmp.push(payload);
    }
  };
  solidJs.sharedConfig.context.writeResource = (id, p) => {
    count++;
    Promise.resolve().then(() => writer.write(encoder.encode(`<script${options.nonce ? ` nonce="${options.nonce}"` : ""}>_$HYDRATION.startResource("${id}")</script>`)));
    p.then(d => {
      writer.write(encoder.encode(`<script${options.nonce ? ` nonce="${options.nonce}"` : ""}>_$HYDRATION.resolveResource("${id}", ${(JSON.stringify(d) || "undefined").replace(/'/g, "\\'").replace(/\\\"/g, '\\\\\\"')})</script>`));
      ++completed && checkEnd();
    });
  };
  writer.write(encoder.encode(resolveSSRNode(code())));
  return {
    writeTo(w) {
      writer = w;
      tmp.map(chunk => writer.write(chunk));
      setTimeout(checkEnd);
      return done;
    },
    script: generateHydrationScript({
      streaming: true,
      ...options
    })
  };
}
function ssr(t, ...nodes) {
  if (nodes.length) {
    let result = "";
    for (let i = 0; i < t.length; i++) {
      result += t[i];
      const node = nodes[i];
      if (node !== undefined) result += resolveSSRNode(node);
    }
    t = result;
  }
  return {
    t
  };
}
function ssrClassList(value) {
  let classKeys = Object.keys(value),
      result = "";
  for (let i = 0, len = classKeys.length; i < len; i++) {
    const key = classKeys[i],
          classValue = !!value[key];
    if (!key || !classValue) continue;
    i && (result += " ");
    result += key;
  }
  return result;
}
function ssrStyle(value) {
  if (typeof value === "string") return value;
  let result = "";
  const k = Object.keys(value);
  for (let i = 0; i < k.length; i++) {
    const s = k[i];
    if (i) result += ";";
    result += `${s}:${escape(value[s], true)}`;
  }
  return result;
}
function ssrSpread(props, isSVG, skipChildren) {
  if (typeof props === "function") props = props();
  const keys = Object.keys(props);
  let result = "";
  for (let i = 0; i < keys.length; i++) {
    const prop = keys[i];
    if (prop === "children") {
      !skipChildren && console.warn(`SSR currently does not support spread children.`);
      continue;
    }
    const value = props[prop];
    if (prop === "style") {
      result += `style="${ssrStyle(value)}"`;
    } else if (prop === "classList") {
      result += `class="${ssrClassList(value)}"`;
    } else if (BooleanAttributes.has(prop)) {
      if (value) result += prop;else continue;
    } else {
      result += `${Aliases[prop] || prop}="${escape(value, true)}"`;
    }
    if (i !== keys.length - 1) result += " ";
  }
  return result;
}
function ssrBoolean(key, value) {
  return value ? " " + key : "";
}
function escape(s, attr) {
  const t = typeof s;
  if (t !== "string") {
    if (attr && t === "boolean") return String(s);
    return s;
  }
  const delim = attr ? '"' : "<";
  const escDelim = attr ? "&quot;" : "&lt;";
  let iDelim = s.indexOf(delim);
  let iAmp = s.indexOf("&");
  if (iDelim < 0 && iAmp < 0) return s;
  let left = 0,
      out = "";
  while (iDelim >= 0 && iAmp >= 0) {
    if (iDelim < iAmp) {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } else {
      if (left < iAmp) out += s.substring(left, iAmp);
      out += "&amp;";
      left = iAmp + 1;
      iAmp = s.indexOf("&", left);
    }
  }
  if (iDelim >= 0) {
    do {
      if (left < iDelim) out += s.substring(left, iDelim);
      out += escDelim;
      left = iDelim + 1;
      iDelim = s.indexOf(delim, left);
    } while (iDelim >= 0);
  } else while (iAmp >= 0) {
    if (left < iAmp) out += s.substring(left, iAmp);
    out += "&amp;";
    left = iAmp + 1;
    iAmp = s.indexOf("&", left);
  }
  return left < s.length ? out + s.substring(left) : out;
}
function resolveSSRNode(node) {
  const t = typeof node;
  if (t === "string") return node;
  if (node == null || t === "boolean") return "";
  if (Array.isArray(node)) return node.map(resolveSSRNode).join("");
  if (t === "object") return resolveSSRNode(node.t);
  if (t === "function") return resolveSSRNode(node());
  return String(node);
}
function getHydrationKey() {
  const hydrate = solidJs.sharedConfig.context;
  return `${hydrate.id}${hydrate.count++}`;
}
function generateHydrationScript({
  eventNames = ["click", "input"],
  streaming,
  resources,
  nonce
} = {}) {
  let s = `<script${nonce ? ` nonce="${nonce}"` : ""}>(()=>{_$HYDRATION={events:[],completed:new WeakSet};const t=e=>e&&e.hasAttribute&&(e.hasAttribute("data-hk")&&e||t(e.host&&e.host instanceof Node?e.host:e.parentNode)),e=e=>{let o=e.composedPath&&e.composedPath()[0]||e.target,s=t(o);s&&!_$HYDRATION.completed.has(s)&&_$HYDRATION.events.push([s,e])};["${eventNames.join('","')}"].forEach(t=>document.addEventListener(t,e))})();`;
  if (streaming) {
    s += `(()=>{const e=_$HYDRATION,o={};e.startResource=e=>{let r;o[e]=[new Promise(e=>r=e),r]},e.resolveResource=(e,r)=>{const n=o[e];if(!n)return o[e]=[r];n[1](r)},e.loadResource=e=>{const r=o[e];if(r)return r[0]}})();`;
  }
  if (resources) s += `_$HYDRATION.resources = JSON.parse('${JSON.stringify(Object.keys(resources).reduce((r, k) => {
    r[k] = resources[k].data;
    return r;
  }, {})).replace(/'/g, "\\'").replace(/\\\"/g, '\\\\\\"')}');`;
  return s + `</script>`;
}

const isServer = true;
function spread() {}
function Dynamic(props) {
  const [p, others] = solidJs.splitProps(props, ["component"]);
  const comp = p.component,
        t = typeof comp;
  if (comp) {
    if (t === "function") return comp(others);else if (t === "string") {
      const [local, sOthers] = solidJs.splitProps(others, ["children"]);
      return ssr([`<${comp} `, ">", `</${comp}>`], ssrSpread(sOthers), local.children || "");
    }
  }
}
function Portal(props) {
  return "";
}

Object.defineProperty(exports, 'ErrorBoundary', {
  enumerable: true,
  get: function () {
    return solidJs.ErrorBoundary;
  }
});
Object.defineProperty(exports, 'For', {
  enumerable: true,
  get: function () {
    return solidJs.For;
  }
});
Object.defineProperty(exports, 'Index', {
  enumerable: true,
  get: function () {
    return solidJs.Index;
  }
});
Object.defineProperty(exports, 'Match', {
  enumerable: true,
  get: function () {
    return solidJs.Match;
  }
});
Object.defineProperty(exports, 'Show', {
  enumerable: true,
  get: function () {
    return solidJs.Show;
  }
});
Object.defineProperty(exports, 'Suspense', {
  enumerable: true,
  get: function () {
    return solidJs.Suspense;
  }
});
Object.defineProperty(exports, 'SuspenseList', {
  enumerable: true,
  get: function () {
    return solidJs.SuspenseList;
  }
});
Object.defineProperty(exports, 'Switch', {
  enumerable: true,
  get: function () {
    return solidJs.Switch;
  }
});
Object.defineProperty(exports, 'createComponent', {
  enumerable: true,
  get: function () {
    return solidJs.createComponent;
  }
});
Object.defineProperty(exports, 'mergeProps', {
  enumerable: true,
  get: function () {
    return solidJs.mergeProps;
  }
});
exports.Dynamic = Dynamic;
exports.Portal = Portal;
exports.escape = escape;
exports.getHydrationKey = getHydrationKey;
exports.isServer = isServer;
exports.renderToNodeStream = renderToNodeStream;
exports.renderToString = renderToString;
exports.renderToStringAsync = renderToStringAsync;
exports.renderToWebStream = renderToWebStream;
exports.resolveSSRNode = resolveSSRNode;
exports.spread = spread;
exports.ssr = ssr;
exports.ssrBoolean = ssrBoolean;
exports.ssrClassList = ssrClassList;
exports.ssrSpread = ssrSpread;
exports.ssrStyle = ssrStyle;

'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const equalFn = (a, b) => a === b;
const ERROR = Symbol("error");
const UNOWNED = {
  context: null,
  owner: null
};
let Owner = null;
function createRoot(fn, detachedOwner) {
  detachedOwner && (Owner = detachedOwner);
  const owner = Owner,
        root = fn.length === 0 ? UNOWNED : {
    context: null,
    owner
  };
  Owner = root;
  let result;
  try {
    result = fn(() => {});
  } catch (err) {
    const fns = lookup(Owner, ERROR);
    if (!fns) throw err;
    fns.forEach(f => f(err));
  } finally {
    Owner = owner;
  }
  return result;
}
function createSignal(value) {
  return [() => value, v => value = v];
}
function createComputed(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  fn(value);
  Owner = Owner.owner;
}
const createRenderEffect = createComputed;
function createEffect(fn, value) {}
function createMemo(fn, value) {
  Owner = {
    owner: Owner,
    context: null
  };
  const v = fn(value);
  Owner = Owner.owner;
  return () => v;
}
function createDeferred(source) {
  return source;
}
function createSelector(source, fn) {
  return k => fn(k, source());
}
function batch(fn) {
  return fn();
}
const untrack = batch;
function on(deps, fn, options = {}) {
  let isArray = Array.isArray(deps);
  let defer = options.defer;
  return () => {
    if (defer) return undefined;
    let value;
    if (isArray) {
      value = [];
      for (let i = 0; i < deps.length; i++) value.push(deps[i]());
    } else value = deps();
    return fn(value, undefined);
  };
}
function onMount(fn) {}
function onCleanup(fn) {}
function onError(fn) {
  if (Owner === null) console.warn("error handlers created outside a `createRoot` or `render` will never be run");else if (Owner.context === null) Owner.context = {
    [ERROR]: [fn]
  };else if (!Owner.context[ERROR]) Owner.context[ERROR] = [fn];else Owner.context[ERROR].push(fn);
}
function getListener() {
  return null;
}
function createContext(defaultValue) {
  const id = Symbol("context");
  return {
    id,
    Provider: createProvider(id),
    defaultValue
  };
}
function useContext(context) {
  return lookup(Owner, context.id) || context.defaultValue;
}
function getOwner() {
  return Owner;
}
function children(fn) {
  return createMemo(() => resolveChildren(fn()));
}
function runWithOwner(o, fn) {
  const prev = Owner;
  Owner = o;
  try {
    return fn();
  } finally {
    Owner = prev;
  }
}
function lookup(owner, key) {
  return owner && (owner.context && owner.context[key] || owner.owner && lookup(owner.owner, key));
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      let result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}
function createProvider(id) {
  return function provider(props) {
    return createMemo(() => {
      Owner.context = {
        [id]: props.value
      };
      return children(() => props.children);
    });
  };
}
function requestCallback(fn, options) {
  return {
    id: 0,
    fn: () => {},
    startTime: 0,
    expirationTime: 0
  };
}
const $RAW = Symbol("state-raw");
function isWrappable(obj) {
  return obj != null && typeof obj === "object" && (obj.__proto__ === Object.prototype || Array.isArray(obj));
}
function unwrap(item) {
  return item;
}
function setProperty(state, property, value, force) {
  if (!force && state[property] === value) return;
  if (value === undefined) {
    delete state[property];
  } else state[property] = value;
}
function mergeState(state, value, force) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key], force);
  }
}
function updatePath(current, path, traversed = []) {
  let part,
      next = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
          isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), [part[i]].concat(traversed));
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), [i].concat(traversed));
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), [i].concat(traversed));
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    next = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(next, traversed);
    if (value === next) return;
  }
  if (part === undefined && value == undefined) return;
  if (part === undefined || isWrappable(next) && isWrappable(value) && !Array.isArray(value)) {
    mergeState(next, value);
  } else setProperty(current, part, value);
}
function createState(state) {
  function setState(...args) {
    updatePath(state, args);
  }
  return [state, setState];
}
function reconcile(value, options = {}) {
  return state => {
    if (!isWrappable(state)) return value;
    const targetKeys = Object.keys(value);
    for (let i = 0, len = targetKeys.length; i < len; i++) {
      const key = targetKeys[i];
      setProperty(state, key, value[key]);
    }
    const previousKeys = Object.keys(state);
    for (let i = 0, len = previousKeys.length; i < len; i++) {
      if (value[previousKeys[i]] === undefined) setProperty(state, previousKeys[i], undefined);
    }
  };
}
function produce(fn) {
  return state => {
    if (isWrappable(state)) fn(state);
    return state;
  };
}
function mapArray(list, mapFn, options = {}) {
  const items = list();
  let s = [];
  if (items.length) {
    for (let i = 0, len = items.length; i < len; i++) s.push(mapFn(items[i], () => i));
  } else if (options.fallback) s = [options.fallback()];
  return () => s;
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
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}
function nextHydrateContext() {
  return sharedConfig.context ? { ...sharedConfig.context,
    id: `${sharedConfig.context.id}${sharedConfig.context.count++}.`,
    count: 0
  } : undefined;
}
function createComponent(Comp, props) {
  if (sharedConfig.context) {
    const c = sharedConfig.context;
    setHydrateContext(nextHydrateContext());
    const r = Comp(props);
    setHydrateContext(c);
    return r;
  }
  return Comp(props);
}
function mergeProps(...sources) {
  const target = {};
  for (let i = 0; i < sources.length; i++) {
    const descriptors = Object.getOwnPropertyDescriptors(sources[i]);
    Object.defineProperties(target, descriptors);
  }
  return target;
}
function splitProps(props, ...keys) {
  const descriptors = Object.getOwnPropertyDescriptors(props),
        split = k => {
    const clone = {};
    for (let i = 0; i < k.length; i++) {
      const key = k[i];
      if (descriptors[key]) {
        Object.defineProperty(clone, key, descriptors[key]);
        delete descriptors[key];
      }
    }
    return clone;
  };
  return keys.map(split).concat(split(Object.keys(descriptors)));
}
function simpleMap(props, wrap) {
  const list = props.each || [],
        len = list.length,
        fn = props.children;
  if (len) {
    let mapped = "";
    for (let i = 0; i < len; i++) mapped += resolveSSRNode(wrap(fn, list[i], i));
    return {
      t: mapped
    };
  }
  return props.fallback || "";
}
function For(props) {
  return simpleMap(props, (fn, item, i) => fn(item, () => i));
}
function Index(props) {
  return simpleMap(props, (fn, item, i) => fn(() => item, i));
}
function Show(props) {
  let c;
  return props.when ? typeof (c = props.children) === "function" ? c(props.when) : c : props.fallback || "";
}
function Switch(props) {
  let conditions = props.children;
  Array.isArray(conditions) || (conditions = [conditions]);
  for (let i = 0; i < conditions.length; i++) {
    const w = conditions[i].when;
    if (w) {
      const c = conditions[i].children;
      return typeof c === "function" ? c(w) : c;
    }
  }
  return props.fallback || "";
}
function Match(props) {
  return props;
}
function ErrorBoundary(props) {
  return props.children;
}
const SuspenseContext = createContext();
let resourceContext = null;
function createResource(fn, fetcher, options = {}) {
  if (arguments.length === 2) {
    if (typeof fetcher === "object") {
      options = fetcher;
      fetcher = fn;
      fn = true;
    }
  } else if (arguments.length === 1) {
    fetcher = fn;
    fn = true;
  }
  const contexts = new Set();
  const id = sharedConfig.context.id + sharedConfig.context.count++;
  let resource = {};
  let value = options.initialValue;
  let p;
  if (sharedConfig.context.async) {
    resource = sharedConfig.context.resources[id] || (sharedConfig.context.resources[id] = {});
    if (resource.ref) {
      if (!resource.data && !resource.ref[0].loading) resource.ref[1].refetch();
      return resource.ref;
    }
  }
  const read = () => {
    if (resourceContext && p) resourceContext.push(p);
    const resolved = sharedConfig.context.async && sharedConfig.context.resources[id].data;
    if (sharedConfig.context.async && !resolved) {
      const ctx = useContext(SuspenseContext);
      if (ctx) {
        ctx.resources.set(id, read);
        contexts.add(ctx);
      }
    }
    return resolved ? sharedConfig.context.resources[id].data : value;
  };
  read.loading = false;
  function load() {
    const ctx = sharedConfig.context;
    if (!ctx.async && !ctx.streaming) return;
    if (ctx.resources && id in ctx.resources && ctx.resources[id].data) {
      value = ctx.resources[id].data;
      return;
    }
    resourceContext = [];
    const lookup = typeof fn === "function" ? fn() : fn;
    if (resourceContext.length) {
      p = Promise.all(resourceContext).then(() => fetcher(fn(), () => value));
    }
    resourceContext = null;
    if (!p) {
      if (lookup == null || lookup === false) return;
      p = fetcher(lookup, () => value);
    }
    read.loading = true;
    if ("then" in p) {
      if (ctx.writeResource) {
        ctx.writeResource(id, p);
        p.then(v => {
          value = v;
          read.loading = false;
          p = null;
        });
        return;
      }
      p.then(res => {
        read.loading = false;
        ctx.resources[id].data = res;
        p = null;
        notifySuspense(contexts);
        return res;
      });
      return;
    }
    ctx.resources[id].data = p;
    p = null;
  }
  load();
  return resource.ref = [read, {
    refetch: load,
    mutate: v => value = v
  }];
}
function lazy(fn) {
  let resolved;
  const p = fn();
  const contexts = new Set();
  p.then(mod => resolved = mod.default);
  const wrap = props => {
    const id = sharedConfig.context.id + sharedConfig.context.count++;
    if (resolved) return resolved(props);
    const ctx = useContext(SuspenseContext);
    const track = {
      loading: true
    };
    if (ctx) {
      ctx.resources.set(id, track);
      contexts.add(ctx);
    }
    p.then(() => {
      track.loading = false;
      notifySuspense(contexts);
    });
    return "";
  };
  wrap.preload = () => {};
  return wrap;
}
function suspenseComplete(c) {
  for (let r of c.resources.values()) {
    if (r.loading) return false;
  }
  return true;
}
function notifySuspense(contexts) {
  for (const c of contexts) {
    if (suspenseComplete(c)) c.completed();
  }
  contexts.clear();
}
function useTransition() {
  return [() => false, fn => {
    fn();
  }];
}
function SuspenseList(props) {
  return props.children;
}
const SUSPENSE_GLOBAL = Symbol("suspense-global");
function Suspense(props) {
  const ctx = sharedConfig.context;
  if (ctx.streaming) createComponent(() => props.children, {});
  if (!ctx.async) return props.fallback;
  const id = ctx.id + ctx.count;
  const done = ctx.async ? lookup(Owner, SUSPENSE_GLOBAL)(id) : () => {};
  const o = Owner;
  const value = ctx.suspense[id] || (ctx.suspense[id] = {
    resources: new Map(),
    completed: () => {
      const res = runSuspense();
      if (suspenseComplete(value)) {
        done(resolveSSRNode(res));
      }
    }
  });
  function runSuspense() {
    setHydrateContext({ ...ctx,
      count: 0
    });
    return runWithOwner(o, () => {
      return createComponent(SuspenseContext.Provider, {
        value,
        get children() {
          return props.children;
        }
      });
    });
  }
  const res = runSuspense();
  if (suspenseComplete(value)) {
    done();
    return res;
  }
  return sharedConfig.context.async ? {
    t: `<#${id}#>`
  } : props.fallback;
}
const SUSPENSE_REPLACE = /<#([0-9\.]+)\#>/;
function awaitSuspense(fn) {
  return new Promise(resolve => {
    const registry = new Set();
    const cache = Object.create(null);
    const res = createMemo(() => {
      Owner.context = {
        [SUSPENSE_GLOBAL]: getCallback
      };
      return fn();
    });
    if (!registry.size) resolve(res());
    function getCallback(key) {
      registry.add(key);
      return value => {
        if (value) cache[key] = value;
        registry.delete(key);
        if (!registry.size) Promise.resolve().then(() => {
          let source = resolveSSRNode(res());
          let final = "";
          let match;
          while (match = source.match(SUSPENSE_REPLACE)) {
            final += source.substring(0, match.index);
            source = cache[match[1]] + source.substring(match.index + match[0].length);
          }
          resolve(final + source);
        });
      };
    }
  });
}

exports.$RAW = $RAW;
exports.ErrorBoundary = ErrorBoundary;
exports.For = For;
exports.Index = Index;
exports.Match = Match;
exports.Show = Show;
exports.Suspense = Suspense;
exports.SuspenseList = SuspenseList;
exports.Switch = Switch;
exports.awaitSuspense = awaitSuspense;
exports.batch = batch;
exports.createComponent = createComponent;
exports.createComputed = createComputed;
exports.createContext = createContext;
exports.createDeferred = createDeferred;
exports.createEffect = createEffect;
exports.createMemo = createMemo;
exports.createRenderEffect = createRenderEffect;
exports.createResource = createResource;
exports.createRoot = createRoot;
exports.createSelector = createSelector;
exports.createSignal = createSignal;
exports.createState = createState;
exports.equalFn = equalFn;
exports.getListener = getListener;
exports.getOwner = getOwner;
exports.lazy = lazy;
exports.mapArray = mapArray;
exports.mergeProps = mergeProps;
exports.on = on;
exports.onCleanup = onCleanup;
exports.onError = onError;
exports.onMount = onMount;
exports.produce = produce;
exports.reconcile = reconcile;
exports.requestCallback = requestCallback;
exports.runWithOwner = runWithOwner;
exports.sharedConfig = sharedConfig;
exports.splitProps = splitProps;
exports.untrack = untrack;
exports.unwrap = unwrap;
exports.useContext = useContext;
exports.useTransition = useTransition;

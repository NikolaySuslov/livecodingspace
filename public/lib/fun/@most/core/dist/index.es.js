import { append, apply, compose, curry2, curry3, findIndex, id, map, reduce, remove } from '@most/prelude';
import { asap, cancelTask, currentTime, delay, periodic, schedulerRelativeTo } from '@most/scheduler';
import { disposeAll, disposeBoth, disposeNone, disposeOnce, tryDispose } from '@most/disposable';

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function fatalError(e) {
  setTimeout(rethrow, 0, e);
}

function rethrow(e) {
  throw e;
}

var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};











var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var propagateTask$1 = function propagateTask(run, value, sink) {
  return new PropagateTask(run, value, sink);
};

var propagateEventTask$1 = function propagateEventTask(value, sink) {
  return propagateTask$1(runEvent, value, sink);
};

var propagateEndTask = function propagateEndTask(sink) {
  return propagateTask$1(runEnd, undefined, sink);
};

var propagateErrorTask$1 = function propagateErrorTask(value, sink) {
  return propagateTask$1(runError, value, sink);
};

var PropagateTask = /*#__PURE__*/function () {
  function PropagateTask(run, value, sink) {
    classCallCheck(this, PropagateTask);

    this._run = run;
    this.value = value;
    this.sink = sink;
    this.active = true;
  }

  PropagateTask.prototype.dispose = function dispose() {
    this.active = false;
  };

  PropagateTask.prototype.run = function run(t) {
    if (!this.active) {
      return;
    }
    var run = this._run;
    run(t, this.value, this.sink);
  };

  PropagateTask.prototype.error = function error(t, e) {
    // TODO: Remove this check and just do this.sink.error(t, e)?
    if (!this.active) {
      return fatalError(e);
    }
    this.sink.error(t, e);
  };

  return PropagateTask;
}();

var runEvent = function runEvent(t, x, sink) {
  return sink.event(t, x);
};

var runEnd = function runEnd(t, _, sink) {
  return sink.end(t);
};

var runError = function runError(t, e, sink) {
  return sink.error(t, e);
};

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var empty = function empty() {
  return EMPTY;
};

var isCanonicalEmpty = function isCanonicalEmpty(stream) {
  return stream === EMPTY;
};

var containsCanonicalEmpty = function containsCanonicalEmpty(streams) {
  return streams.some(isCanonicalEmpty);
};

var Empty = /*#__PURE__*/function () {
  function Empty() {
    classCallCheck(this, Empty);
  }

  Empty.prototype.run = function run(sink, scheduler$$1) {
    return asap(propagateEndTask(sink), scheduler$$1);
  };

  return Empty;
}();

var EMPTY = /*#__PURE__*/new Empty();

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var never = function never() {
  return NEVER;
};

var Never = /*#__PURE__*/function () {
  function Never() {
    classCallCheck(this, Never);
  }

  Never.prototype.run = function run() {
    return disposeNone();
  };

  return Never;
}();

var NEVER = /*#__PURE__*/new Never();

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var at = function at(t, x) {
  return new At(t, x);
};

var At = /*#__PURE__*/function () {
  function At(t, x) {
    classCallCheck(this, At);

    this.time = t;
    this.value = x;
  }

  At.prototype.run = function run(sink, scheduler$$1) {
    return delay(this.time, propagateTask$1(runAt, this.value, sink), scheduler$$1);
  };

  return At;
}();

function runAt(t, x, sink) {
  sink.event(t, x);
  sink.end(t);
}

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var now = function now(x) {
  return at(0, x);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream of events that occur at a regular period
 * @param {Number} period periodicity of events
 * @returns {Stream} new stream of periodic events, the event value is undefined
 */
var periodic$1 = function periodic$$1(period) {
  return new Periodic(period);
};

var Periodic = /*#__PURE__*/function () {
  function Periodic(period) {
    classCallCheck(this, Periodic);

    this.period = period;
  }

  Periodic.prototype.run = function run(sink, scheduler$$1) {
    return periodic(this.period, propagateEventTask$1(undefined, sink), scheduler$$1);
  };

  return Periodic;
}();

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var newStream = function newStream(run) {
  return new Stream(run);
};

var Stream = function Stream(run) {
  classCallCheck(this, Stream);

  this.run = run;
};

/** @license MIT License (c) copyright 2010-2017 original author or authors */
/** @author Brian Cavalier */

var Pipe = /*#__PURE__*/function () {
  function Pipe(sink) {
    classCallCheck(this, Pipe);

    this.sink = sink;
  }

  Pipe.prototype.event = function event(t, x) {
    return this.sink.event(t, x);
  };

  Pipe.prototype.end = function end(t) {
    return this.sink.end(t);
  };

  Pipe.prototype.error = function error(t, e) {
    return this.sink.error(t, e);
  };

  return Pipe;
}();

/** @license MIT License (c) copyright 2010 original author or authors */

// A slice Bounds type that narrows min values via accumulation
// and max values via Math.min.
// type Bounds = { min: number, max: number }
// Notes:
// 0 <= min <= max
// slice(min2, max2, slice(min1, max1, s)) ~ slice(min1 + min2, Math.min(max1, min1 + max2), s)
// A bounds has a 1d coord system with origin 0, extending to Infinity.  Both min and max
// are relative to the origin (0).  However, when merging bounds b1 and b2, we
// *interpret* b2 as being relative to b1, hence adding min1 to *both* min2 and max2.
// This essentially translates b2's coordinates back into origin coordinates
// as bounds are merged.

// Construct a constrained bounds
var boundsFrom = function boundsFrom(unsafeMin, unsafeMax) {
  var min = Math.max(0, unsafeMin);
  var max = Math.max(min, unsafeMax);
  return { min: min, max: max };
};

// Combine 2 bounds by narrowing min and max
var mergeBounds = function mergeBounds(b1, b2) {
  return boundsFrom(b1.min + b2.min, Math.min(b1.max, b1.min + b2.max));
};

// Nil bounds excludes all slice indices
var isNilBounds = function isNilBounds(b) {
  return b.min >= b.max;
};

// Infinite bounds includes all slice indices
var isInfiniteBounds = function isInfiniteBounds(b) {
  return b.min <= 0 && b.max === Infinity;
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var Filter = /*#__PURE__*/function () {
  function Filter(p, source) {
    classCallCheck(this, Filter);

    this.p = p;
    this.source = source;
  }

  Filter.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new FilterSink(this.p, sink), scheduler$$1);
  };

  /**
   * Create a filtered source, fusing adjacent filter.filter if possible
   * @param {function(x:*):boolean} p filtering predicate
   * @param {{run:function}} source source to filter
   * @returns {Filter} filtered source
   */


  Filter.create = function create(p, source) {
    if (isCanonicalEmpty(source)) {
      return source;
    }

    if (source instanceof Filter) {
      return new Filter(and(source.p, p), source.source);
    }

    return new Filter(p, source);
  };

  return Filter;
}();

var FilterSink = /*#__PURE__*/function (_Pipe) {
  inherits(FilterSink, _Pipe);

  function FilterSink(p, sink) {
    classCallCheck(this, FilterSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.p = p;
    return _this;
  }

  FilterSink.prototype.event = function event(t, x) {
    var p = this.p;
    p(x) && this.sink.event(t, x);
  };

  return FilterSink;
}(Pipe);

var and = function and(p, q) {
  return function (x) {
    return p(x) && q(x);
  };
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var FilterMap = /*#__PURE__*/function () {
  function FilterMap(p, f, source) {
    classCallCheck(this, FilterMap);

    this.p = p;
    this.f = f;
    this.source = source;
  }

  FilterMap.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new FilterMapSink(this.p, this.f, sink), scheduler$$1);
  };

  return FilterMap;
}();

var FilterMapSink = /*#__PURE__*/function (_Pipe) {
  inherits(FilterMapSink, _Pipe);

  function FilterMapSink(p, f, sink) {
    classCallCheck(this, FilterMapSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.p = p;
    _this.f = f;
    return _this;
  }

  FilterMapSink.prototype.event = function event(t, x) {
    var f = this.f;
    var p = this.p;
    p(x) && this.sink.event(t, f(x));
  };

  return FilterMapSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var Map = /*#__PURE__*/function () {
  function Map(f, source) {
    classCallCheck(this, Map);

    this.f = f;
    this.source = source;
  }

  Map.prototype.run = function run(sink, scheduler$$1) {
    // eslint-disable-line no-extend-native
    return this.source.run(new MapSink(this.f, sink), scheduler$$1);
  };

  /**
   * Create a mapped source, fusing adjacent map.map, filter.map,
   * and filter.map.map if possible
   * @param {function(*):*} f mapping function
   * @param {{run:function}} source source to map
   * @returns {Map|FilterMap} mapped source, possibly fused
   */


  Map.create = function create(f, source) {
    if (isCanonicalEmpty(source)) {
      return empty();
    }

    if (source instanceof Map) {
      return new Map(compose(f, source.f), source.source);
    }

    if (source instanceof Filter) {
      return new FilterMap(source.p, f, source.source);
    }

    return new Map(f, source);
  };

  return Map;
}();

var MapSink = /*#__PURE__*/function (_Pipe) {
  inherits(MapSink, _Pipe);

  function MapSink(f, sink) {
    classCallCheck(this, MapSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    return _this;
  }

  MapSink.prototype.event = function event(t, x) {
    var f = this.f;
    this.sink.event(t, f(x));
  };

  return MapSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var SettableDisposable = /*#__PURE__*/function () {
  function SettableDisposable() {
    classCallCheck(this, SettableDisposable);

    this.disposable = undefined;
    this.disposed = false;
  }

  SettableDisposable.prototype.setDisposable = function setDisposable(disposable$$1) {
    if (this.disposable !== void 0) {
      throw new Error('setDisposable called more than once');
    }

    this.disposable = disposable$$1;

    if (this.disposed) {
      disposable$$1.dispose();
    }
  };

  SettableDisposable.prototype.dispose = function dispose() {
    if (this.disposed) {
      return;
    }

    this.disposed = true;

    if (this.disposable !== void 0) {
      this.disposable.dispose();
    }
  };

  return SettableDisposable;
}();

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream containing only up to the first n items from stream
 */
var take$1 = function take(n, stream) {
  return slice$1(0, n, stream);
};

/**
 * @param {number} n
 * @param {Stream} stream
 * @returns {Stream} new stream with the first n items removed
 */
var skip$1 = function skip(n, stream) {
  return slice$1(n, Infinity, stream);
};

/**
 * Slice a stream by index. Negative start/end indexes are not supported
 * @param {number} start
 * @param {number} end
 * @param {Stream} stream
 * @returns {Stream} stream containing items where start <= index < end
 */
var slice$1 = function slice(start, end, stream) {
  return sliceBounds(boundsFrom(start, end), stream);
};

var sliceBounds = function sliceBounds(bounds, stream) {
  return isSliceEmpty(bounds, stream) ? empty() : stream instanceof Map ? commuteMapSlice(bounds, stream) : stream instanceof Slice ? fuseSlice(bounds, stream) : createSlice(bounds, stream);
};

var isSliceEmpty = function isSliceEmpty(bounds, stream) {
  return isCanonicalEmpty(stream) || isNilBounds(bounds);
};

var createSlice = function createSlice(bounds, stream) {
  return isInfiniteBounds(bounds) ? stream : new Slice(bounds, stream);
};

var commuteMapSlice = function commuteMapSlice(bounds, mapStream) {
  return Map.create(mapStream.f, sliceBounds(bounds, mapStream.source));
};

var fuseSlice = function fuseSlice(bounds, sliceStream) {
  return sliceBounds(mergeBounds(sliceStream.bounds, bounds), sliceStream.source);
};

var Slice = /*#__PURE__*/function () {
  function Slice(bounds, source) {
    classCallCheck(this, Slice);

    this.source = source;
    this.bounds = bounds;
  }

  Slice.prototype.run = function run(sink, scheduler$$1) {
    var disposable$$1 = new SettableDisposable();
    var sliceSink = new SliceSink(this.bounds.min, this.bounds.max - this.bounds.min, sink, disposable$$1);

    disposable$$1.setDisposable(this.source.run(sliceSink, scheduler$$1));

    return disposable$$1;
  };

  return Slice;
}();

var SliceSink = /*#__PURE__*/function (_Pipe) {
  inherits(SliceSink, _Pipe);

  function SliceSink(skip, take, sink, disposable$$1) {
    classCallCheck(this, SliceSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.skip = skip;
    _this.take = take;
    _this.disposable = disposable$$1;
    return _this;
  }

  SliceSink.prototype.event = function event(t, x) {
    /* eslint complexity: [1, 4] */
    if (this.skip > 0) {
      this.skip -= 1;
      return;
    }

    if (this.take === 0) {
      return;
    }

    this.take -= 1;
    this.sink.event(t, x);
    if (this.take === 0) {
      this.disposable.dispose();
      this.sink.end(t);
    }
  };

  return SliceSink;
}(Pipe);

var takeWhile$1 = function takeWhile(p, stream) {
  return isCanonicalEmpty(stream) ? empty() : new TakeWhile(p, stream);
};

var TakeWhile = /*#__PURE__*/function () {
  function TakeWhile(p, source) {
    classCallCheck(this, TakeWhile);

    this.p = p;
    this.source = source;
  }

  TakeWhile.prototype.run = function run(sink, scheduler$$1) {
    var disposable$$1 = new SettableDisposable();
    var takeWhileSink = new TakeWhileSink(this.p, sink, disposable$$1);

    disposable$$1.setDisposable(this.source.run(takeWhileSink, scheduler$$1));

    return disposable$$1;
  };

  return TakeWhile;
}();

var TakeWhileSink = /*#__PURE__*/function (_Pipe2) {
  inherits(TakeWhileSink, _Pipe2);

  function TakeWhileSink(p, sink, disposable$$1) {
    classCallCheck(this, TakeWhileSink);

    var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

    _this2.p = p;
    _this2.active = true;
    _this2.disposable = disposable$$1;
    return _this2;
  }

  TakeWhileSink.prototype.event = function event(t, x) {
    if (!this.active) {
      return;
    }

    var p = this.p;
    this.active = p(x);

    if (this.active) {
      this.sink.event(t, x);
    } else {
      this.disposable.dispose();
      this.sink.end(t);
    }
  };

  return TakeWhileSink;
}(Pipe);

var skipWhile$1 = function skipWhile(p, stream) {
  return isCanonicalEmpty(stream) ? empty() : new SkipWhile(p, stream);
};

var SkipWhile = /*#__PURE__*/function () {
  function SkipWhile(p, source) {
    classCallCheck(this, SkipWhile);

    this.p = p;
    this.source = source;
  }

  SkipWhile.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new SkipWhileSink(this.p, sink), scheduler$$1);
  };

  return SkipWhile;
}();

var SkipWhileSink = /*#__PURE__*/function (_Pipe3) {
  inherits(SkipWhileSink, _Pipe3);

  function SkipWhileSink(p, sink) {
    classCallCheck(this, SkipWhileSink);

    var _this3 = possibleConstructorReturn(this, _Pipe3.call(this, sink));

    _this3.p = p;
    _this3.skipping = true;
    return _this3;
  }

  SkipWhileSink.prototype.event = function event(t, x) {
    if (this.skipping) {
      var p = this.p;
      this.skipping = p(x);
      if (this.skipping) {
        return;
      }
    }

    this.sink.event(t, x);
  };

  return SkipWhileSink;
}(Pipe);

var skipAfter$1 = function skipAfter(p, stream) {
  return isCanonicalEmpty(stream) ? empty() : new SkipAfter(p, stream);
};

var SkipAfter = /*#__PURE__*/function () {
  function SkipAfter(p, source) {
    classCallCheck(this, SkipAfter);

    this.p = p;
    this.source = source;
  }

  SkipAfter.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new SkipAfterSink(this.p, sink), scheduler$$1);
  };

  return SkipAfter;
}();

var SkipAfterSink = /*#__PURE__*/function (_Pipe4) {
  inherits(SkipAfterSink, _Pipe4);

  function SkipAfterSink(p, sink) {
    classCallCheck(this, SkipAfterSink);

    var _this4 = possibleConstructorReturn(this, _Pipe4.call(this, sink));

    _this4.p = p;
    _this4.skipping = false;
    return _this4;
  }

  SkipAfterSink.prototype.event = function event(t, x) {
    if (this.skipping) {
      return;
    }

    var p = this.p;
    this.skipping = p(x);
    this.sink.event(t, x);

    if (this.skipping) {
      this.sink.end(t);
    }
  };

  return SkipAfterSink;
}(Pipe);

/** @license MIT License (c) copyright 2017 original author or authors */

var withItems$1 = function withItems(items, stream) {
  return zipItems$1(keepLeft, items, stream);
};

var zipItems$1 = function zipItems(f, items, stream) {
  return isCanonicalEmpty(stream) || items.length === 0 ? empty() : new ZipItems(f, items, take$1(items.length, stream));
};

var keepLeft = function keepLeft(a, _) {
  return a;
};

var ZipItems = /*#__PURE__*/function () {
  function ZipItems(f, items, source) {
    classCallCheck(this, ZipItems);

    this.f = f;
    this.items = items;
    this.source = source;
  }

  ZipItems.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new ZipItemsSink(this.f, this.items, sink), scheduler$$1);
  };

  return ZipItems;
}();

var ZipItemsSink = /*#__PURE__*/function (_Pipe) {
  inherits(ZipItemsSink, _Pipe);

  function ZipItemsSink(f, items, sink) {
    classCallCheck(this, ZipItemsSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    _this.items = items;
    _this.index = 0;
    return _this;
  }

  ZipItemsSink.prototype.event = function event(t, b) {
    var f = this.f;
    this.sink.event(t, f(this.items[this.index], b));
    this.index += 1;
  };

  return ZipItemsSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var runEffects$1 = /*#__PURE__*/curry2(function (stream, scheduler$$1) {
  return new Promise(function (resolve, reject) {
    return runStream(stream, scheduler$$1, resolve, reject);
  });
});

function runStream(stream, scheduler$$1, resolve, reject) {
  var disposable$$1 = new SettableDisposable();
  var observer = new RunEffectsSink(resolve, reject, disposable$$1);

  disposable$$1.setDisposable(stream.run(observer, scheduler$$1));
}

var RunEffectsSink = /*#__PURE__*/function () {
  function RunEffectsSink(end, error, disposable$$1) {
    classCallCheck(this, RunEffectsSink);

    this._end = end;
    this._error = error;
    this._disposable = disposable$$1;
    this.active = true;
  }

  RunEffectsSink.prototype.event = function event(t, x) {};

  RunEffectsSink.prototype.end = function end(t) {
    if (!this.active) {
      return;
    }
    this._dispose(this._error, this._end, undefined);
  };

  RunEffectsSink.prototype.error = function error(t, e) {
    this._dispose(this._error, this._error, e);
  };

  RunEffectsSink.prototype._dispose = function _dispose(error, end, x) {
    this.active = false;
    tryDispose$1(error, end, x, this._disposable);
  };

  return RunEffectsSink;
}();

function tryDispose$1(error, end, x, disposable$$1) {
  try {
    disposable$$1.dispose();
  } catch (e) {
    error(e);
    return;
  }

  end(x);
}

/** @license MIT License (c) copyright 2010-2017 original author or authors */

// Run a Stream, sending all its events to the
// provided Sink.
var run$1 = function run(sink, scheduler$$1, stream) {
  return stream.run(sink, scheduler$$1);
};

var RelativeSink = /*#__PURE__*/function () {
  function RelativeSink(offset, sink) {
    classCallCheck(this, RelativeSink);

    this.sink = sink;
    this.offset = offset;
  }

  RelativeSink.prototype.event = function event(t, x) {
    this.sink.event(t + this.offset, x);
  };

  RelativeSink.prototype.error = function error(t, e) {
    this.sink.error(t + this.offset, e);
  };

  RelativeSink.prototype.end = function end(t) {
    this.sink.end(t + this.offset);
  };

  return RelativeSink;
}();

// Create a stream with its own local clock
// This transforms time from the provided scheduler's clock to a stream-local
// clock (which starts at 0), and then *back* to the scheduler's clock before
// propagating events to sink.  In other words, upstream sources will see local times,
// and downstream sinks will see non-local (original) times.
var withLocalTime$1 = function withLocalTime(origin, stream) {
  return new WithLocalTime(origin, stream);
};

var WithLocalTime = /*#__PURE__*/function () {
  function WithLocalTime(origin, source) {
    classCallCheck(this, WithLocalTime);

    this.origin = origin;
    this.source = source;
  }

  WithLocalTime.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(relativeSink(this.origin, sink), schedulerRelativeTo(this.origin, scheduler$$1));
  };

  return WithLocalTime;
}();

// Accumulate offsets instead of nesting RelativeSinks, which can happen
// with higher-order stream and combinators like continueWith when they're
// applied recursively.


var relativeSink = function relativeSink(origin, sink) {
  return sink instanceof RelativeSink ? new RelativeSink(origin + sink.offset, sink.sink) : new RelativeSink(origin, sink);
};

/** @license MIT License (c) copyright 2010 original author or authors */

/**
 * Generalized feedback loop. Call a stepper function for each event. The stepper
 * will be called with 2 params: the current seed and the an event value.  It must
 * return a new { seed, value } pair. The `seed` will be fed back into the next
 * invocation of stepper, and the `value` will be propagated as the event value.
 * @param {function(seed:*, value:*):{seed:*, value:*}} stepper loop step function
 * @param {*} seed initial seed value passed to first stepper call
 * @param {Stream} stream event stream
 * @returns {Stream} new stream whose values are the `value` field of the objects
 * returned by the stepper
 */
var loop$1 = function loop(stepper, seed, stream) {
  return isCanonicalEmpty(stream) ? empty() : new Loop(stepper, seed, stream);
};

var Loop = /*#__PURE__*/function () {
  function Loop(stepper, seed, source) {
    classCallCheck(this, Loop);

    this.step = stepper;
    this.seed = seed;
    this.source = source;
  }

  Loop.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new LoopSink(this.step, this.seed, sink), scheduler$$1);
  };

  return Loop;
}();

var LoopSink = /*#__PURE__*/function (_Pipe) {
  inherits(LoopSink, _Pipe);

  function LoopSink(stepper, seed, sink) {
    classCallCheck(this, LoopSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.step = stepper;
    _this.seed = seed;
    return _this;
  }

  LoopSink.prototype.event = function event(t, x) {
    var result = this.step(this.seed, x);
    this.seed = result.seed;
    this.sink.event(t, result.value);
  };

  return LoopSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Create a stream containing successive reduce results of applying f to
 * the previous reduce result and the current stream item.
 * @param {function(result:*, x:*):*} f reducer function
 * @param {*} initial initial value
 * @param {Stream} stream stream to scan
 * @returns {Stream} new stream containing successive reduce results
 */
var scan$1 = function scan(f, initial, stream) {
  return new Scan(f, initial, stream);
};

var Scan = /*#__PURE__*/function () {
  function Scan(f, z, source) {
    classCallCheck(this, Scan);

    this.source = source;
    this.f = f;
    this.value = z;
  }

  Scan.prototype.run = function run(sink, scheduler$$1) {
    var d1 = asap(propagateEventTask$1(this.value, sink), scheduler$$1);
    var d2 = this.source.run(new ScanSink(this.f, this.value, sink), scheduler$$1);
    return disposeBoth(d1, d2);
  };

  return Scan;
}();

var ScanSink = /*#__PURE__*/function (_Pipe) {
  inherits(ScanSink, _Pipe);

  function ScanSink(f, z, sink) {
    classCallCheck(this, ScanSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    _this.value = z;
    return _this;
  }

  ScanSink.prototype.event = function event(t, x) {
    var f = this.f;
    this.value = f(this.value, x);
    this.sink.event(t, this.value);
  };

  return ScanSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var continueWith$1 = function continueWith(f, stream) {
  return new ContinueWith(f, stream);
};

var ContinueWith = /*#__PURE__*/function () {
  function ContinueWith(f, source) {
    classCallCheck(this, ContinueWith);

    this.f = f;
    this.source = source;
  }

  ContinueWith.prototype.run = function run(sink, scheduler$$1) {
    return new ContinueWithSink(this.f, this.source, sink, scheduler$$1);
  };

  return ContinueWith;
}();

var ContinueWithSink = /*#__PURE__*/function (_Pipe) {
  inherits(ContinueWithSink, _Pipe);

  function ContinueWithSink(f, source, sink, scheduler$$1) {
    classCallCheck(this, ContinueWithSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    _this.scheduler = scheduler$$1;
    _this.active = true;
    _this.disposable = disposeOnce(source.run(_this, scheduler$$1));
    return _this;
  }

  ContinueWithSink.prototype.event = function event(t, x) {
    if (!this.active) {
      return;
    }
    this.sink.event(t, x);
  };

  ContinueWithSink.prototype.end = function end(t) {
    if (!this.active) {
      return;
    }

    tryDispose(t, this.disposable, this.sink);

    this._startNext(t, this.sink);
  };

  ContinueWithSink.prototype._startNext = function _startNext(t, sink) {
    try {
      this.disposable = this._continue(this.f, t, sink);
    } catch (e) {
      sink.error(t, e);
    }
  };

  ContinueWithSink.prototype._continue = function _continue(f, t, sink) {
    return run$1(sink, this.scheduler, withLocalTime$1(t, f()));
  };

  ContinueWithSink.prototype.dispose = function dispose() {
    this.active = false;
    return this.disposable.dispose();
  };

  return ContinueWithSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2017 original author or authors */

var startWith$1 = function startWith(x, stream) {
  return continueWith$1(function () {
    return stream;
  }, now(x));
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Transform each value in the stream by applying f to each
 * @param {function(*):*} f mapping function
 * @param {Stream} stream stream to map
 * @returns {Stream} stream containing items transformed by f
 */
var map$2 = function map$$1(f, stream) {
  return Map.create(f, stream);
};

/**
* Replace each value in the stream with x
* @param {*} x
* @param {Stream} stream
* @returns {Stream} stream containing items replaced with x
*/
var constant$1 = function constant(x, stream) {
  return map$2(function () {
    return x;
  }, stream);
};

/**
* Perform a side effect for each item in the stream
* @param {function(x:*):*} f side effect to execute for each item. The
*  return value will be discarded.
* @param {Stream} stream stream to tap
* @returns {Stream} new stream containing the same items as this stream
*/
var tap$1 = function tap(f, stream) {
  return new Tap(f, stream);
};

var Tap = /*#__PURE__*/function () {
  function Tap(f, source) {
    classCallCheck(this, Tap);

    this.source = source;
    this.f = f;
  }

  Tap.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new TapSink(this.f, sink), scheduler$$1);
  };

  return Tap;
}();

var TapSink = /*#__PURE__*/function (_Pipe) {
  inherits(TapSink, _Pipe);

  function TapSink(f, sink) {
    classCallCheck(this, TapSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    return _this;
  }

  TapSink.prototype.event = function event(t, x) {
    var f = this.f;
    f(x);
    this.sink.event(t, x);
  };

  return TapSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var IndexSink = /*#__PURE__*/function (_Sink) {
  inherits(IndexSink, _Sink);

  function IndexSink(i, sink) {
    classCallCheck(this, IndexSink);

    var _this = possibleConstructorReturn(this, _Sink.call(this, sink));

    _this.index = i;
    _this.active = true;
    _this.value = undefined;
    return _this;
  }

  IndexSink.prototype.event = function event(t, x) {
    if (!this.active) {
      return;
    }
    this.value = x;
    this.sink.event(t, this);
  };

  IndexSink.prototype.end = function end(t) {
    if (!this.active) {
      return;
    }
    this.active = false;
    this.sink.event(t, this);
  };

  return IndexSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function invoke(f, args) {
  /* eslint complexity: [2,7] */
  switch (args.length) {
    case 0:
      return f();
    case 1:
      return f(args[0]);
    case 2:
      return f(args[0], args[1]);
    case 3:
      return f(args[0], args[1], args[2]);
    case 4:
      return f(args[0], args[1], args[2], args[3]);
    case 5:
      return f(args[0], args[1], args[2], args[3], args[4]);
    default:
      return f.apply(void 0, args);
  }
}

/** @license MIT License (c) copyright 2010 original author or authors */

/**
 * Combine latest events from two streams
 * @param {function(...events):*} f function to combine most recent events
 * @returns {Stream} stream containing the result of applying f to the most recent
 *  event of each input stream, whenever a new event arrives on any stream.
 */
var combine$1 = function combine(f, stream1, stream2) {
  return combineArray$1(f, [stream1, stream2]);
};

/**
* Combine latest events from all input streams
* @param {function(...events):*} f function to combine most recent events
* @param {[Stream]} streams most recent events
* @returns {Stream} stream containing the result of applying f to the most recent
*  event of each input stream, whenever a new event arrives on any stream.
*/
var combineArray$1 = function combineArray(f, streams) {
  return streams.length === 0 || containsCanonicalEmpty(streams) ? empty() : streams.length === 1 ? map$2(f, streams[0]) : new Combine(f, streams);
};

var Combine = /*#__PURE__*/function () {
  function Combine(f, sources) {
    classCallCheck(this, Combine);

    this.f = f;
    this.sources = sources;
  }

  Combine.prototype.run = function run(sink, scheduler$$1) {
    var l = this.sources.length;
    var disposables = new Array(l);
    var sinks = new Array(l);

    var mergeSink = new CombineSink(disposables, sinks, sink, this.f);

    for (var indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink);
      disposables[i] = this.sources[i].run(indexSink, scheduler$$1);
    }

    return disposeAll(disposables);
  };

  return Combine;
}();

var CombineSink = /*#__PURE__*/function (_Pipe) {
  inherits(CombineSink, _Pipe);

  function CombineSink(disposables, sinks, sink, f) {
    classCallCheck(this, CombineSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.disposables = disposables;
    _this.sinks = sinks;
    _this.f = f;

    var l = sinks.length;
    _this.awaiting = l;
    _this.values = new Array(l);
    _this.hasValue = new Array(l).fill(false);
    _this.activeCount = sinks.length;
    return _this;
  }

  CombineSink.prototype.event = function event(t, indexedValue) {
    if (!indexedValue.active) {
      this._dispose(t, indexedValue.index);
      return;
    }

    var i = indexedValue.index;
    var awaiting = this._updateReady(i);

    this.values[i] = indexedValue.value;
    if (awaiting === 0) {
      this.sink.event(t, invoke(this.f, this.values));
    }
  };

  CombineSink.prototype._updateReady = function _updateReady(index) {
    if (this.awaiting > 0) {
      if (!this.hasValue[index]) {
        this.hasValue[index] = true;
        this.awaiting -= 1;
      }
    }
    return this.awaiting;
  };

  CombineSink.prototype._dispose = function _dispose(t, index) {
    tryDispose(t, this.disposables[index], this.sink);
    if (--this.activeCount === 0) {
      this.sink.end(t);
    }
  };

  return CombineSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Assume fs is a stream containing functions, and apply the latest function
 * in fs to the latest value in xs.
 * fs:         --f---------g--------h------>
 * xs:         -a-------b-------c-------d-->
 * ap(fs, xs): --fa-----fb-gb---gc--hc--hd->
 * @param {Stream} fs stream of functions to apply to the latest x
 * @param {Stream} xs stream of values to which to apply all the latest f
 * @returns {Stream} stream containing all the applications of fs to xs
 */
function ap$1(fs, xs) {
  return combine$1(apply, fs, xs);
}

/** @license MIT License (c) copyright 2010 original author or authors */

var mergeConcurrently$1 = function mergeConcurrently(concurrency, stream) {
  return mergeMapConcurrently$1(id, concurrency, stream);
};

var mergeMapConcurrently$1 = function mergeMapConcurrently(f, concurrency, stream) {
  return isCanonicalEmpty(stream) ? empty() : new MergeConcurrently(f, concurrency, stream);
};

var MergeConcurrently = /*#__PURE__*/function () {
  function MergeConcurrently(f, concurrency, source) {
    classCallCheck(this, MergeConcurrently);

    this.f = f;
    this.concurrency = concurrency;
    this.source = source;
  }

  MergeConcurrently.prototype.run = function run(sink, scheduler$$1) {
    return new Outer(this.f, this.concurrency, this.source, sink, scheduler$$1);
  };

  return MergeConcurrently;
}();

var Outer = /*#__PURE__*/function () {
  function Outer(f, concurrency, source, sink, scheduler$$1) {
    classCallCheck(this, Outer);

    this.f = f;
    this.concurrency = concurrency;
    this.sink = sink;
    this.scheduler = scheduler$$1;
    this.pending = [];
    this.current = [];
    this.disposable = disposeOnce(source.run(this, scheduler$$1));
    this.active = true;
  }

  Outer.prototype.event = function event(t, x) {
    this._addInner(t, x);
  };

  Outer.prototype._addInner = function _addInner(t, x) {
    if (this.current.length < this.concurrency) {
      this._startInner(t, x);
    } else {
      this.pending.push(x);
    }
  };

  Outer.prototype._startInner = function _startInner(t, x) {
    try {
      this._initInner(t, x);
    } catch (e) {
      this.error(t, e);
    }
  };

  Outer.prototype._initInner = function _initInner(t, x) {
    var innerSink = new Inner(t, this, this.sink);
    innerSink.disposable = mapAndRun(this.f, t, x, innerSink, this.scheduler);
    this.current.push(innerSink);
  };

  Outer.prototype.end = function end(t) {
    this.active = false;
    tryDispose(t, this.disposable, this.sink);
    this._checkEnd(t);
  };

  Outer.prototype.error = function error(t, e) {
    this.active = false;
    this.sink.error(t, e);
  };

  Outer.prototype.dispose = function dispose() {
    this.active = false;
    this.pending.length = 0;
    this.disposable.dispose();
    disposeAll(this.current).dispose();
  };

  Outer.prototype._endInner = function _endInner(t, inner) {
    var i = this.current.indexOf(inner);
    if (i >= 0) {
      this.current.splice(i, 1);
    }
    tryDispose(t, inner, this);

    if (this.pending.length === 0) {
      this._checkEnd(t);
    } else {
      this._startInner(t, this.pending.shift());
    }
  };

  Outer.prototype._checkEnd = function _checkEnd(t) {
    if (!this.active && this.current.length === 0) {
      this.sink.end(t);
    }
  };

  return Outer;
}();

var mapAndRun = function mapAndRun(f, t, x, sink, scheduler$$1) {
  return f(x).run(sink, schedulerRelativeTo(t, scheduler$$1));
};

var Inner = /*#__PURE__*/function () {
  function Inner(time, outer, sink) {
    classCallCheck(this, Inner);

    this.time = time;
    this.outer = outer;
    this.sink = sink;
    this.disposable = disposeNone();
  }

  Inner.prototype.event = function event(t, x) {
    this.sink.event(t + this.time, x);
  };

  Inner.prototype.end = function end(t) {
    this.outer._endInner(t + this.time, this);
  };

  Inner.prototype.error = function error(t, e) {
    this.outer.error(t + this.time, e);
  };

  Inner.prototype.dispose = function dispose() {
    return this.disposable.dispose();
  };

  return Inner;
}();

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in the stream to a new stream, and merge it into the
 * returned outer stream. Event arrival times are preserved.
 * @param {function(x:*):Stream} f chaining function, must return a Stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
var chain$1 = function chain(f, stream) {
  return mergeMapConcurrently$1(f, Infinity, stream);
};

/**
 * Monadic join. Flatten a Stream<Stream<X>> to Stream<X> by merging inner
 * streams to the outer. Event arrival times are preserved.
 * @param {Stream<Stream<X>>} stream stream of streams
 * @returns {Stream<X>} new stream containing all events of all inner streams
 */
var join = function join(stream) {
  return mergeConcurrently$1(Infinity, stream);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Map each value in stream to a new stream, and concatenate them all
 * stream:              -a---b---cX
 * f(a):                 1-1-1-1X
 * f(b):                        -2-2-2-2X
 * f(c):                                -3-3-3-3X
 * stream.concatMap(f): -1-1-1-1-2-2-2-2-3-3-3-3X
 * @param {function(x:*):Stream} f function to map each value to a stream
 * @param {Stream} stream
 * @returns {Stream} new stream containing all events from each stream returned by f
 */
var concatMap$1 = function concatMap(f, stream) {
  return mergeMapConcurrently$1(f, 1, stream);
};

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @returns {Stream} stream containing events from two streams in time order.
 * If two events are simultaneous they will be merged in arbitrary order.
 */
function merge$1(stream1, stream2) {
  return mergeArray([stream1, stream2]);
}

/**
 * @param {Array} streams array of stream to merge
 * @returns {Stream} stream containing events from all input observables
 * in time order.  If two events are simultaneous they will be merged in
 * arbitrary order.
 */
var mergeArray = function mergeArray(streams) {
  return mergeStreams(withoutCanonicalEmpty(streams));
};

/**
 * This implements fusion/flattening for merge.  It will
 * fuse adjacent merge operations.  For example:
 * - a.merge(b).merge(c) effectively becomes merge(a, b, c)
 * - merge(a, merge(b, c)) effectively becomes merge(a, b, c)
 * It does this by concatenating the sources arrays of
 * any nested Merge sources, in effect "flattening" nested
 * merge operations into a single merge.
 */
var mergeStreams = function mergeStreams(streams) {
  return streams.length === 0 ? empty() : streams.length === 1 ? streams[0] : new Merge(reduce(appendSources, [], streams));
};

var withoutCanonicalEmpty = function withoutCanonicalEmpty(streams) {
  return streams.filter(isNotCanonicalEmpty);
};

var isNotCanonicalEmpty = function isNotCanonicalEmpty(stream) {
  return !isCanonicalEmpty(stream);
};

var appendSources = function appendSources(sources, stream) {
  return sources.concat(stream instanceof Merge ? stream.sources : stream);
};

var Merge = /*#__PURE__*/function () {
  function Merge(sources) {
    classCallCheck(this, Merge);

    this.sources = sources;
  }

  Merge.prototype.run = function run(sink, scheduler$$1) {
    var l = this.sources.length;
    var disposables = new Array(l);
    var sinks = new Array(l);

    var mergeSink = new MergeSink(disposables, sinks, sink);

    for (var indexSink, i = 0; i < l; ++i) {
      indexSink = sinks[i] = new IndexSink(i, mergeSink);
      disposables[i] = this.sources[i].run(indexSink, scheduler$$1);
    }

    return disposeAll(disposables);
  };

  return Merge;
}();

var MergeSink = /*#__PURE__*/function (_Pipe) {
  inherits(MergeSink, _Pipe);

  function MergeSink(disposables, sinks, sink) {
    classCallCheck(this, MergeSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.disposables = disposables;
    _this.activeCount = sinks.length;
    return _this;
  }

  MergeSink.prototype.event = function event(t, indexValue) {
    if (!indexValue.active) {
      this._dispose(t, indexValue.index);
      return;
    }
    this.sink.event(t, indexValue.value);
  };

  MergeSink.prototype._dispose = function _dispose(t, index) {
    tryDispose(t, this.disposables[index], this.sink);
    if (--this.activeCount === 0) {
      this.sink.end(t);
    }
  };

  return MergeSink;
}(Pipe);

/** @license MIT License (c) copyright 2010 original author or authors */

var sample$1 = function sample(values, sampler) {
  return snapshot$1(function (x, _) {
    return x;
  }, values, sampler);
};

var snapshot$1 = function snapshot(f, values, sampler) {
  return isCanonicalEmpty(sampler) || isCanonicalEmpty(values) ? empty() : new Snapshot(f, values, sampler);
};

var Snapshot = /*#__PURE__*/function () {
  function Snapshot(f, values, sampler) {
    classCallCheck(this, Snapshot);

    this.f = f;
    this.values = values;
    this.sampler = sampler;
  }

  Snapshot.prototype.run = function run(sink, scheduler$$1) {
    var sampleSink = new SnapshotSink(this.f, sink);
    var valuesDisposable = this.values.run(sampleSink.latest, scheduler$$1);
    var samplerDisposable = this.sampler.run(sampleSink, scheduler$$1);

    return disposeBoth(samplerDisposable, valuesDisposable);
  };

  return Snapshot;
}();

var SnapshotSink = /*#__PURE__*/function (_Pipe) {
  inherits(SnapshotSink, _Pipe);

  function SnapshotSink(f, sink) {
    classCallCheck(this, SnapshotSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    _this.latest = new LatestValueSink(_this);
    return _this;
  }

  SnapshotSink.prototype.event = function event(t, x) {
    if (this.latest.hasValue) {
      var f = this.f;
      this.sink.event(t, f(this.latest.value, x));
    }
  };

  return SnapshotSink;
}(Pipe);

var LatestValueSink = /*#__PURE__*/function (_Pipe2) {
  inherits(LatestValueSink, _Pipe2);

  function LatestValueSink(sink) {
    classCallCheck(this, LatestValueSink);

    var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

    _this2.hasValue = false;
    return _this2;
  }

  LatestValueSink.prototype.event = function event(t, x) {
    this.value = x;
    this.hasValue = true;
  };

  LatestValueSink.prototype.end = function end() {};

  return LatestValueSink;
}(Pipe);

// Copied and modified from https://github.com/invertase/denque
// MIT License

// These constants were extracted directly from denque's shift()
// It's not clear exactly why the authors chose these particular
// values, but given denque's stated goals, it seems likely that
// they were chosen for speed/memory reasons.

// Max value of _head at which Queue is willing to shink
// its internal array
var HEAD_MAX_SHRINK = 2;

// Min value of _tail at which Queue is willing to shink
// its internal array
var TAIL_MIN_SHRINK = 10000;

var Queue = /*#__PURE__*/function () {
  function Queue() {
    classCallCheck(this, Queue);

    this._head = 0;
    this._tail = 0;
    this._capacityMask = 0x3;
    this._list = new Array(4);
  }

  Queue.prototype.push = function push(x) {
    var tail = this._tail;
    this._list[tail] = x;
    this._tail = tail + 1 & this._capacityMask;
    if (this._tail === this._head) {
      this._growArray();
    }

    if (this._head < this._tail) {
      return this._tail - this._head;
    } else {
      return this._capacityMask + 1 - (this._head - this._tail);
    }
  };

  Queue.prototype.shift = function shift() {
    var head = this._head;
    if (head === this._tail) {
      return undefined;
    }

    var x = this._list[head];
    this._list[head] = undefined;
    this._head = head + 1 & this._capacityMask;
    if (head < HEAD_MAX_SHRINK && this._tail > TAIL_MIN_SHRINK && this._tail <= this._list.length >>> 2) {
      this._shrinkArray();
    }

    return x;
  };

  Queue.prototype.isEmpty = function isEmpty() {
    return this._head === this._tail;
  };

  Queue.prototype.length = function length() {
    if (this._head === this._tail) {
      return 0;
    } else if (this._head < this._tail) {
      return this._tail - this._head;
    } else {
      return this._capacityMask + 1 - (this._head - this._tail);
    }
  };

  Queue.prototype._growArray = function _growArray() {
    if (this._head) {
      // copy existing data, head to end, then beginning to tail.
      this._list = this._copyArray();
      this._head = 0;
    }

    // head is at 0 and array is now full, safe to extend
    this._tail = this._list.length;

    this._list.length *= 2;
    this._capacityMask = this._capacityMask << 1 | 1;
  };

  Queue.prototype._shrinkArray = function _shrinkArray() {
    this._list.length >>>= 1;
    this._capacityMask >>>= 1;
  };

  Queue.prototype._copyArray = function _copyArray() {
    var newArray = [];
    var list = this._list;
    var len = list.length;

    var i = void 0;
    for (i = this._head; i < len; i++) {
      newArray.push(list[i]);
    }
    for (i = 0; i < this._tail; i++) {
      newArray.push(list[i]);
    }

    return newArray;
  };

  return Queue;
}();

/** @license MIT License (c) copyright 2010 original author or authors */

/**
 * Combine two streams pairwise by index by applying f to values at corresponding
 * indices.  The returned stream ends when either of the input streams ends.
 * @param {function} f function to combine values
 * @returns {Stream} new stream with items at corresponding indices combined
 *  using f
 */
function zip$1(f, stream1, stream2) {
  return zipArray$1(f, [stream1, stream2]);
}

/**
* Combine streams pairwise (or tuple-wise) by index by applying f to values
* at corresponding indices.  The returned stream ends when any of the input
* streams ends.
* @param {function} f function to combine values
* @param {[Stream]} streams streams to zip using f
* @returns {Stream} new stream with items at corresponding indices combined
*  using f
*/
var zipArray$1 = function zipArray(f, streams) {
  return streams.length === 0 || containsCanonicalEmpty(streams) ? empty() : streams.length === 1 ? map$2(f, streams[0]) : new Zip(f, streams);
};

var Zip = /*#__PURE__*/function () {
  function Zip(f, sources) {
    classCallCheck(this, Zip);

    this.f = f;
    this.sources = sources;
  }

  Zip.prototype.run = function run(sink, scheduler$$1) {
    var l = this.sources.length;
    var disposables = new Array(l);
    var sinks = new Array(l);
    var buffers = new Array(l);

    var zipSink = new ZipSink(this.f, buffers, sinks, sink);

    for (var indexSink, i = 0; i < l; ++i) {
      buffers[i] = new Queue();
      indexSink = sinks[i] = new IndexSink(i, zipSink);
      disposables[i] = this.sources[i].run(indexSink, scheduler$$1);
    }

    return disposeAll(disposables);
  };

  return Zip;
}();

var ZipSink = /*#__PURE__*/function (_Pipe) {
  inherits(ZipSink, _Pipe);

  function ZipSink(f, buffers, sinks, sink) {
    classCallCheck(this, ZipSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.f = f;
    _this.sinks = sinks;
    _this.buffers = buffers;
    return _this;
  }

  ZipSink.prototype.event = function event(t, indexedValue) {
    /* eslint complexity: [1, 5] */
    if (!indexedValue.active) {
      this._dispose(t, indexedValue.index);
      return;
    }

    var buffers = this.buffers;
    var buffer = buffers[indexedValue.index];

    buffer.push(indexedValue.value);

    if (buffer.length() === 1) {
      if (!ready(this.buffers)) {
        return;
      }

      emitZipped(this.f, t, buffers, this.sink);

      if (ended(this.buffers, this.sinks)) {
        this.sink.end(t);
      }
    }
  };

  ZipSink.prototype._dispose = function _dispose(t, index) {
    var buffer = this.buffers[index];
    if (buffer.isEmpty()) {
      this.sink.end(t);
    }
  };

  return ZipSink;
}(Pipe);

var emitZipped = function emitZipped(f, t, buffers, sink) {
  return sink.event(t, invoke(f, map(head, buffers)));
};

var head = function head(buffer) {
  return buffer.shift();
};

function ended(buffers, sinks) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty() && !sinks[i].active) {
      return true;
    }
  }
  return false;
}

function ready(buffers) {
  for (var i = 0, l = buffers.length; i < l; ++i) {
    if (buffers[i].isEmpty()) {
      return false;
    }
  }
  return true;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Given a stream of streams, return a new stream that adopts the behavior
 * of the most recent inner stream.
 * @param {Stream} stream of streams on which to switch
 * @returns {Stream} switching stream
 */
var switchLatest = function switchLatest(stream) {
  return isCanonicalEmpty(stream) ? empty() : new Switch(stream);
};

var Switch = /*#__PURE__*/function () {
  function Switch(source) {
    classCallCheck(this, Switch);

    this.source = source;
  }

  Switch.prototype.run = function run(sink, scheduler$$1) {
    var switchSink = new SwitchSink(sink, scheduler$$1);
    return disposeBoth(switchSink, this.source.run(switchSink, scheduler$$1));
  };

  return Switch;
}();

var SwitchSink = /*#__PURE__*/function () {
  function SwitchSink(sink, scheduler$$1) {
    classCallCheck(this, SwitchSink);

    this.sink = sink;
    this.scheduler = scheduler$$1;
    this.current = null;
    this.ended = false;
  }

  SwitchSink.prototype.event = function event(t, stream) {
    this._disposeCurrent(t);
    this.current = new Segment(stream, t, Infinity, this, this.sink, this.scheduler);
  };

  SwitchSink.prototype.end = function end(t) {
    this.ended = true;
    this._checkEnd(t);
  };

  SwitchSink.prototype.error = function error(t, e) {
    this.ended = true;
    this.sink.error(t, e);
  };

  SwitchSink.prototype.dispose = function dispose() {
    return this._disposeCurrent(currentTime(this.scheduler));
  };

  SwitchSink.prototype._disposeCurrent = function _disposeCurrent(t) {
    if (this.current !== null) {
      return this.current._dispose(t);
    }
  };

  SwitchSink.prototype._disposeInner = function _disposeInner(t, inner) {
    inner._dispose(t);
    if (inner === this.current) {
      this.current = null;
    }
  };

  SwitchSink.prototype._checkEnd = function _checkEnd(t) {
    if (this.ended && this.current === null) {
      this.sink.end(t);
    }
  };

  SwitchSink.prototype._endInner = function _endInner(t, inner) {
    this._disposeInner(t, inner);
    this._checkEnd(t);
  };

  SwitchSink.prototype._errorInner = function _errorInner(t, e, inner) {
    this._disposeInner(t, inner);
    this.sink.error(t, e);
  };

  return SwitchSink;
}();

var Segment = /*#__PURE__*/function () {
  function Segment(source, min, max, outer, sink, scheduler$$1) {
    classCallCheck(this, Segment);

    this.min = min;
    this.max = max;
    this.outer = outer;
    this.sink = sink;
    this.disposable = source.run(this, schedulerRelativeTo(min, scheduler$$1));
  }

  Segment.prototype.event = function event(t, x) {
    var time = Math.max(0, t + this.min);
    if (time < this.max) {
      this.sink.event(time, x);
    }
  };

  Segment.prototype.end = function end(t) {
    this.outer._endInner(t + this.min, this);
  };

  Segment.prototype.error = function error(t, e) {
    this.outer._errorInner(t + this.min, e, this);
  };

  Segment.prototype._dispose = function _dispose(t) {
    tryDispose(t, this.disposable, this.sink);
  };

  return Segment;
}();

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Retain only items matching a predicate
 * @param {function(x:*):boolean} p filtering predicate called for each item
 * @param {Stream} stream stream to filter
 * @returns {Stream} stream containing only items for which predicate returns truthy
 */
var filter$1 = function filter(p, stream) {
  return Filter.create(p, stream);
};

/**
 * Skip repeated events, using === to detect duplicates
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
var skipRepeats = function skipRepeats(stream) {
  return skipRepeatsWith$1(same, stream);
};

/**
 * Skip repeated events using the provided equals function to detect duplicates
 * @param {function(a:*, b:*):boolean} equals optional function to compare items
 * @param {Stream} stream stream from which to omit repeated events
 * @returns {Stream} stream without repeated events
 */
var skipRepeatsWith$1 = function skipRepeatsWith(equals, stream) {
  return isCanonicalEmpty(stream) ? empty() : new SkipRepeats(equals, stream);
};

var SkipRepeats = /*#__PURE__*/function () {
  function SkipRepeats(equals, source) {
    classCallCheck(this, SkipRepeats);

    this.equals = equals;
    this.source = source;
  }

  SkipRepeats.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new SkipRepeatsSink(this.equals, sink), scheduler$$1);
  };

  return SkipRepeats;
}();

var SkipRepeatsSink = /*#__PURE__*/function (_Pipe) {
  inherits(SkipRepeatsSink, _Pipe);

  function SkipRepeatsSink(equals, sink) {
    classCallCheck(this, SkipRepeatsSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.equals = equals;
    _this.value = void 0;
    _this.init = true;
    return _this;
  }

  SkipRepeatsSink.prototype.event = function event(t, x) {
    if (this.init) {
      this.init = false;
      this.value = x;
      this.sink.event(t, x);
    } else if (!this.equals(this.value, x)) {
      this.value = x;
      this.sink.event(t, x);
    }
  };

  return SkipRepeatsSink;
}(Pipe);

function same(a, b) {
  return a === b;
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var until$1 = function until(signal, stream) {
  return new Until(signal, stream);
};

var since$1 = function since(signal, stream) {
  return new Since(signal, stream);
};

var during$1 = function during(timeWindow, stream) {
  return until$1(join(timeWindow), since$1(timeWindow, stream));
};

var Until = /*#__PURE__*/function () {
  function Until(maxSignal, source) {
    classCallCheck(this, Until);

    this.maxSignal = maxSignal;
    this.source = source;
  }

  Until.prototype.run = function run(sink, scheduler$$1) {
    var disposable$$1 = new SettableDisposable();

    var d1 = this.source.run(sink, scheduler$$1);
    var d2 = this.maxSignal.run(new UntilSink(sink, disposable$$1), scheduler$$1);
    disposable$$1.setDisposable(disposeBoth(d1, d2));

    return disposable$$1;
  };

  return Until;
}();

var Since = /*#__PURE__*/function () {
  function Since(minSignal, source) {
    classCallCheck(this, Since);

    this.minSignal = minSignal;
    this.source = source;
  }

  Since.prototype.run = function run(sink, scheduler$$1) {
    var min = new LowerBoundSink(this.minSignal, sink, scheduler$$1);
    var d = this.source.run(new SinceSink(min, sink), scheduler$$1);

    return disposeBoth(min, d);
  };

  return Since;
}();

var SinceSink = /*#__PURE__*/function (_Pipe) {
  inherits(SinceSink, _Pipe);

  function SinceSink(min, sink) {
    classCallCheck(this, SinceSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.min = min;
    return _this;
  }

  SinceSink.prototype.event = function event(t, x) {
    if (this.min.allow) {
      this.sink.event(t, x);
    }
  };

  return SinceSink;
}(Pipe);

var LowerBoundSink = /*#__PURE__*/function (_Pipe2) {
  inherits(LowerBoundSink, _Pipe2);

  function LowerBoundSink(signal, sink, scheduler$$1) {
    classCallCheck(this, LowerBoundSink);

    var _this2 = possibleConstructorReturn(this, _Pipe2.call(this, sink));

    _this2.allow = false;
    _this2.disposable = signal.run(_this2, scheduler$$1);
    return _this2;
  }

  LowerBoundSink.prototype.event = function event() /* t, x */{
    this.allow = true;
    this.dispose();
  };

  LowerBoundSink.prototype.end = function end() {};

  LowerBoundSink.prototype.dispose = function dispose() {
    this.disposable.dispose();
  };

  return LowerBoundSink;
}(Pipe);

var UntilSink = /*#__PURE__*/function (_Pipe3) {
  inherits(UntilSink, _Pipe3);

  function UntilSink(sink, disposable$$1) {
    classCallCheck(this, UntilSink);

    var _this3 = possibleConstructorReturn(this, _Pipe3.call(this, sink));

    _this3.disposable = disposable$$1;
    return _this3;
  }

  UntilSink.prototype.event = function event(t, x) {
    this.disposable.dispose();
    this.sink.end(t);
  };

  UntilSink.prototype.end = function end() {};

  return UntilSink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * @param {Number} delayTime milliseconds to delay each item
 * @param {Stream} stream
 * @returns {Stream} new stream containing the same items, but delayed by ms
 */
var delay$2 = function delay$$1(delayTime, stream) {
  return delayTime <= 0 ? stream : new Delay(delayTime, stream);
};

var Delay = /*#__PURE__*/function () {
  function Delay(dt, source) {
    classCallCheck(this, Delay);

    this.dt = dt;
    this.source = source;
  }

  Delay.prototype.run = function run(sink, scheduler$$1) {
    var delaySink = new DelaySink(this.dt, sink, scheduler$$1);
    return disposeBoth(delaySink, this.source.run(delaySink, scheduler$$1));
  };

  return Delay;
}();

var DelaySink = /*#__PURE__*/function (_Pipe) {
  inherits(DelaySink, _Pipe);

  function DelaySink(dt, sink, scheduler$$1) {
    classCallCheck(this, DelaySink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.dt = dt;
    _this.scheduler = scheduler$$1;
    _this.tasks = [];
    return _this;
  }

  DelaySink.prototype.dispose = function dispose() {
    this.tasks.forEach(cancelTask);
  };

  DelaySink.prototype.event = function event(t, x) {
    this.tasks.push(delay(this.dt, propagateEventTask$1(x, this.sink), this.scheduler));
  };

  DelaySink.prototype.end = function end(t) {
    this.tasks.push(delay(this.dt, propagateEndTask(this.sink), this.scheduler));
  };

  return DelaySink;
}(Pipe);

/** @license MIT License (c) copyright 2010-2017 original author or authors */

/**
 * Limit the rate of events by suppressing events that occur too often
 * @param {Number} period time to suppress events
 * @param {Stream} stream
 * @returns {Stream}
 */
var throttle$1 = function throttle(period, stream) {
  return isCanonicalEmpty(stream) ? empty() : stream instanceof Map ? commuteMapThrottle(period, stream) : stream instanceof Throttle ? fuseThrottle(period, stream) : new Throttle(period, stream);
};

var commuteMapThrottle = function commuteMapThrottle(period, mapStream) {
  return Map.create(mapStream.f, throttle$1(period, mapStream.source));
};

var fuseThrottle = function fuseThrottle(period, throttleStream) {
  return new Throttle(Math.max(period, throttleStream.period), throttleStream.source);
};

var Throttle = /*#__PURE__*/function () {
  function Throttle(period, source) {
    classCallCheck(this, Throttle);

    this.period = period;
    this.source = source;
  }

  Throttle.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new ThrottleSink(this.period, sink), scheduler$$1);
  };

  return Throttle;
}();

var ThrottleSink = /*#__PURE__*/function (_Pipe) {
  inherits(ThrottleSink, _Pipe);

  function ThrottleSink(period, sink) {
    classCallCheck(this, ThrottleSink);

    var _this = possibleConstructorReturn(this, _Pipe.call(this, sink));

    _this.time = 0;
    _this.period = period;
    return _this;
  }

  ThrottleSink.prototype.event = function event(t, x) {
    if (t >= this.time) {
      this.time = t + this.period;
      this.sink.event(t, x);
    }
  };

  return ThrottleSink;
}(Pipe);
/**
 * Wait for a burst of events to subside and emit only the last event in the burst
 * @param {Number} period events occuring more frequently than this
 *  will be suppressed
 * @param {Stream} stream stream to debounce
 * @returns {Stream} new debounced stream
 */


var debounce$1 = function debounce(period, stream) {
  return isCanonicalEmpty(stream) ? empty() : new Debounce(period, stream);
};

var Debounce = /*#__PURE__*/function () {
  function Debounce(dt, source) {
    classCallCheck(this, Debounce);

    this.dt = dt;
    this.source = source;
  }

  Debounce.prototype.run = function run(sink, scheduler$$1) {
    return new DebounceSink(this.dt, this.source, sink, scheduler$$1);
  };

  return Debounce;
}();

var DebounceSink = /*#__PURE__*/function () {
  function DebounceSink(dt, source, sink, scheduler$$1) {
    classCallCheck(this, DebounceSink);

    this.dt = dt;
    this.sink = sink;
    this.scheduler = scheduler$$1;
    this.value = void 0;
    this.timer = null;

    this.disposable = source.run(this, scheduler$$1);
  }

  DebounceSink.prototype.event = function event(t, x) {
    this._clearTimer();
    this.value = x;
    this.timer = delay(this.dt, new DebounceTask(this, x), this.scheduler);
  };

  DebounceSink.prototype._event = function _event(t, x) {
    this._clearTimer();
    this.sink.event(t, x);
  };

  DebounceSink.prototype.end = function end(t) {
    if (this._clearTimer()) {
      this.sink.event(t, this.value);
      this.value = undefined;
    }
    this.sink.end(t);
  };

  DebounceSink.prototype.error = function error(t, x) {
    this._clearTimer();
    this.sink.error(t, x);
  };

  DebounceSink.prototype.dispose = function dispose() {
    this._clearTimer();
    this.disposable.dispose();
  };

  DebounceSink.prototype._clearTimer = function _clearTimer() {
    if (this.timer === null) {
      return false;
    }
    this.timer.dispose();
    this.timer = null;
    return true;
  };

  return DebounceSink;
}();

var DebounceTask = /*#__PURE__*/function () {
  function DebounceTask(debounce, value) {
    classCallCheck(this, DebounceTask);

    this.debounce = debounce;
    this.value = value;
  }

  DebounceTask.prototype.run = function run(t) {
    this.debounce._event(t, this.value);
  };

  DebounceTask.prototype.error = function error(t, e) {
    this.debounce.error(t, e);
  };

  DebounceTask.prototype.dispose = function dispose() {};

  return DebounceTask;
}();

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * Turn a Stream<Promise<T>> into Stream<T> by awaiting each promise.
 * Event order is preserved. The stream will fail if any promise rejects.
 */
var awaitPromises = function awaitPromises(stream) {
  return isCanonicalEmpty(stream) ? empty() : new Await(stream);
};

/**
 * Create a stream containing only the promise's fulfillment
 * value at the time it fulfills.
 * @param {Promise<T>} p promise
 * @return {Stream<T>} stream containing promise's fulfillment value.
 *  If the promise rejects, the stream will error
 */
var fromPromise = /*#__PURE__*/compose(awaitPromises, now);

var Await = /*#__PURE__*/function () {
  function Await(source) {
    classCallCheck(this, Await);

    this.source = source;
  }

  Await.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(new AwaitSink(sink, scheduler$$1), scheduler$$1);
  };

  return Await;
}();

var AwaitSink = /*#__PURE__*/function () {
  function AwaitSink(sink, scheduler$$1) {
    var _this = this;

    classCallCheck(this, AwaitSink);

    this.sink = sink;
    this.scheduler = scheduler$$1;
    this.queue = Promise.resolve();

    // Pre-create closures, to avoid creating them per event
    this._eventBound = function (x) {
      return _this.sink.event(currentTime(_this.scheduler), x);
    };
    this._endBound = function () {
      return _this.sink.end(currentTime(_this.scheduler));
    };
    this._errorBound = function (e) {
      return _this.sink.error(currentTime(_this.scheduler), e);
    };
  }

  AwaitSink.prototype.event = function event(t, promise) {
    var _this2 = this;

    this.queue = this.queue.then(function () {
      return _this2._event(promise);
    }).catch(this._errorBound);
  };

  AwaitSink.prototype.end = function end(t) {
    this.queue = this.queue.then(this._endBound).catch(this._errorBound);
  };

  AwaitSink.prototype.error = function error(t, e) {
    var _this3 = this;

    // Don't resolve error values, propagate directly
    this.queue = this.queue.then(function () {
      return _this3._errorBound(e);
    }).catch(fatalError);
  };

  AwaitSink.prototype._event = function _event(promise) {
    return promise.then(this._eventBound);
  };

  return AwaitSink;
}();

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

var SafeSink = /*#__PURE__*/function () {
  function SafeSink(sink) {
    classCallCheck(this, SafeSink);

    this.sink = sink;
    this.active = true;
  }

  SafeSink.prototype.event = function event(t, x) {
    if (!this.active) {
      return;
    }
    this.sink.event(t, x);
  };

  SafeSink.prototype.end = function end(t, x) {
    if (!this.active) {
      return;
    }
    this.disable();
    this.sink.end(t, x);
  };

  SafeSink.prototype.error = function error(t, e) {
    this.disable();
    this.sink.error(t, e);
  };

  SafeSink.prototype.disable = function disable() {
    this.active = false;
    return this.sink;
  };

  return SafeSink;
}();

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

function tryEvent(t, x, sink) {
  try {
    sink.event(t, x);
  } catch (e) {
    sink.error(t, e);
  }
}

function tryEnd(t, sink) {
  try {
    sink.end(t);
  } catch (e) {
    sink.error(t, e);
  }
}

/** @license MIT License (c) copyright 2010-2016 original author or authors */
/** @author Brian Cavalier */
/** @author John Hann */

/**
 * If stream encounters an error, recover and continue with items from stream
 * returned by f.
 * @param {function(error:*):Stream} f function which returns a new stream
 * @param {Stream} stream
 * @returns {Stream} new stream which will recover from an error by calling f
 */
var recoverWith$1 = function recoverWith(f, stream) {
  return isCanonicalEmpty(stream) ? empty() : new RecoverWith(f, stream);
};

/**
 * Create a stream containing only an error
 * @param {*} e error value, preferably an Error or Error subtype
 * @returns {Stream} new stream containing only an error
 */
var throwError = function throwError(e) {
  return new ErrorStream(e);
};

var ErrorStream = /*#__PURE__*/function () {
  function ErrorStream(e) {
    classCallCheck(this, ErrorStream);

    this.value = e;
  }

  ErrorStream.prototype.run = function run(sink, scheduler$$1) {
    return asap(propagateErrorTask$1(this.value, sink), scheduler$$1);
  };

  return ErrorStream;
}();

var RecoverWith = /*#__PURE__*/function () {
  function RecoverWith(f, source) {
    classCallCheck(this, RecoverWith);

    this.f = f;
    this.source = source;
  }

  RecoverWith.prototype.run = function run(sink, scheduler$$1) {
    return new RecoverWithSink(this.f, this.source, sink, scheduler$$1);
  };

  return RecoverWith;
}();

var RecoverWithSink = /*#__PURE__*/function () {
  function RecoverWithSink(f, source, sink, scheduler$$1) {
    classCallCheck(this, RecoverWithSink);

    this.f = f;
    this.sink = new SafeSink(sink);
    this.scheduler = scheduler$$1;
    this.disposable = source.run(this, scheduler$$1);
  }

  RecoverWithSink.prototype.event = function event(t, x) {
    tryEvent(t, x, this.sink);
  };

  RecoverWithSink.prototype.end = function end(t) {
    tryEnd(t, this.sink);
  };

  RecoverWithSink.prototype.error = function error(t, e) {
    var nextSink = this.sink.disable();

    tryDispose(t, this.disposable, this.sink);

    this._startNext(t, e, nextSink);
  };

  RecoverWithSink.prototype._startNext = function _startNext(t, x, sink) {
    try {
      this.disposable = this._continue(this.f, t, x, sink);
    } catch (e) {
      sink.error(t, e);
    }
  };

  RecoverWithSink.prototype._continue = function _continue(f, t, x, sink) {
    return run$1(sink, this.scheduler, withLocalTime$1(t, f(x)));
  };

  RecoverWithSink.prototype.dispose = function dispose() {
    return this.disposable.dispose();
  };

  return RecoverWithSink;
}();

var multicast = function multicast(stream) {
  return stream instanceof Multicast || isCanonicalEmpty(stream) ? stream : new Multicast(stream);
};

var Multicast = /*#__PURE__*/function () {
  function Multicast(source) {
    classCallCheck(this, Multicast);

    this.source = new MulticastSource(source);
  }

  Multicast.prototype.run = function run(sink, scheduler$$1) {
    return this.source.run(sink, scheduler$$1);
  };

  return Multicast;
}();

var MulticastSource = /*#__PURE__*/function () {
  function MulticastSource(source) {
    classCallCheck(this, MulticastSource);

    this.source = source;
    this.sinks = [];
    this.disposable = disposeNone();
  }

  MulticastSource.prototype.run = function run(sink, scheduler$$1) {
    var n = this.add(sink);
    if (n === 1) {
      this.disposable = this.source.run(this, scheduler$$1);
    }
    return disposeOnce(new MulticastDisposable(this, sink));
  };

  MulticastSource.prototype.dispose = function dispose() {
    var disposable$$1 = this.disposable;
    this.disposable = disposeNone();
    return disposable$$1.dispose();
  };

  MulticastSource.prototype.add = function add(sink) {
    this.sinks = append(sink, this.sinks);
    return this.sinks.length;
  };

  MulticastSource.prototype.remove = function remove$$1(sink) {
    var i = findIndex(sink, this.sinks);
    // istanbul ignore next
    if (i >= 0) {
      this.sinks = remove(i, this.sinks);
    }

    return this.sinks.length;
  };

  MulticastSource.prototype.event = function event(time, value) {
    var s = this.sinks;
    if (s.length === 1) {
      return s[0].event(time, value);
    }
    for (var i = 0; i < s.length; ++i) {
      tryEvent(time, value, s[i]);
    }
  };

  MulticastSource.prototype.end = function end(time) {
    var s = this.sinks;
    for (var i = 0; i < s.length; ++i) {
      tryEnd(time, s[i]);
    }
  };

  MulticastSource.prototype.error = function error(time, err) {
    var s = this.sinks;
    for (var i = 0; i < s.length; ++i) {
      s[i].error(time, err);
    }
  };

  return MulticastSource;
}();

var MulticastDisposable = /*#__PURE__*/function () {
  function MulticastDisposable(source, sink) {
    classCallCheck(this, MulticastDisposable);

    this.source = source;
    this.sink = sink;
  }

  MulticastDisposable.prototype.dispose = function dispose() {
    if (this.source.remove(this.sink) === 0) {
      this.source.dispose();
    }
  };

  return MulticastDisposable;
}();

/** @license MIT License (c) copyright 2016 original author or authors */
/* eslint-disable import/first */
var zipItems$$1 = /*#__PURE__*/curry3(zipItems$1);
var withItems$$1 = /*#__PURE__*/curry2(withItems$1);

// -----------------------------------------------------------------------
// Observing

var runEffects$$1 = /*#__PURE__*/curry2(runEffects$1);
var run$$1 = /*#__PURE__*/curry3(run$1);

// -------------------------------------------------------

var withLocalTime$$1 = /*#__PURE__*/curry2(withLocalTime$1);

// -------------------------------------------------------

var loop$$1 = /*#__PURE__*/curry3(loop$1);

// -------------------------------------------------------

var scan$$1 = /*#__PURE__*/curry3(scan$1);

// -----------------------------------------------------------------------
// Extending

var startWith$$1 = /*#__PURE__*/curry2(startWith$1);

// -----------------------------------------------------------------------
// Transforming

var map$1 = /*#__PURE__*/curry2(map$2);
var constant$$1 = /*#__PURE__*/curry2(constant$1);
var tap$$1 = /*#__PURE__*/curry2(tap$1);
var ap$$1 = /*#__PURE__*/curry2(ap$1);

// -----------------------------------------------------------------------
// FlatMapping

var chain$$1 = /*#__PURE__*/curry2(chain$1);
var continueWith$$1 = /*#__PURE__*/curry2(continueWith$1);

var concatMap$$1 = /*#__PURE__*/curry2(concatMap$1);

// -----------------------------------------------------------------------
// Concurrent merging

var mergeConcurrently$$1 = /*#__PURE__*/curry2(mergeConcurrently$1);
var mergeMapConcurrently$$1 = /*#__PURE__*/curry3(mergeMapConcurrently$1);

// -----------------------------------------------------------------------
// Merging

var merge$$1 = /*#__PURE__*/curry2(merge$1);
// -----------------------------------------------------------------------
// Combining

var combine$$1 = /*#__PURE__*/curry3(combine$1);
var combineArray$$1 = /*#__PURE__*/curry2(combineArray$1);

// -----------------------------------------------------------------------
// Sampling

var sample$$1 = /*#__PURE__*/curry2(sample$1);
var snapshot$$1 = /*#__PURE__*/curry3(snapshot$1);

// -----------------------------------------------------------------------
// Zipping

var zip$$1 = /*#__PURE__*/curry3(zip$1);
var zipArray$$1 = /*#__PURE__*/curry2(zipArray$1);

// -----------------------------------------------------------------------
// Filtering

var filter$$1 = /*#__PURE__*/curry2(filter$1);
var skipRepeatsWith$$1 = /*#__PURE__*/curry2(skipRepeatsWith$1);

// -----------------------------------------------------------------------
// Slicing

var take$$1 = /*#__PURE__*/curry2(take$1);
var skip$$1 = /*#__PURE__*/curry2(skip$1);
var slice$$1 = /*#__PURE__*/curry3(slice$1);
var takeWhile$$1 = /*#__PURE__*/curry2(takeWhile$1);
var skipWhile$$1 = /*#__PURE__*/curry2(skipWhile$1);
var skipAfter$$1 = /*#__PURE__*/curry2(skipAfter$1);

// -----------------------------------------------------------------------
// Time slicing

var until$$1 = /*#__PURE__*/curry2(until$1);
var since$$1 = /*#__PURE__*/curry2(since$1);
var during$$1 = /*#__PURE__*/curry2(during$1);

// -----------------------------------------------------------------------
// Delaying

var delay$1 = /*#__PURE__*/curry2(delay$2);

// -----------------------------------------------------------------------
// Rate limiting

var throttle$$1 = /*#__PURE__*/curry2(throttle$1);
var debounce$$1 = /*#__PURE__*/curry2(debounce$1);

// -----------------------------------------------------------------------
// Error handling

var recoverWith$$1 = /*#__PURE__*/curry2(recoverWith$1);
// ----------------------------------------------------------------------
var propagateTask$$1 = /*#__PURE__*/curry3(propagateTask$1);
var propagateEventTask$$1 = /*#__PURE__*/curry2(propagateEventTask$1);
var propagateErrorTask$$1 = /*#__PURE__*/curry2(propagateErrorTask$1);

export { zipItems$$1 as zipItems, withItems$$1 as withItems, runEffects$$1 as runEffects, run$$1 as run, withLocalTime$$1 as withLocalTime, loop$$1 as loop, scan$$1 as scan, startWith$$1 as startWith, map$1 as map, constant$$1 as constant, tap$$1 as tap, ap$$1 as ap, chain$$1 as chain, join, continueWith$$1 as continueWith, concatMap$$1 as concatMap, mergeConcurrently$$1 as mergeConcurrently, mergeMapConcurrently$$1 as mergeMapConcurrently, merge$$1 as merge, mergeArray, combine$$1 as combine, combineArray$$1 as combineArray, sample$$1 as sample, snapshot$$1 as snapshot, zip$$1 as zip, zipArray$$1 as zipArray, filter$$1 as filter, skipRepeats, skipRepeatsWith$$1 as skipRepeatsWith, take$$1 as take, skip$$1 as skip, slice$$1 as slice, takeWhile$$1 as takeWhile, skipWhile$$1 as skipWhile, skipAfter$$1 as skipAfter, until$$1 as until, since$$1 as since, during$$1 as during, delay$1 as delay, throttle$$1 as throttle, debounce$$1 as debounce, recoverWith$$1 as recoverWith, throwError, propagateTask$$1 as propagateTask, propagateEventTask$$1 as propagateEventTask, propagateErrorTask$$1 as propagateErrorTask, propagateEndTask, empty, never, now, at, periodic$1 as periodic, newStream, switchLatest, fromPromise, awaitPromises, multicast, MulticastSource };
//# sourceMappingURL=index.es.js.map

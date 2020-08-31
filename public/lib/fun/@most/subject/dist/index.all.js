var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var core_1 = mostCore;
var ProxyStream = /** @class */ (function (_super) {
    __extends(ProxyStream, _super);
    function ProxyStream() {
        var _this = _super.call(this, core_1.never()) || this;
        _this.attached = false;
        _this.running = false;
        return _this;
    }
    ProxyStream.prototype.run = function (sink, scheduler) {
        this.scheduler = scheduler;
        this.add(sink);
        var shouldRun = this.attached && !this.running;
        if (shouldRun) {
            this.running = true;
            this.disposable = this.source.run(this, scheduler);
            return this.disposable;
        }
        return new ProxyDisposable(this, sink);
    };
    ProxyStream.prototype.attach = function (stream) {
        if (this.attached)
            throw new Error('Can only attach 1 stream');
        this.attached = true;
        this.source = stream;
        var hasMoreSinks = this.sinks.length > 0;
        if (hasMoreSinks)
            this.disposable = stream.run(this, this.scheduler);
        return stream;
    };
    ProxyStream.prototype.error = function (time, error) {
        this.cleanup();
        _super.prototype.error.call(this, time, error);
    };
    ProxyStream.prototype.end = function (time) {
        this.cleanup();
        _super.prototype.end.call(this, time);
    };
    ProxyStream.prototype.cleanup = function () {
        this.attached = false;
        this.running = false;
    };
    return ProxyStream;
}(core_1.MulticastSource));



var ProxyDisposable = /** @class */ (function () {
    function ProxyDisposable(source, sink) {
        this.source = source;
        this.sink = sink;
        this.disposed = false;
    }
    ProxyDisposable.prototype.dispose = function () {
        if (this.disposed)
            return;
        var _a = this, source = _a.source, sink = _a.sink;
        this.disposed = true;
        var remainingSinks = source.remove(sink);
        var hasNoMoreSinks = remainingSinks === 0;
        return hasNoMoreSinks && source.dispose();
    };
    return ProxyDisposable;
}());
//# sourceMappingURL=ProxyStream.js.map

var prelude_1 = mostPrelude;

function __event(time, value, sink) {
    sink.event(time, value);
}


function __error(time, error, sink) {
    sink.error(time, error);
}


function __end(time, sink) {
    sink.end(time);
}

function create(f) {
    if (f === void 0) { f = prelude_1.id; }
    var source = new ProxyStream.ProxyStream();
    return [source, f(source)];
}


function __attach(sink, stream) {
    return sink.attach(stream);
}

let attach = prelude_1.curry2(__attach);
let end = prelude_1.curry2(__end);
let error = prelude_1.curry3(__error);
let event = prelude_1.curry3(__event);

export { attach, end, error, event, create, ProxyStream };